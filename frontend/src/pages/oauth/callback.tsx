// Stale OAuth callback route kept to redirect old links. Auth is now Clerk;
// wallet connection is Solana wallet-adapter.
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return null;
}
