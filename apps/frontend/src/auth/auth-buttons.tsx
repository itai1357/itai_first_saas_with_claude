"use client";

import { SignInButton, SignOutButton } from "@clerk/nextjs";

export function LoginButton() {
  return (
    <SignInButton mode="modal">
      <button className="btn-success">Sign In</button>
    </SignInButton>
  );
}

export function LogoutButton() {
  return (
    <SignOutButton>
      <button className="btn-error">Sign Out</button>
    </SignOutButton>
  );
}
