import { KycModel, IKyc } from "../schemas";
import { KycDtoType } from "../validators";
import moment from "moment";
import AppError from "../utils/error";

const exportResult = {
  async create(reqBody: KycDtoType): Promise<IKyc> {
    const kyc = new KycModel(reqBody);
    return kyc.save();
  },
  async findAll(condition: { [key: string]: string }): Promise<IKyc[]> {
    const kycs = await KycModel.find(condition);
    return kycs;
  },
  async findOne(
    condition: any,
    options?: { select: string }
  ): Promise<IKyc | null> {
    const kyc = await KycModel.findOne(condition, options?.select);
    return kyc;
  },
  async findById(id: string, select: string): Promise<IKyc | null> {
    const kyc = await KycModel.findById(id, select);
    return kyc;
  },
  async findOneAndUpdate(
    condition: { [key: string]: any },
    fields: { [key: string]: any },
    options?: { [key: string]: any }
  ): Promise<IKyc | null> {
    return KycModel.findOneAndUpdate(condition, fields, options);
  },
  async updateOne(
    condition: { [key: string]: any },
    fields: { [key: string]: any }
  ): Promise<any> {
    const kyc = await KycModel.updateOne(condition, fields);
    return kyc;
  },
  async softDelete(userId: string): Promise<any> {
    const kyc = await KycModel.findById(userId);
    if (!kyc || kyc.deletedAt !== null)
      throw new AppError(404, "kyc not found");
    await KycModel.findByIdAndUpdate(
      userId,
      { deletedAt: moment().toDate() },
      { new: true }
    );
    return true;
  },
  async remove(
    _id: string
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const kyc = await KycModel.findById(_id);
    if (!kyc) throw new AppError(404, "kyc not found");
    if (kyc.deletedAt !== null) throw new AppError(400, "kyc User first");
    return KycModel.deleteOne({ _id });
  },
};
export default exportResult;
