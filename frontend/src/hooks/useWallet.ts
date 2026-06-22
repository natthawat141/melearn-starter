// Clerk owns identity (sign-in, sessions). This hook is the on-chain layer —
// thin wrapper around @solana/wallet-adapter-react for feature components.

import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

export interface WalletState {
  address: string | null;
  shortAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useWallet(): WalletState {
  const { publicKey, connecting, connect: adapterConnect, disconnect: adapterDisconnect, wallet } = useSolanaWallet();

  const address = publicKey ? publicKey.toBase58() : null;
  const shortAddress = address
    ? `${address.slice(0, 4)}…${address.slice(-4)}`
    : null;

  const connect = useCallback(async () => {
    // connect() is a no-op when no wallet is selected; the user must click
    // WalletMultiButton to trigger wallet selection in that case.
    if (wallet) {
      await adapterConnect();
    }
  }, [wallet, adapterConnect]);

  const disconnect = useCallback(async () => {
    await adapterDisconnect();
  }, [adapterDisconnect]);

  return {
    address,
    shortAddress,
    isConnected: !!publicKey,
    isConnecting: connecting,
    connect,
    disconnect,
  };
}

// Re-export for convenience in feature components that also need the connection.
export { useConnection };
