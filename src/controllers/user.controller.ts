import { RequestHandler } from "express";
import { RegisterUser } from "@/@types/user";
import User from "@/models/user";
import {
  generateToken,
  sendForgetPasswordLink,
  sendPasswordRestSuccess,
  sendVerificationMail,
} from "@/utils/helper";

import emailVerificationToken from "@/models/emailVerificationToken";
import PasswordResetToken from "@/models/passwordResetToken";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "@/utils/variables";

export const createUser: RequestHandler = async (req: RegisterUser, res) => {
  const { email, password, name } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) return res.status(403).json({ error: "Email already in use" });

  const user = await User.create({ name, email, password });
  const token = generateToken();
  await emailVerificationToken.create({
    owner: user?._id,
    token,
  });
  sendVerificationMail(token, { name, email, userId: user._id.toString() });
  res.status(201).json({ user: { id: user._id, name, email } });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access" });

  const matched = await user.comparePassword(password);
  if (!matched)
    return res
      .status(422)
      .json({ error: "the new password must be different" });

  user.password = password;
  await user.save();
  PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPasswordRestSuccess({ name: user.name, email: user.email });
  res.json({ message: "Password resets successfully" });
};

export const generateForgotPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found" });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.findOneAndDelete({ owner: user._id });
  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;
  sendForgetPasswordLink({ email: user.email, link: resetLink });
  res.json({ message: "Check your registered mail" });
};

export const deleteUser: RequestHandler = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (req.user.id !== user._id.toString())
    return res.status(404).json({ error: "You can only delete your account" });
  await User.findByIdAndDelete(req.params.id);
  return res.status(200).send("User deleted");
};

export const getUser: RequestHandler = async (req, res) => {
  res.status(200).json(req.user);
};
