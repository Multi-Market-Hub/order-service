import express from "express";
import {
  uploadToS3,
  sendEmailHandler,
  listOfVerifiedEmailHandler,
  verifyEmailHandler,
} from "../controllers/fileController";
import upload from "../config/multerS3Config";
import logger from "../utils/logger"; // Import Winston logger

const router = express.Router();

// Middleware for logging requests
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Endpoint to upload file to S3
router.post("/upload", upload.single("file"), uploadToS3);

// Endpoint to send email using SES
router.post("/send-email", sendEmailHandler);

router.get("/verified-emails", listOfVerifiedEmailHandler);
router.post("/verify-email", verifyEmailHandler);

// Middleware for logging responses
router.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(`Response sent: ${res.statusCode} ${req.method} ${req.url}`);
  });
  next();
});

export default router;
