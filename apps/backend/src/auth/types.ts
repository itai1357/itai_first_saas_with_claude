import { AuthUser } from "@myorg/auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
