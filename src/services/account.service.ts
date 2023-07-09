import { AccountModel, IAccount } from "../schemas";
import { AccountDtoType } from "../validators";
import moment from "moment";
import AppError from "../utils/error";

export const AccountService = {
  async create(reqBody:Partial<IAccount>): Promise<IAccount> {
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
    if (account.deletedAt !== null) throw new AppError(400, "account User first");
    return AccountModel.deleteOne({ _id });
  },
};
