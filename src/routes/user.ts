import { generateForgotPasswordLink, updatePassword, deleteUser, getUser } from "@/controllers/user";
import { grantValid } from "@/controllers/auth";
import { isAuth, isValidPasswordResetToken } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { TokenAndIDValidation } from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

// Auth guard
router.use(isAuth);

router.get('/get-user', getUser)
router.post("/forgot-password", generateForgotPasswordLink);
router.post(
  "/verify-password-reset-token",
  validate(TokenAndIDValidation),
  isValidPasswordResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(TokenAndIDValidation),
  isValidPasswordResetToken,
  updatePassword
);
router.delete('/delete-user', deleteUser)
export default router;
