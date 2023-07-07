import { TransactionModel, ITransaction } from "../schemas";
import { TransactionDtoType } from "../validators";
import moment from "moment";
import AppError from "../utils/error";

const exportResult = {
  async create(reqBody: TransactionDtoType): Promise<ITransaction> {
    const transaction = new TransactionModel(reqBody);
    return transaction.save();
  },
  async findAll(condition: { [key: string]: string }): Promise<ITransaction[]> {
    const transactions = await TransactionModel.find(condition);
    return transactions;
  },
  async findOne(
    condition: any,
    options?: { select: string }
  ): Promise<ITransaction | null> {
    const transaction = await TransactionModel.findOne(
      condition,
      options?.select
    );
    return transaction;
  },
  async findById(id: string, select: string): Promise<ITransaction | null> {
    const transaction = await TransactionModel.findById(id, select);
    return transaction;
  },
  async findOneAndUpdate(
    condition: { [key: string]: any },
    fields: { [key: string]: any },
    options?: { [key: string]: any }
  ): Promise<ITransaction | null> {
    return TransactionModel.findOneAndUpdate(condition, fields, options);
  },
  async updateOne(
    condition: { [key: string]: any },
    fields: { [key: string]: any }
  ): Promise<any> {
    const result = await TransactionModel.updateOne(condition, fields);
    return result;
  },
  async softDelete(accountId: string): Promise<any> {
    const transaction = await TransactionModel.findById(accountId);
    if (!transaction || transaction.deletedAt !== null)
      throw new AppError(404, "Transaction not found");
    await TransactionModel.findByIdAndUpdate(
      accountId,
      { deletedAt: moment().toDate() },
      { new: true }
    );
    return true;
  },
  async remove(
    _id: string
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const transaction = await TransactionModel.findById(_id);
    if (!transaction) throw new AppError(404, "Transaction not found");
    if (transaction.deletedAt !== null)
      throw new AppError(400, "Archive Transaction first");
    return TransactionModel.deleteOne({ _id });
  },
};
export default exportResult;
