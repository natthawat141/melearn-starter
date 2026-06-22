import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

// --- next/router ---
const routerState = { pathname: '/' };
vi.mock('next/router', () => ({
  useRouter: () => routerState,
}));

// --- next/link: render a plain anchor ---
vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: { children: ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// --- next/image: render a plain img so alt-text assertions work ---
vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...(rest as Record<string, unknown>)} />
  ),
}));

// --- Clerk: Show gates children by auth state we control per-test ---
const authState = { signedIn: false };
vi.mock('@clerk/nextjs', () => ({
  Show: ({ when, children }: { when: string; children: ReactNode }) => {
    const visible =
      (when === 'signed-in' && authState.signedIn) ||
      (when === 'signed-out' && !authState.signedIn);
    return visible ? <>{children}</> : null;
  },
  SignInButton: ({ children }: { children: ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
  UserButton: () => <div data-testid="user-button">user</div>,
}));

// --- Solana wallet button ---
vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button type="button">Select Wallet</button>,
}));

import Navbar from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    routerState.pathname = '/';
    authState.signedIn = false;
  });

  it('renders the brand logo with an accessible alt text', () => {
    render(<Navbar />);
    expect(screen.getByAltText('Melearn')).toBeInTheDocument();
  });

  it('renders all primary navigation links', () => {
    render(<Navbar />);
    const mainNav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(mainNav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(mainNav).getByRole('link', { name: 'Courses' })).toHaveAttribute('href', '/courses');
    expect(within(mainNav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(within(mainNav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
  });

  it('marks the active route on the current pathname', () => {
    routerState.pathname = '/courses';
    render(<Navbar />);
    const mainNav = screen.getByRole('navigation', { name: 'Main navigation' });
    const coursesLink = within(mainNav).getByRole('link', { name: 'Courses' });
    expect(coursesLink.className).toContain('bg-blue-500');
  });

  it('renders the wallet connect button', () => {
    render(<Navbar />);
    expect(screen.getByRole('button', { name: 'Select Wallet' })).toBeInTheDocument();
  });

  it('shows the Sign in button when signed out and hides the user avatar', () => {
    authState.signedIn = false;
    render(<Navbar />);
    expect(screen.getAllByRole('button', { name: 'Sign in' }).length).toBeGreaterThan(0);
    expect(screen.queryByTestId('user-button')).not.toBeInTheDocument();
  });

  it('shows the user avatar when signed in and hides Sign in', () => {
    authState.signedIn = true;
    render(<Navbar />);
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('toggles the mobile menu via the hamburger button', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    // Mobile nav is not in the DOM initially.
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();

    // Open — button reads "เปิดเมนู" when closed.
    await user.click(screen.getByRole('button', { name: 'เปิดเมนู' }));
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();

    // Close — button reads "ปิดเมนู" when open (aria-label reflects state).
    await user.click(screen.getByRole('button', { name: 'ปิดเมนู' }));
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('closes the mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'เปิดเมนู' }));
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    await user.click(within(mobileNav).getByRole('link', { name: 'Home' }));

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('exposes an accessible label on the icon-only hamburger button', () => {
    render(<Navbar />);
    expect(screen.getByRole('button', { name: 'เปิดเมนู' })).toBeInTheDocument();
  });
});
