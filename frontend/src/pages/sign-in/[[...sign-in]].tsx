// IMPORTANT: for the Solana wallet sign-in option to appear, enable it in the
// Clerk Dashboard → Configure → Web3 → toggle "Solana" ON.
// The <SignIn> component surfaces it automatically — no props required here.
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
