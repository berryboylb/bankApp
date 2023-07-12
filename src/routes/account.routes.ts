import express from "express";
import { AccountController } from "../controllers";
import { auth } from "../middleware/auth";
import { IdDto, AccountDto, DepositDto, TransferDto } from "../validators";
import { validateSchema, validateQuery } from "../middleware/validator";

const router = express.Router();

router.post("/", [auth, validateSchema(AccountDto)], AccountController.create);
router.put(
  "/deposit",
  [auth, validateSchema(DepositDto)],
  AccountController.deposit
);
router.put(
  "/transfer",
  [auth, validateSchema(TransferDto)],
  AccountController.transfer
);

export default router;
