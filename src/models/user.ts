import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  verified: boolean;
  roles: string;
  avatar?: { url: string; publicId: string };
  refreshToken: string[];
  favourites: ObjectId[];
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, {}, Methods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    avatar: { type: Object, url: String, publicId: String },
    roles: { type: String, default: "Client" },
    refreshToken: [String],
    favourites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10)
    // const hashed = await hash(this.get("password"), 10);
    // this.set("password", hashed);
  }
  done();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};


const User = model("User", userSchema) as Model<IUser, {}, Methods>;

export default User;
