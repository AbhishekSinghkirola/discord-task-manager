import logger from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  logger.error("Internal Processiong Error %s", err.message, err.stack);
  res.status(err.statusCode).json({
    statusCode: err.statusCode || 500,
    success: false,
    message: err.message || "Something went wrong",
  });
};
