import "dotenv/config";
import connectDB from "@/config/db";
import { app } from "./app";

const PORT = process.env.PORT || (8090 as number);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.log("MONGO db connection failed !!! ", err);
  });
