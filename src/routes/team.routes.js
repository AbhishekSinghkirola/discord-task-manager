import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { teamValidationRules } from "../validators/team.validators.js";
import { validate } from "../middlewares/validate.middleware.js";

import { createTeam, getTeams } from "../controllers/team.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  teamValidationRules.createTeam,
  validate,
  createTeam
);

router("/", authenticate, getTeams);

export default router;
