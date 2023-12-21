import { getProducts, getProductById } from "@/controllers/product";
import { Router } from "express";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
