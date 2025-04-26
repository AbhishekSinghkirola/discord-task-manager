import app from "./app.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import { loginBot } from "./utils/discord.js";
import connectDB from "./utils/db.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;
const BACKEND_URL = process.env.BACKEND_URL ?? `http://localhost:${PORT}`;

(async () => {
  try {
    await connectDB();

    await loginBot();

    app.listen(process.env.PORT, () => {
      logger.info(`Server is running on ${BACKEND_URL}`);
    });
  } catch (error) {
    logger.error("Error establishing server %s", error.message, {
      stack: error.stack,
    });
  }
})();
