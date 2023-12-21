import User from "@/models/user";
import { RequestHandler } from "express";
import { JWT_SECRET, REFRESH_JWT_SECRET } from "@/utils/variables";
import { JwtPayload, verify, sign } from "jsonwebtoken";

export const refreshToken: RequestHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt_f2u) return res.sendStatus(401);
  const refreshToken = cookies.jwt_f2u;

  res.clearCookie("jwt_f2u", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  const user = await User.findOne({ refreshToken }).exec();

  // Prevent refresh token reuse
  if (!user) {
    const payload = verify(refreshToken, REFRESH_JWT_SECRET) as JwtPayload;
    if (!payload) return res.sendStatus(403);
    const hackedUser = await User.findById(payload.userId).exec();
    if (hackedUser) {
      hackedUser.refreshToken = [];
      await hackedUser.save();
    }
    return res.sendStatus(403);
  }

  const newRefreshTokenArray = user.refreshToken.filter(token => token !== refreshToken);
  const payload = verify(refreshToken, REFRESH_JWT_SECRET) as JwtPayload;
  if (!payload) return res.sendStatus(403);

  const accessToken = sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' })
  const newRefreshToken = sign({ userId: user._id }, REFRESH_JWT_SECRET, { expiresIn: '1d' })
  user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
  await user.save()

  res.cookie('jwt_f2u', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
  res.json({ accessToken })
};
