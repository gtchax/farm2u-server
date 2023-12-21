import {refreshToken } from "@/controllers/refresh.controller";
import { Router } from "express";

const router = Router();

router.get("/", refreshToken);


export {router};
