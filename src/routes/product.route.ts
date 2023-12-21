import { getProducts, getProductById } from "@/controllers/product.controller";
import { Router } from "express";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

export {router};
