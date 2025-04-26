import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import axios from "axios";
import { User } from "../models/User.models.js";

export const login = asyncHandler(async (req, res) => {
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const url = `${process.env.DISCORD_URL}?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

  res.redirect(url);
});

export const authorizeDiscord = asyncHandler(async (req, res) => {
  const code = req.query.code;

  if (!code) {
    throw new ApiError(400, "No code provided");
  }

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    scope: "identify",
  });

  const tokenRes = await axios.post(
    "https://discord.com/api/oauth2/token",
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const accessToken = tokenRes.data.access_token;

  console.log("accessToken....", accessToken);

  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = userRes.data;

  res.send(`<h1>Welcome, ${user.username}#${user.discriminator}</h1>`);
});

export const adminRegister = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email, role: "ADMIN" });

  if (existingUser) {
    throw new ApiError(409, "User already exists.");
  }
  const newUser = await User.create({
    email,
    password,
    role: "ADMIN",
  });

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();
  newUser.refreshToken = refreshToken;
  await newUser.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const data = {
    accessToken,
    refreshToken,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Registration successful", data));
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email, role: "ADMIN" });

  if (!existingUser) {
    throw new ApiError(404, "User does not exist.");
  }

  const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const accessToken = existingUser.generateAccessToken();
  const refreshToken = existingUser.generateRefreshToken();

  existingUser.refreshToken = refreshToken;

  existingUser.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const data = {
    accessToken,
    refreshToken,
  };

  return res.status(200).json(new ApiResponse(200, "Login successful", data));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  await User.findByIdAndUpdate(req.loggedInUser._id, {
    $unset: { refreshToken: 1 },
  });

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });

  if (!user) {
    throw new ApiError(400, "Invalid Refresh Token.");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json(
    new ApiResponse(200, "Token refreshed", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.loggedInUser._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials.");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});
