import express from "express";
import { getLoggedInUser } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticate, getLoggedInUser);

export default router;
