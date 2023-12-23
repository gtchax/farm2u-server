import { RequestHandler } from "express";
import PasswordResetToken from "@/models/passwordResetToken";
import { JWT_SECRET } from "@/utils/variables";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "@/models/user";

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthorized access, invalid token" });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ error: "Unauthorized access, invalid token" });

  next();
};
export const checkEmailVerification: RequestHandler = async (
  req,
  res,
  next
) => {
  const { email } = req.body;

  const user = await User.findOne({email });
  if (!user)
    return res
      .status(401)
      .json({ error: "User not found" });

 
  if (!user.verified)
    return res
      .status(401)
      .json({ error: "Email not verified. Please check your email for verification instructions." });

  next();
};

export const isAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "") || req.cookies.jwt_f2u;
  if (!token) return res.sendStatus(403);

  const payload = verify(token, JWT_SECRET) as JwtPayload;
  if (!payload) return res.sendStatus(403)
  const id = payload.userId;
  const user = await User.findOne({ _id: id, refreshToken: token });
  if (!user) return res.sendStatus(403)

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
  };
  next();
};
