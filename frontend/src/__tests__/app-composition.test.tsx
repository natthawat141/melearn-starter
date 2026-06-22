import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

// Mock next/font/google — it is a build-time transform unavailable under Vitest.
vi.mock('next/font/google', () => ({
  Sora: () => ({ variable: '--font-sora', className: 'font-sora' }),
  Source_Sans_3: () => ({ variable: '--font-source-sans', className: 'font-source-sans' }),
}));

// Mock Clerk provider to a passthrough so we exercise the composition, not the SDK.
vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
  // useUser is called by useClerkSolanaSync — return a not-signed-in state.
  useUser: () => ({ isLoaded: true, isSignedIn: false, user: null }),
}));

// Mock SolanaProvider to a passthrough (its own wiring is covered separately and
// pulls in browser-only wallet adapters).
vi.mock('@/components/providers/SolanaProvider', () => ({
  SolanaProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="solana-provider">{children}</div>
  ),
}));

// Mock wallet-adapter-react so useClerkSolanaSync can run inside AppShell.
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    publicKey: null,
    connected: false,
    connecting: false,
    wallets: [],
    select: vi.fn(),
    connect: vi.fn(async () => {}),
  }),
}));

// globals.css import is handled by vitest css:true, but stub to be safe.
vi.mock('@/styles/globals.css', () => ({}));

import App from '@/pages/_app';

describe('_app provider composition', () => {
  it('renders the page inside the Clerk > Solana provider stack without crashing', () => {
    const DummyPage = () => <div data-testid="page">hello</div>;

    render(
      <App
        Component={DummyPage as never}
        pageProps={{}}
        router={{} as never}
      />,
    );

    const clerk = screen.getByTestId('clerk-provider');
    const solana = screen.getByTestId('solana-provider');
    const page = screen.getByTestId('page');

    // Provider nesting order: Clerk wraps Solana wraps the page.
    expect(clerk).toContainElement(solana);
    expect(solana).toContainElement(page);
    expect(page).toHaveTextContent('hello');
  });
});
