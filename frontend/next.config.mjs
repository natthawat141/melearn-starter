/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // The @solana/wallet-adapter-wallets bundle pulls in @solana/wallet-adapter-ledger
    // which uses ESM bare specifiers that break under paths containing spaces in Node 22.
    // Exclude heavy/broken adapters from the server-side bundle; browser wallets
    // (Phantom, Solflare, Backpack) detect themselves client-side via the Standard
    // Wallet API so no server-side code is needed for them.
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        '@ledgerhq/errors',
        '@ledgerhq/devices',
        '@ledgerhq/hw-transport',
        '@ledgerhq/hw-app-solana',
        '@solana/wallet-adapter-ledger',
        '@walletconnect/solana-adapter',
        '@reown/appkit',
      ];
    }
    // Suppress the dynamic require() warning from ox/viem (transitive dep of wallet-connect)
    config.module = config.module ?? {};
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;
