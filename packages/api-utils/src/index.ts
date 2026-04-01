import { Request, Response, NextFunction } from "express";
import { getLogger } from "@myorg/logger";

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = "AppError";
  }
}

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function sendErrorResponse(err: unknown, res: Response): void {
  const logger = getLogger();
  const requestId = res.getHeader("x-request-id") as string | undefined;

  if (err instanceof AppError) {
    logger.error(err.message, { errorCode: err.errorCode, statusCode: err.statusCode });
    res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
      requestId,
    });
  } else {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    logger.error(message);
    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      message,
      requestId,
    });
  }
}

export function withErrorHandler(fn: AsyncHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  };
}
