import app from "./app.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import client from "./utils/discord.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;
const BACKEND_URL = process.env.BACKEND_URL ?? `http://localhost:${PORT}`;

app.listen(PORT, () => {
  logger.info(`Server is running on ${BACKEND_URL}`);
});
