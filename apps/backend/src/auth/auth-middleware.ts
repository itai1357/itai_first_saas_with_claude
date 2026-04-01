import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { AuthUser } from "@myorg/auth";
import { AppError } from "@myorg/api-utils";
import { getLogger } from "@myorg/logger";
import { getConfigManager } from "@myorg/config-manager";
import "./types";

let cachedSecretKey: string | undefined;

function getSecretKey(): string {
  if (!cachedSecretKey) {
    const config = getConfigManager();
    cachedSecretKey = config.get("CLERK_SECRET_KEY", { required: true }) as string;
  }
  return cachedSecretKey;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  (async () => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "UNAUTHORIZED", "Missing or invalid authorization header");
    }

    const token = authHeader.slice(7);

    try {
      const payload = await verifyToken(token, { secretKey: getSecretKey() });

      const user: AuthUser = {
        id: payload.sub,
      };

      req.user = user;
      const logger = getLogger();
      logger.info("User authenticated", { userId: user.id });
      next();
    } catch (err) {
      if (err instanceof AppError) throw err;
      const logger = getLogger();
      logger.error("Token verification failed", {
        error: err instanceof Error ? err.message : "unknown",
      });
      throw new AppError(401, "UNAUTHORIZED", "Invalid or expired token");
    }
  })().catch(next);
}

export function getAuthUser(req: Request): AuthUser {
  if (!req.user) {
    throw new AppError(401, "UNAUTHORIZED", "User not authenticated");
  }
  return req.user;
}
