import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mutable mock state for the underlying Solana adapter hook.
const adapterState = {
  publicKey: null as { toBase58: () => string } | null,
  connecting: false,
  connect: vi.fn(async () => {}),
  disconnect: vi.fn(async () => {}),
  wallet: null as unknown,
};

vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => adapterState,
  useConnection: () => ({ connection: {} }),
}));

import { useWallet } from './useWallet';

function makeKey(base58: string) {
  return { toBase58: () => base58 };
}

describe('useWallet', () => {
  beforeEach(() => {
    adapterState.publicKey = null;
    adapterState.connecting = false;
    adapterState.wallet = null;
    adapterState.connect = vi.fn(async () => {});
    adapterState.disconnect = vi.fn(async () => {});
  });

  it('reports disconnected state with null address when no publicKey', () => {
    const { result } = renderHook(() => useWallet());

    expect(result.current.address).toBeNull();
    expect(result.current.shortAddress).toBeNull();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.isConnecting).toBe(false);
  });

  it('derives full and truncated address from the publicKey', () => {
    adapterState.publicKey = makeKey('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456');

    const { result } = renderHook(() => useWallet());

    expect(result.current.address).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456');
    expect(result.current.shortAddress).toBe('ABCD…3456');
    expect(result.current.isConnected).toBe(true);
  });

  it('reflects the connecting flag from the adapter', () => {
    adapterState.connecting = true;
    const { result } = renderHook(() => useWallet());
    expect(result.current.isConnecting).toBe(true);
  });

  it('does NOT call adapter connect when no wallet is selected', async () => {
    adapterState.wallet = null;
    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    expect(adapterState.connect).not.toHaveBeenCalled();
  });

  it('calls adapter connect when a wallet is selected', async () => {
    adapterState.wallet = { adapter: { name: 'Phantom' } };
    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    expect(adapterState.connect).toHaveBeenCalledOnce();
  });

  it('delegates disconnect to the adapter', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.disconnect();
    });

    expect(adapterState.disconnect).toHaveBeenCalledOnce();
  });

  it('propagates connect rejection to the caller', async () => {
    adapterState.wallet = { adapter: { name: 'Phantom' } };
    adapterState.connect = vi.fn(async () => {
      throw new Error('user rejected');
    });
    const { result } = renderHook(() => useWallet());

    await expect(
      act(async () => {
        await result.current.connect();
      }),
    ).rejects.toThrow('user rejected');
  });
});
