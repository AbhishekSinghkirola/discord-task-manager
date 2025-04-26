import express from "express";
import { createTeam } from "../controllers/team.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { teamValidationRules } from "../validators/team.validators.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  teamValidationRules.createTeam,
  validate,
  createTeam
);

export default router;
