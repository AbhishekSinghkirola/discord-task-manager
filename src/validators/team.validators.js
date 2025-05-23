import { body } from "express-validator";

export const teamValidationRules = {
  createTeam: [
    body("name")
      .notEmpty()
      .withMessage("Team name is required")
      .isString()
      .withMessage("Team name must be a string")
      .trim()
      .escape(),

    body("projectId")
      .notEmpty()
      .withMessage("Project ID is required")
      .isMongoId()
      .withMessage("Invalid Project ID format"),

    body("teamRole.name")
      .notEmpty()
      .withMessage("Team role name is required")
      .isString()
      .withMessage("Team role name must be a string")
      .trim()
      .escape(),

    body("teamRole.color")
      .optional()
      .isString()
      .withMessage("Team role color must be a string")
      .trim()
      .escape(),
  ],
};
