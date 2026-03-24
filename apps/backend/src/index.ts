import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { initRequestContext, getLogger } from "@myorg/logger";
import { AppError, withErrorHandler } from "@myorg/api-utils";

const app = express();
const PORT = 3001;

app.use(cors());

app.use((req, res, next) => {
  const requestId = uuidv4();
  initRequestContext(requestId);
  res.setHeader("x-request-id", requestId);
  next();
});

const WORDS = ["sunshine", "butterfly", "mountain", "ocean", "galaxy", "thunder", "whisper", "crystal"];

app.get(
  "/test/success",
  withErrorHandler(async (req, res) => {
    const logger = getLogger();
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    logger.info("Success endpoint hit", { word });
    res.json({ data: word });
  })
);

app.get(
  "/test/error",
  withErrorHandler(async (req, res) => {
    const logger = getLogger();
    logger.info("Error endpoint hit");
    throw new Error("Something went wrong");
  })
);

app.get(
  "/test/protected",
  withErrorHandler(async (req, res) => {
    const logger = getLogger();
    logger.info("Protected endpoint hit");
    throw new AppError(403, "FORBIDDEN", "You are not allowed");
  })
);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
