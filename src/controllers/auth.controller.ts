import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import EmailVerificationToken from "@/models/emailVerificationToken";
import { VerifyEmailRequest } from "@/@types/user";
import User from "@/models/user";
import { generateToken, sendVerificationMail } from "@/utils/helper";
import { isValidObjectId } from "mongoose";
import { JWT_SECRET, REFRESH_JWT_SECRET } from "@/utils/variables";
import { refreshToken } from "./refresh.controller";

export const signIn: RequestHandler = async (req, res) => {
  const cookies = req.cookies;
  const { password, email } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user) return res.status(403).json({ error: "Email/Password mismatch" });

  const matched = await user.comparePassword(password);
  if (!matched)
    return res.status(403).json({ error: "Email/Password mismatch" });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "0.5h",
  });
  const newRefreshToken = jwt.sign({ userId: user._id }, REFRESH_JWT_SECRET, {
    expiresIn: "1d",
  });

  let newRefreshTokenArray = !cookies?.jwt_f2u
    ? user.refreshToken
    : user.refreshToken.filter((t) => t !== cookies?.jwt_f2u);

  if (cookies?.jwt_f2u) {
    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundToken) {
      // clear out ALL previous refresh tokens
      newRefreshTokenArray = [];
    }
    res.clearCookie("jwt_f2u", {
      httpOnly: true,
      sameSite: "none",
    });
  }

  user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await user.save();

  return res
    .cookie("jwt_f2u", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 1000, // 30 Days
    })
    .status(200)
    .json({
      accessToken,
    });
};

export const signOut: RequestHandler = async (req, res) => {
  return res
    .clearCookie("jwt_f2u", {
      httpOnly: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

export const sendReverificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid request" });

  if (user.verified)
    return res.status(403).json({ error: "Your account is already verified" });

  await EmailVerificationToken.findOneAndDelete({ owner: userId });
  const token = generateToken();
  await EmailVerificationToken.create({ owner: userId, token });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString,
  });

  res.json({ message: "Please check your mail" });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token" });
  const matched = await verificationToken?.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token" });
  await User.findByIdAndUpdate(userId, { verified: true });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);
  res.json({ message: "Your email is verified" });
  //   res.status(201).json({ user: { id: user._id, name, email } });
};

export const grantValid: RequestHandler = async (req, res) => {
  return res.json({ valid: true });
};
