"use client";

import { useCallback, useMemo } from "react";
import { useAuth as useClerkAuth, useUser as useClerkUser } from "@clerk/nextjs";
import type { AuthState } from "@myorg/auth";

export function useAuth(): AuthState {
  const { isSignedIn, getToken } = useClerkAuth();
  const { user } = useClerkUser();

  const stableGetToken = useCallback(() => getToken(), [getToken]);

  return useMemo(
    () => ({
      isAuthenticated: !!isSignedIn,
      user:
        isSignedIn && user
          ? {
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
            }
          : null,
      getToken: stableGetToken,
    }),
    [isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress, stableGetToken],
  );
}
