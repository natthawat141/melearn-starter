import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Cluster } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaProviderProps {
  children: ReactNode;
}

// Clerk owns identity; this provider owns on-chain access (signing, balances).
export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? 'devnet') as Cluster;
  const endpoint = useMemo(() => clusterApiUrl(cluster), [cluster]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Backpack is not in @solana/wallet-adapter-wallets@0.19 — users with Backpack
      // installed will still appear via wallet-adapter's standard wallet detection.
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
