import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { teamValidationRules } from "../validators/team.validators.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createTeam,
  getTeamsById,
  deleteTeam,
  getTeamsByProject,
} from "../controllers/team.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  teamValidationRules.createTeam,
  validate,
  createTeam
);

router.get(
  "/:teamId",
  authenticate,
  teamValidationRules.getTeamsById,
  validate,
  getTeamsById
);

router.get(
  "/project/:projectId",
  authenticate,
  teamValidationRules.getTeamsByProject,
  validate,
  getTeamsByProject
);

router.delete(
  "/:teamId",
  authenticate,
  teamValidationRules.deleteTeam,
  validate,
  deleteTeam
);

export default router;
