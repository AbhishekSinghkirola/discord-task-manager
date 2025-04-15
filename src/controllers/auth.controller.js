import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import axios from "axios";

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

  console.log("user....", user);
  res.send(`<h1>Welcome, ${user.username}#${user.discriminator}</h1>`);
});
