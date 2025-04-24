import { body } from "express-validator";

export const projectValidationRules = {
  createProject: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Project name is required")
      .isLength({ min: 3 })
      .withMessage("Project name must be at least 3 characters long"),

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
      .isInt({ min: 1 })
      .withMessage("Team members limit must be at least 1"),

    body("status")
      .optional()
      .isIn(["ONGOING", "EXPIRED"])
      .withMessage("Status must be either ONGOING or EXPIRED"),
  ],
  updateProject: [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project name cannot be empty")
      .isLength({ min: 3 })
      .withMessage("Project name must be at least 3 characters long"),

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
      .isInt({ min: 1 })
      .withMessage("Team members limit must be at least 1"),

    body("status")
      .optional()
      .isIn(["ONGOING", "EXPIRED"])
      .withMessage("Status must be either ONGOING or EXPIRED"),
  ],
};
