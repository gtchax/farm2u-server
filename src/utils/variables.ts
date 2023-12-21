const { env } = process as { env: { [key: string]: string } };

export const {
  DEV_URI,
  MAILTRAP_USER,
  MAILTRAP_PASSWORD,
  VERIFICATION_MAIL,
  PASSWORD_RESET_LINK,
  JWT_SECRET,
  RESEND_API_KEY,
  REFRESH_JWT_SECRET,
} = env;
