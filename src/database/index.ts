import mongoose, { ConnectOptions } from "mongoose";
import logger from "../utils/logger";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.mongoURI;
const connectDB = async (cb?: () => void) => {
  try {
    mongoose.set("debug", (coll, method, query, doc) => {
      logger.debug(
        `[Mongoose] ${coll}.${method}: ${JSON.stringify(
          query
        )} ${JSON.stringify(doc)}`
      );
    });
    //connect to db
    await mongoose.connect(
      mongoUrl as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    logger.debug("Mongodb connected");
  } catch (err: any) {
    logger.error(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit(1);
  }
};

export default connectDB;
