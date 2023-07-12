import express, { Request } from "express";
import { AuthController } from "../controllers";
import {
  RegisterUserDto,
  LoginUserDto,
  ChangePasswordDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from "../validators";
import { validateSchema, validateQuery } from "../middleware/validator";
import { auth, refreshToken } from "../middleware/auth";

const router = express.Router();
router.post("/", validateSchema(RegisterUserDto), AuthController.createUser);
router.post("/login", [validateSchema(LoginUserDto)], AuthController.login);

router.get("/refresh", refreshToken, AuthController.refreshToken);
router.post(
  "/change-password",
  [auth, validateSchema(ChangePasswordDto)],
  AuthController.changePassword
);
router.post(
  "/forgot-password",
  validateSchema(ForgetPasswordDto),
 AuthController.sendForgotPasswordMail
);

router.post(
  "/reset-password",
  validateSchema(ResetPasswordDto),
  AuthController.resetPassword
);

export default router;
