import { body } from "express-validator";
import {
  PROJECT_STATUS,
  PROJECT_CONSTANTS,
} from "../constants/project.constants.js";

export const projectValidationRules = {
  createProject: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Project name is required")
      .isLength({ min: PROJECT_CONSTANTS.MIN_NAME_LENGTH })
      .withMessage(
        `Project name must be at least ${PROJECT_CONSTANTS.MIN_NAME_LENGTH} characters long`
      ),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Project description is required"),

    body("deadline")
      .notEmpty()
      .withMessage("Deadline is required")
      .isISO8601()
      .withMessage("Invalid date format")
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error("Deadline cannot be in the past");
        }
        return true;
      }),

    body("teamMembersLimit")
      .optional()
      .isInt({ min: PROJECT_CONSTANTS.MIN_TEAM_MEMBERS })
      .withMessage(
        `Team members limit must be at least ${PROJECT_CONSTANTS.MIN_TEAM_MEMBERS}`
      ),

    body("status")
      .optional()
      .isIn(Object.values(PROJECT_STATUS))
      .withMessage(
        `Status must be either ${PROJECT_STATUS.ONGOING} or ${PROJECT_STATUS.EXPIRED}`
      ),
  ],

  updateProject: [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project name cannot be empty")
      .isLength({ min: PROJECT_CONSTANTS.MIN_NAME_LENGTH })
      .withMessage(
        `Project name must be at least ${PROJECT_CONSTANTS.MIN_NAME_LENGTH} characters long`
      ),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project description cannot be empty"),

    body("deadline")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format")
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error("Deadline cannot be in the past");
        }
        return true;
      }),

    body("teamMembersLimit")
      .optional()
      .isInt({ min: PROJECT_CONSTANTS.MIN_TEAM_MEMBERS })
      .withMessage(
        `Team members limit must be at least ${PROJECT_CONSTANTS.MIN_TEAM_MEMBERS}`
      ),

    body("status")
      .optional()
      .isIn(Object.values(PROJECT_STATUS))
      .withMessage(
        `Status must be either ${PROJECT_STATUS.ONGOING} or ${PROJECT_STATUS.EXPIRED}`
      ),
  ],
};
