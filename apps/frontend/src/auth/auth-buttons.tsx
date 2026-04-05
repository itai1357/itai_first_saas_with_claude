"use client";

import { SignIn as ClerkSignIn, SignOutButton } from "@clerk/nextjs";

export function SignInForm() {
  return <ClerkSignIn routing="hash" />;
}

export function LogoutButton() {
  return (
    <SignOutButton>
      <button className="btn-error">Sign Out</button>
    </SignOutButton>
  );
}
