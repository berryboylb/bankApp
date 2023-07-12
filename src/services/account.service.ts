import { AccountModel, IAccount, ITransaction, IUser } from "../schemas";
import { AccountDtoType } from "../validators";
import moment from "moment";
import AppError from "../utils/error";
import { StatusCodes } from "http-status-codes";
import {
  AccountTierTypes,
  TransferLimits,
  DescriptionTypes,
} from "../constants";
import app from "../index";
import EventEmitter from "../events";
interface EmailTransfers {
  transaction: ITransaction;
  firstname: string;
  sender: IAccount;
  receiver: IAccount;
  userReceiver: IUser;
  amount: number;
  email: string;
}

export const AccountService = {
  async create(reqBody: Partial<IAccount>): Promise<IAccount> {
    const account = new AccountModel(reqBody);
    return account.save();
  },
  async findAll(condition: { [key: string]: string }): Promise<IAccount[]> {
    const accounts = await AccountModel.find(condition);
    return accounts;
  },
  async findOne(
    condition: any,
    options?: { select: string }
  ): Promise<IAccount | null> {
    const account = await AccountModel.findOne(condition, options?.select);
    return account;
  },
  async findById(id: string, select: string): Promise<IAccount | null> {
    const account = await AccountModel.findById(id, select);
    return account;
  },
  async findOneAndUpdate(
    condition: { [key: string]: any },
    fields: { [key: string]: any },
    options?: { [key: string]: any }
  ): Promise<IAccount | null> {
    return AccountModel.findOneAndUpdate(condition, fields, options);
  },
  async updateOne(
    condition: { [key: string]: any },
    fields: { [key: string]: any }
  ): Promise<any> {
    const account = await AccountModel.updateOne(condition, fields);
    return account;
  },
  async softDelete(userId: string): Promise<any> {
    const account = await AccountModel.findById(userId);
    if (!account || account.deletedAt !== null)
      throw new AppError(404, "account not found");
    await AccountModel.findByIdAndUpdate(
      userId,
      { deletedAt: moment().toDate() },
      { new: true }
    );
    return true;
  },
  async remove(
    _id: string
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const account = await AccountModel.findById(_id);
    if (!account) throw new AppError(404, "account not found");
    if (account.deletedAt !== null)
      throw new AppError(400, "account User first");
    return AccountModel.deleteOne({ _id });
  },

  async senderChecks(sender: IAccount, amount: number): Promise<boolean> {
    if (sender.balance <= amount)
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Insufficient funds, balance must be greater than amount to transfer"
      );
    if (sender.tier === AccountTierTypes[0] && amount > TransferLimits.Tier1)
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Upgrade your account to ${AccountTierTypes[1]}`
      );
    if (sender.tier === AccountTierTypes[1] && amount > TransferLimits.Tier2)
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Upgrade your account to ${AccountTierTypes[2]}`
      );
    if (sender.tier === AccountTierTypes[2] && amount > TransferLimits.Tier3)
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Maximum amount processed online is NGN ${Number(
          TransferLimits.Tier3
        ).toLocaleString()}`
      );
    return true;
  },

  async sendNotificationsForTransfers({
    firstname,
    sender,
    transaction,
    receiver,
    amount,
    userReceiver,
    email,
  }: EmailTransfers) {
    const senderHtml = app.render("receipt", {
      name: firstname,
      accountNumber: sender.accountNumber,
      description: DescriptionTypes.Deposit,
      amount: `NGN ${Number(amount)}`,
      time: moment().toDate(),
      balance: `NGN ${Number(sender.balance)}`,
      reference: transaction.reference,
    });
    const receiverHtml = app.render("receipt", {
      name: firstname,
      accountNumber: receiver.accountNumber,
      description: DescriptionTypes.Deposit,
      amount: `NGN ${Number(amount)}`,
      time: moment().toDate(),
      balance: `NGN ${Number(receiver.balance)}`,
      reference: transaction.reference,
    });

    //trigger text messages here
    EventEmitter.emit("mail", {
      email,
      subject: `Transaction Alert [${transaction.type} NGN ${Number(
        amount
      ).toLocaleString()}`,
      text: "You've an email",
      senderHtml,
    });
    EventEmitter.emit("mail", {
      email: userReceiver.email,
      subject: `Transaction Alert [Credit] NGN ${Number(
        amount
      ).toLocaleString()}`,
      text: "You've an email",
      receiverHtml,
    });
  },
};
