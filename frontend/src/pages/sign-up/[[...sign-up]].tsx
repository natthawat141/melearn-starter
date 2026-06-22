// IMPORTANT: for the Solana wallet sign-up option to appear, enable it in the
// Clerk Dashboard → Configure → Web3 → toggle "Solana" ON.
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
