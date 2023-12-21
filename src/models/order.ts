import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";

interface IOrder {
  user: ObjectId;
  product: ObjectId;
  name: string;
  price: number;
  shippingAddress: { address: string; city: string };
  image?: { url: string; publicId: string };
  qty: number;
  paymentMethod: string;
  paymentResults: { id: string; status: String; date: Date };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  deliveredAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    image: { type: Object, url: String, publicId: String },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    shippingAddress: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    paymentMethod: String,
    paymentResults: { id: String, status: String, date: Date },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const order = model("order", orderSchema) as Model<IOrder>;

export default order;
