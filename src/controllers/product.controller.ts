import { RequestHandler } from "express";
import Product from "@/models/product";

export const getProducts: RequestHandler = async (req, res) => {
  const products = await Product.find({}).exec();
  if (!products) return res.status(404).json({ message: "Products not found" });

  res.status(200).json(products)
  
};

export const getProductById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
};
