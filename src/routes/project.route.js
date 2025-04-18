import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
} from "../controllers/project.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { projectValidationRules } from "../validators/project.validators.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/create-project",
  authenticate,
  projectValidationRules.createProject,
  validate,
  createProject
);

router.get("/projects", authenticate, getAllProjects);
router.get("/projects/:id", authenticate, getProjectById);

export default router;
