import express from "express";
import {
  login,
  authorizeDiscord,
  adminRegister,
  adminLogin,
  logout,
  refreshTokens,
  changePassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authValidationRules } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/login", login);

router.get("/discord-authorization", authorizeDiscord);

router.post(
  "/admin-register",
  validate,
  adminRegister
);

router.post("/admin-login", authValidationRules.login, validate, adminLogin);

router.post("/logout", authenticate, logout);

router.post(
  "/refresh-tokens",
  authValidationRules.refreshToken,
  validate,
  refreshTokens
);

router.patch(
  "/change-password",
  authenticate,
  authValidationRules.changePassword,
  validate,
  changePassword
);

export default router;
