// Mount once inside both <ClerkProvider> and <WalletProvider> to auto-connect
// the wallet adapter when a user has a Solana address in their Clerk profile.

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

// Solana base58 public keys are 32–44 chars and do not start with "0x" (Ethereum).
function getSolanaAddressFromClerk(
  web3Wallets: Array<{ web3Wallet: string }>,
): string | null {
  for (const w of web3Wallets) {
    const addr = w.web3Wallet;
    if (addr && !addr.startsWith('0x') && addr.length >= 32 && addr.length <= 44) {
      return addr;
    }
  }
  return null;
}

export function useClerkSolanaSync(): void {
  const { isLoaded, isSignedIn, user } = useUser();
  const {
    publicKey,
    connected,
    connecting,
    wallets,
    select,
    connect,
  } = useSolanaWallet();

  // Prevent repeated connection attempts on re-renders within a single session.
  const attempted = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const clerkSolanaAddress = getSolanaAddressFromClerk(user.web3Wallets ?? []);
    if (!clerkSolanaAddress) return;

    if (connected && publicKey && publicKey.toBase58() === clerkSolanaAddress) {
      attempted.current = true;
      return;
    }

    if (connecting || attempted.current) return;

    attempted.current = true;

    // If an adapter is already unlocked from a prior session, match by public key.
    const matchByAddress = wallets.find(
      w => w.adapter.publicKey?.toBase58() === clerkSolanaAddress,
    );
    if (matchByAddress) {
      select(matchByAddress.adapter.name);
      connect().catch(() => {
        // Swallow — user may have revoked permissions; they can reconnect manually.
      });
      return;
    }

    // If exactly one wallet extension is installed, use it unambiguously.
    const detected = wallets.filter(w => w.readyState === 'Installed');
    if (detected.length === 1) {
      select(detected[0].adapter.name);
      connect().catch(() => {});
      return;
    }

    // Multiple (or zero) extensions detected — cannot safely auto-select.
    // WalletProvider's autoConnect will re-connect the last-used wallet on its
    // own; showing the wallet modal once is preferable to connecting the wrong one.
  }, [isLoaded, isSignedIn, user, connected, connecting, publicKey, wallets, select, connect]);

  // Reset on sign-out so the next sign-in can attempt auto-connect again.
  useEffect(() => {
    if (!isSignedIn) {
      attempted.current = false;
    }
  }, [isSignedIn]);
}
