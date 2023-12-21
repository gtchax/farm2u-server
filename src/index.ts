import express from "express";
import cookieParser from "cookie-parser";
import "express-async-errors";
import "dotenv/config";

import "@/config/db";
import authRouter from "@/routes/auth";
import productRouter from "@/routes/product";
import userRouter from "@/routes/user";
import { errorHandler, notFound } from "./middleware/error";

// import './utils/schedule'

const app = express();
const PORT = process.env.PORT || (8090 as number);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/users", productRouter);
app.use(notFound)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
