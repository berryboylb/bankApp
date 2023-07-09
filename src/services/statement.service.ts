import { StatementModel, IStatement } from "../schemas";
import { StatementDtoType } from "../validators";
import moment from "moment";
import AppError from "../utils/error";

export const StatementService = {
  async create(reqBody: StatementDtoType): Promise<IStatement> {
    const statement = new StatementModel(reqBody);
    return statement.save();
  },
  async findAll(condition: { [key: string]: string }): Promise<IStatement[]> {
    const statements = await StatementModel.find(condition);
    return statements;
  },
  async findOne(
    condition: any,
    options?: { select: string }
  ): Promise<IStatement | null> {
    const statement = await StatementModel.findOne(condition, options?.select);
    return statement;
  },
  async findById(id: string, select: string): Promise<IStatement | null> {
    const statement = await StatementModel.findById(id, select);
    return statement;
  },
  async findOneAndUpdate(
    condition: { [key: string]: any },
    fields: { [key: string]: any },
    options?: { [key: string]: any }
  ): Promise<IStatement | null> {
    return StatementModel.findOneAndUpdate(condition, fields, options);
  },
  async updateOne(
    condition: { [key: string]: any },
    fields: { [key: string]: any }
  ): Promise<any> {
    const result = await StatementModel.updateOne(condition, fields);
    return result;
  },
  async softDelete(accountId: string): Promise<any> {
    const statement = await StatementModel.findById(accountId);
    if (!statement || statement.deletedAt !== null)
      throw new AppError(404, "Statement not found");
    await StatementModel.findByIdAndUpdate(
      accountId,
      { deletedAt: moment().toDate() },
      { new: true }
    );
    return true;
  },
  async remove(
    _id: string
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const statement = await StatementModel.findById(_id);
    if (!statement) throw new AppError(404, "Statement not found");
    if (statement.deletedAt !== null)
      throw new AppError(400, "Statement User first");
    return StatementModel.deleteOne({ _id });
  },
};
