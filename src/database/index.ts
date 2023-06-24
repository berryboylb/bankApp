import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.mongoURI;
const connectDB = async (cb?: () => void) => {
  try {
    //connect to db
    await mongoose.connect(
      mongoUrl as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    console.log("Mongodb connected");
  } catch (err: any) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
