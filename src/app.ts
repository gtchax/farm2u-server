import express from "express";
import cookieParser from "cookie-parser";
import "express-async-errors";
import cors from "cors";

import "@/config/db";
import {
  authRouter,
  rootRouter,
  productRouter,
  userRouter,
  refreshRouter,
} from "@/routes/index";
import { errorHandler, notFound } from "./middleware/error";
// import './utils/schedule'

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127:0:0:1:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use("/", rootRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/refresh", refreshRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
