import express from "express";
import {
  createProject,
  getProjectById,
  updateProject,
} from "../controllers/project.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { projectValidationRules } from "../validators/project.validators.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  projectValidationRules.createProject,
  validate,
  createProject
);

router.get("/:id", authenticate, getProjectById);
router.put(
  "/:id",
  authenticate,
  projectValidationRules.updateProject,
  validate,
  updateProject
);

export default router;
