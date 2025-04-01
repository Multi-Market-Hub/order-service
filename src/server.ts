import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import awsRoutes from "./routes/awsRoutes"; // Make sure the path is correct
import helmet from "helmet";
import logger from "./utils/logger"; // Assuming you have a logger configured (for Winston logging)

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Route for AWS related operations
app.use("/aws", awsRoutes);

// Home route
app.get("/", (req, res) => {
  res.send(`AWS SERVICES IS RUNNING AT ${PORT}`);
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
