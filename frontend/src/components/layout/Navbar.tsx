import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SignInButton, UserButton, Show } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import type { NavItem } from '@/types';

// wallet-adapter reads client-only state; SSR markup never matches. Load client-side
// only to avoid hydration mismatch.
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((m) => m.WalletMultiButton),
  { ssr: false },
);

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { pathname } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-sm">
          <Image
            src="/img/logo.PNG"
            alt="Melearn"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                pathname === href
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WalletMultiButton
            style={{
              height: '34px',
              fontSize: '13px',
              padding: '0 12px',
              borderRadius: '6px',
              background: '#3b82f6',
            }}
          />

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-3 py-1.5 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                Sign in
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </Show>

          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            onClick={() => setMobileOpen(v => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" className="lg:hidden bg-white border-t border-gray-100 px-4 py-2" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-md font-medium text-sm mb-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                pathname === href
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="mt-2 px-2 pb-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="w-full px-3 py-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                  Sign in
                </button>
              </SignInButton>
            </Show>
          </div>
        </nav>
      )}
    </header>
  );
}
