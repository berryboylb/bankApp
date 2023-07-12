import express from "express";
import { upload } from "../services";
import { auth, checkRole } from "../middleware/auth";
import { UserController } from "../controllers";
import { IdDto, EditUserDto, EmailDto } from "../validators";
import { validateSchema, validateQuery } from "../middleware/validator";

const router = express.Router();
router.get("/profile", auth, UserController.getUser);
router.put(
  "/profile",
  [auth, validateSchema(EditUserDto)],
  UserController.editUser
);
router.put("", [upload.single("file"), auth], UserController.UploadPicture);
router.get("/profiles", [auth, checkRole(["admin"])], UserController.getUsers);
router.put(
  "/role",
  [auth, checkRole(["admin"]), validateQuery(EmailDto)],
  UserController.changeRole
);
router.patch(
  "",
  [auth, checkRole(["admin"]), validateQuery(IdDto)],
  UserController.archiveUser
);
router.delete(
  "",
  [auth, checkRole(["admin"]), validateQuery(IdDto)],
  UserController.deleteUser
);

export default router;
