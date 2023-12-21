import { DEV_URI } from "@/utils/variables";
import mongoose from "mongoose";

const connectDB = async () => {
    console.log(`the DB:${DEV_URI}`)
  try {
    const connectionInstance = await mongoose.connect(DEV_URI);
    console.log(
      `\n MongoDB connected | DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
