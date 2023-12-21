import { Model, ObjectId, Schema, model } from "mongoose";
import {hash, compare} from 'bcryptjs'

interface IEmailVerificationToken {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>
}

const emailVerificationTokenSchema = new Schema<IEmailVerificationToken, {}, Methods>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      expires: 3600,
      default: Date.now(), // 60min * 60 sec
    },
  },
  { timestamps: true }
);

emailVerificationTokenSchema.pre("save", async function (done) {
    if (this.isModified("token")) {
      const hashed = await hash(this.get("token"), 10);
      this.set("token", hashed);
    }
    done();
  });

emailVerificationTokenSchema.methods.compareToken = async function(token) {
    const result = await compare(token, this.token)
    return result
}

const EmailVerificationToken = model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<IEmailVerificationToken, {}, Methods>;

export default EmailVerificationToken;


