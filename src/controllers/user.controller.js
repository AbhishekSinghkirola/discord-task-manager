import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/User.js";
import uploadOnCloudinary from "../utils/cloudinary.js"

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


export const uploadCsv = asyncHandler(async (req,res) => {
  // is user logged in ? //middleware
  const {_id}  = req.loggedInUser;

  const user = await User.findById(_id);
  if(user.role != "ADMIN"){
    throw new ApiError(403,"You are not authorized");
  }

  if(!file){
    throw new ApiError();
  }

  const localPath = req.files?.student-csv[0]?.path;

  if(!localPath){
    throw new ApiError(400, "CSV file is required");
  }

  const csvFile = await uploadOnCloudinary(localPath);

  if(!csvFile){
    throw new ApiError(400, "CSV file is required")
  }

  return res
         .status(200)
         .json(new ApiResponse(200, "File uploaded successfully", csvFile))
})