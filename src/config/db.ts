import { DEV_URI } from "@/utils/variables";
import mongoose from "mongoose";

mongoose
  .connect(DEV_URI)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
