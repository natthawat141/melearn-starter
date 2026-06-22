import { ClerkProvider } from '@clerk/nextjs';
import { Sora, Source_Sans_3 } from 'next/font/google';
import { SolanaProvider } from '@/components/providers/SolanaProvider';
import { useClerkSolanaSync } from '@/hooks/useClerkSolanaSync';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-sora',
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-sans',
  display: 'swap',
});

// Sits inside both ClerkProvider and SolanaProvider so both contexts are available.
function AppShell({ Component, pageProps }: AppProps) {
  useClerkSolanaSync();

  return (
    <div className={`${sora.variable} ${sourceSans3.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}

export default function App(props: AppProps) {
  return (
    <ClerkProvider {...props.pageProps}>
      <SolanaProvider>
        <AppShell {...props} />
      </SolanaProvider>
    </ClerkProvider>
  );
}
