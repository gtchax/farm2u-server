import {
  verifyEmail,
  sendReverificationToken,
  signIn,
} from "@/controllers/auth.controller";
import { createUser } from "@/controllers/user.controller";
import { checkEmailVerification, isAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import {
  TokenAndIDValidation,
  RegisterUserSchema,
  EmailValidationSchema,
} from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/register", validate(RegisterUserSchema), createUser);
router.post("/sign-in", validate(EmailValidationSchema), checkEmailVerification,signIn);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReverificationToken);

export { router };
