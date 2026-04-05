"use client";

import { SignOutButton } from "@clerk/nextjs";

export function LogoutButton() {
  return (
    <SignOutButton>
      <button className="btn-error">Sign Out</button>
    </SignOutButton>
  );
}
