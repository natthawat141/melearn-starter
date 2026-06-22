import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Mutable mock state — tests mutate these to simulate different scenarios.
// ---------------------------------------------------------------------------

const clerkState = {
  isLoaded: true,
  isSignedIn: false as boolean | null,
  user: null as {
    web3Wallets: Array<{ web3Wallet: string }>;
  } | null,
};

const solanaState = {
  publicKey: null as { toBase58: () => string } | null,
  connected: false,
  connecting: false,
  wallets: [] as Array<{
    adapter: { name: string; publicKey: { toBase58: () => string } | null };
    readyState: string;
  }>,
  select: vi.fn<[string], void>(),
  connect: vi.fn(async () => {}),
};

vi.mock('@clerk/nextjs', () => ({
  useUser: () => clerkState,
}));

vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => solanaState,
}));

import { useClerkSolanaSync } from './useClerkSolanaSync';

// A valid-length Solana base58 address (32 chars, no 0x prefix — real addresses are 32–44)
const SOLANA_ADDR = 'FakeSolanaAddress1234567890ABCDE';

describe('useClerkSolanaSync', () => {
  beforeEach(() => {
    clerkState.isLoaded = true;
    clerkState.isSignedIn = false;
    clerkState.user = null;
    solanaState.publicKey = null;
    solanaState.connected = false;
    solanaState.connecting = false;
    solanaState.wallets = [];
    solanaState.select = vi.fn();
    solanaState.connect = vi.fn(async () => {});
  });

  it('does nothing when Clerk is not yet loaded', () => {
    clerkState.isLoaded = false;
    renderHook(() => useClerkSolanaSync());
    expect(solanaState.select).not.toHaveBeenCalled();
    expect(solanaState.connect).not.toHaveBeenCalled();
  });

  it('does nothing when user is not signed in', () => {
    clerkState.isSignedIn = false;
    clerkState.user = null;
    renderHook(() => useClerkSolanaSync());
    expect(solanaState.select).not.toHaveBeenCalled();
  });

  it('does nothing when signed in user has no web3 wallets', () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [] };
    renderHook(() => useClerkSolanaSync());
    expect(solanaState.select).not.toHaveBeenCalled();
  });

  it('does nothing when the Clerk web3 wallet is an Ethereum address (0x prefix)', () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [{ web3Wallet: '0xAbCdEf1234567890' }] };
    renderHook(() => useClerkSolanaSync());
    expect(solanaState.select).not.toHaveBeenCalled();
  });

  it('does nothing when the wallet adapter is already connected to the matching address', () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [{ web3Wallet: SOLANA_ADDR }] };
    solanaState.connected = true;
    solanaState.publicKey = { toBase58: () => SOLANA_ADDR };
    renderHook(() => useClerkSolanaSync());
    expect(solanaState.select).not.toHaveBeenCalled();
    expect(solanaState.connect).not.toHaveBeenCalled();
  });

  it('auto-selects and connects a wallet whose publicKey matches the Clerk address', async () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [{ web3Wallet: SOLANA_ADDR }] };
    solanaState.connected = false;
    solanaState.wallets = [
      {
        adapter: { name: 'Phantom', publicKey: { toBase58: () => SOLANA_ADDR } },
        readyState: 'Installed',
      },
    ];

    await act(async () => {
      renderHook(() => useClerkSolanaSync());
    });

    expect(solanaState.select).toHaveBeenCalledWith('Phantom');
    expect(solanaState.connect).toHaveBeenCalledOnce();
  });

  it('auto-selects the single detected wallet when no publicKey match is possible', async () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [{ web3Wallet: SOLANA_ADDR }] };
    solanaState.wallets = [
      {
        adapter: { name: 'Solflare', publicKey: null },
        readyState: 'Installed',
      },
    ];

    await act(async () => {
      renderHook(() => useClerkSolanaSync());
    });

    expect(solanaState.select).toHaveBeenCalledWith('Solflare');
    expect(solanaState.connect).toHaveBeenCalledOnce();
  });

  it('does NOT auto-select when multiple wallets are detected (ambiguous)', async () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [{ web3Wallet: SOLANA_ADDR }] };
    solanaState.wallets = [
      { adapter: { name: 'Phantom', publicKey: null }, readyState: 'Installed' },
      { adapter: { name: 'Solflare', publicKey: null }, readyState: 'Installed' },
    ];

    await act(async () => {
      renderHook(() => useClerkSolanaSync());
    });

    expect(solanaState.select).not.toHaveBeenCalled();
    expect(solanaState.connect).not.toHaveBeenCalled();
  });

  it('does not retry connect on every render after the first attempt', async () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [{ web3Wallet: SOLANA_ADDR }] };
    solanaState.wallets = [
      { adapter: { name: 'Phantom', publicKey: null }, readyState: 'Installed' },
    ];

    const { rerender } = renderHook(() => useClerkSolanaSync());
    await act(async () => {});
    await act(async () => { rerender(); });
    await act(async () => { rerender(); });

    // connect should have been called exactly once despite multiple renders
    expect(solanaState.connect).toHaveBeenCalledOnce();
  });

  it('swallows a connect() rejection without throwing', async () => {
    clerkState.isSignedIn = true;
    clerkState.user = { web3Wallets: [{ web3Wallet: SOLANA_ADDR }] };
    solanaState.wallets = [
      { adapter: { name: 'Phantom', publicKey: null }, readyState: 'Installed' },
    ];
    solanaState.connect = vi.fn(async () => {
      throw new Error('User rejected');
    });

    // Should not throw out to the test
    await act(async () => {
      renderHook(() => useClerkSolanaSync());
    });

    expect(solanaState.select).toHaveBeenCalledWith('Phantom');
  });
});
