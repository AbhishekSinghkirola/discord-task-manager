import express from "express";
import { login, authorizeDiscord } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", login);

router.get("/discord-authorization", authorizeDiscord);

export default router;
