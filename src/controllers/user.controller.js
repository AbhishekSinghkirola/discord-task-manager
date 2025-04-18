import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/User.js";

export const getLoggedInUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.loggedInUser._id)
    .select("-password -refreshToken")
    .populate("teamId");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const message = user.teamId
    ? "User details fetched successfully"
    : "User details fetched successfully (User is not part of any team)";

  return res.status(200).json(new ApiResponse(200, message, user));
});
