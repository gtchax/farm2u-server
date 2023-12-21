import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";

interface IReview {
  name: string;
  comment: string;
  rating: number;
  user: ObjectId;
}
interface IProduct {
  name: string;
  category: string;
  description: string;
  reviews: string;
  image?: string;
  rating: number;
  price: number;
  numReviews: number;
  user: ObjectId;
}

const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, require: true, default: 0 },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    reviews: [reviewSchema],
    rating: { type: Number, require: true, default: 0 },
    price: { type: Number, require: true, default: 0 },
    image: { type: String },
    numReviews: { type: Number, require: true, default: 0 },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema) as Model<IProduct>;

export default Product;
