import { ReceiptModel, IReceipt } from "../schemas";
import { ReceiptDtoType } from "../validators";
import moment from "moment";
import AppError from "../utils/error";

export const ReceiptService = {
  async create(reqBody: ReceiptDtoType): Promise<IReceipt> {
    const receipt = new ReceiptModel(reqBody);
    return receipt.save();
  },
  async findAll(condition: { [key: string]: string }): Promise<IReceipt[]> {
    const receipts = await ReceiptModel.find(condition);
    return receipts;
  },
  async findOne(
    condition: any,
    options?: { select: string }
  ): Promise<IReceipt | null> {
    const receipt = await ReceiptModel.findOne(condition, options?.select);
    return receipt;
  },
  async findById(id: string, select: string): Promise<IReceipt | null> {
    const receipt = await ReceiptModel.findById(id, select);
    return receipt;
  },
  async findOneAndUpdate(
    condition: { [key: string]: any },
    fields: { [key: string]: any },
    options?: { [key: string]: any }
  ): Promise<IReceipt | null> {
    return ReceiptModel.findOneAndUpdate(condition, fields, options);
  },
  async updateOne(
    condition: { [key: string]: any },
    fields: { [key: string]: any }
  ): Promise<any> {
    const result = await ReceiptModel.updateOne(condition, fields);
    return result;
  },
  async softDelete(userId: string): Promise<any> {
    const receipt = await ReceiptModel.findById(userId);
    if (!receipt || receipt.deletedAt !== null)
      throw new AppError(404, "receipt not found");
    await ReceiptModel.findByIdAndUpdate(
      userId,
      { deletedAt: moment().toDate() },
      { new: true }
    );
    return true;
  },
  async remove(
    _id: string
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const receipt = await ReceiptModel.findById(_id);
    if (!receipt) throw new AppError(404, "receipt not found");
    if (receipt.deletedAt !== null)
      throw new AppError(400, "receipt User first");
    return ReceiptModel.deleteOne({ _id });
  },
};
