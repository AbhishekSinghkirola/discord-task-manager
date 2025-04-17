import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

export const authenticate = (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.loggedInUser = decoded;

    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized - Invalid or expired token");
  }
};
