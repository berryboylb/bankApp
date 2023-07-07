import express, { Request } from "express";
import AuthController from "../controllers/auth.controller";
import { RegisterUserDto, LoginUserDto } from "../validators";
import { validateSchema, validateQuery } from "../middleware/validator";

const router = express.Router();
router.post("/", validateSchema(RegisterUserDto), AuthController.createUser);

export default router;
