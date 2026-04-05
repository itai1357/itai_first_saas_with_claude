import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { initRequestContext, getLogger } from "@myorg/logger";
import { AppError, withErrorHandler, sendErrorResponse } from "@myorg/api-utils";
import { initConfigManager, getConfigManager } from "@myorg/config-manager";
import { requireAuth, getAuthUser } from "./auth";

const app = express();

app.use(cors());

app.use((req, res, next) => {
  const requestId = uuidv4();
  initRequestContext(requestId);
  res.setHeader("x-request-id", requestId);
  initConfigManager();
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const WORDS = ["sunshine", "butterfly", "mountain", "ocean", "galaxy", "thunder", "whisper", "crystal"];

app.get(
  "/test/success",
  requireAuth,
  withErrorHandler(async (req, res) => {
    const logger = getLogger();
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    logger.info("Success endpoint hit", { word });
    res.json({ data: word });
  })
);

app.get(
  "/test/error",
  requireAuth,
  withErrorHandler(async (req, res) => {
    const logger = getLogger();
    logger.info("Error endpoint hit");
    throw new Error("Something went wrong");
  })
);

app.get(
  "/test/protected",
  requireAuth,
  withErrorHandler(async (req, res) => {
    const logger = getLogger();
    const user = getAuthUser(req);
    logger.info("Protected endpoint accessed", { userId: user.id });
    res.json({ data: `Hello, user ${user.id}` });
  })
);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  sendErrorResponse(err, res);
});

async function main() {
  initConfigManager();
  const config = getConfigManager();
  const port = config.get("PORT") ?? "3001";

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

main();
