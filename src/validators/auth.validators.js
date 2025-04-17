import { body } from "express-validator";

export const authValidationRules = {
  login: [
    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .normalizeEmail(),

    body("password")
      .exists()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],

  refreshToken: [
    body("refreshToken")
      .exists()
      .withMessage("Refresh Token is required")
      .isString()
      .withMessage("Refresh Token must be a string"),
  ],

  changePassword: [
    body("oldPassword")
      .exists()
      .withMessage("Old Password is required")
      .isLength({ min: 6 })
      .withMessage("Old Password must be at least 6 characters long"),

    body("newPassword")
      .exists()
      .withMessage("New Password is required")
      .isLength({ min: 6 })
      .withMessage("New Password must be at least 6 characters long"),
  ],
};
