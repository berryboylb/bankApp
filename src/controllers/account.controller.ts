import { Request, Response, NextFunction } from "express";
import {
  AuthService,
  UserService,
  AccountService,
  TransactionService,
  ReceiptService,
} from "../services";
import AppError from "../utils/error";
import { generateAccountNumber, success, error } from "../utils";
import { StatusCodes } from "http-status-codes";
import EventEmitter from "../events";
import app from "../index";
import dotenv from "dotenv";
import logger from "../utils/logger";
import {
  AccountTierTypes,
  AccountTypes,
  PaymentMethod,
  DescriptionTypes,
  TransferLimits,
} from "../constants";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import moment from "moment";
dotenv.config();

export const AccountController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const accountDetails = {
        accountNumber: generateAccountNumber(),
        accountType: req.body.accountType || AccountTypes[0],
        user: req.user._id,
        tier: req.body.tier || AccountTierTypes[0],
      };
      const account = await AccountService.create(accountDetails);
      const html = app.render("account", {
        name: req.user.firstname,
        link: process.env.CLIENT_URL,
        accountName: req.user.firstname + req.user.lastname,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountTier: account.tier,
      });
      EventEmitter.emit("mail", {
        email: req.user.email,
        subject: "Account",
        text: "A new account has been successfully created for you",
        html,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            account,
            "Success",
            "A new account has been created successfully",
            StatusCodes.OK
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const id = new ObjectId(user._id);
      const account = await AccountService.findOne({ user: id });
      if (!account || account.deletedAt !== null)
        throw new AppError(
          StatusCodes.NOT_FOUND,
          "This user doesn't have an account"
        );
      account.balance = account.balance + Number(req.body.amount);
      await account.save();
      const newTransactionDetails = {
        accountId: user._id,
        amount: req.body.amount,
        type: "credit",
        paymentMethod: PaymentMethod.DEPOSIT,
        reference: uuid(),
      };
      const transaction = await TransactionService.create(
        newTransactionDetails
      );
      await ReceiptService.create({
        transactionId: transaction._id,
        amount: Number(req.body.amount),
        receiptNumber: newTransactionDetails.reference,
      });

      const html = app.render("receipt", {
        name: req.user.firstname,
        accountNumber: account.accountNumber,
        description: DescriptionTypes.Deposit,
        amount: `NGN ${Number(req.body.amount)}`,
        time: moment().toDate(),
        balance: `NGN ${Number(account.balance)}`,
        reference: transaction.reference,
      });
      EventEmitter.emit("mail", {
        email: req.user.email,
        subject: `Transaction Alert [${newTransactionDetails.type} NGN ${Number(
          newTransactionDetails.amount
        ).toLocaleString()}`,
        text: "You've an email",
        html,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            account,
            "Success",
            "Your balance has been updated",
            StatusCodes.OK
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user: { _id, firstname, email },
      } = req;
      const { amount, accountNumber } = req.body;
      const sender = await AccountService.findOne({ user: new ObjectId(_id) });
      if (!sender || sender.deletedAt !== null)
        throw new AppError(StatusCodes.NOT_FOUND, "Receiver account not found");
      await AccountService.senderChecks(sender, amount);
      const receiver = await AccountService.findOne({ accountNumber });
      if (!receiver || receiver.deletedAt !== null)
        throw new AppError(StatusCodes.NOT_FOUND, "Receiver account not found");
      const userReceiver = await UserService.findOne({
        _id: receiver.user,
      });
      if (!userReceiver || userReceiver.deletedAt !== null)
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
      sender.balance -= amount;
      receiver.balance += amount;

      await sender.save();
      await receiver.save();
      const transaction = await TransactionService.create({
        accountId: _id,
        amount: amount,
        type: "debit",
        paymentMethod: PaymentMethod.TRANSFER,
        reference: uuid(),
        receiver: accountNumber,
      });
      await AccountService.sendNotificationsForTransfers({
        transaction,
        firstname,
        sender,
        receiver,
        userReceiver,
        amount,
        email,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            { sender, receiver },
            "Success",
            "successfully ",
            StatusCodes.OK
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async edit(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};
