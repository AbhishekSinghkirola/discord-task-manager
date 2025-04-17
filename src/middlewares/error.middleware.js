import logger from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  logger.error("Internal Processiong Error %s", err.message, {
    stack: err.stack,
  });
  return res.status(err?.statusCode ?? 500).json({
    statusCode: err?.statusCode || 500,
    success: false,
    message: err.message || "Something went wrong",
  });
};
