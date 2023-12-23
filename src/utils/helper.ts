import nodemailer from "nodemailer";
// import { Resend } from "resend";
import {
  MAILTRAP_USER,
  MAILTRAP_PASSWORD,
  VERIFICATION_MAIL,
  RESEND_API_KEY,
} from "./variables";

// const resend = new Resend(RESEND_API_KEY);

export const generateToken = (length = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    let digit = Math.floor(Math.random() * 10);
    otp += digit;
  }
  return otp;
};

interface Email {
  from: string; // "Acme <onboarding@resend.dev>",
  to: string | Array<string>; //["delivered@resend.dev"],
  subject: string; // "hello world",
  html: string; // "<strong>it works!</strong>",
}

export const mailTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD,
    },
  });
};

// export const mailTransporter = async (mail: Email) => {
//   const data = await resend.emails.send(mail);
//   return data;
// };

interface Profile {
  name: string;
  email: string;
  userId: any;
}

// export const sendVerificationMail = async (token: string, profile: Profile) => {
//   const transport = mailTransporter();

//   const { name, email, userId } = profile;

//   transport.sendMail({
//     to: email,
//     from: VERIFICATION_MAIL,
//     html: `<h1>Hi ${name}, welcome to Farm To You! Use the given OTP to verify your email. Your verification token is: ${token}</h1>`,
//   });
// };
export const sendVerificationMail = async (token: string, profile: Profile) => {
  const { name, email, userId } = profile;
  const transport = mailTransporter();
  transport.sendMail({
    to: email,
    subject: "Welcome to Farm2U!",
    from: VERIFICATION_MAIL,
    html: `<h1>Hi ${name}, welcome to Farm2U! Use the given OTP to verify your email. Your verification token is: ${token}</h1>`,
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = mailTransporter();

  const { link, email } = options;

  const message = `We just received a request that you forgot your password.
   No problem you can use the link and create a new password.
   ${link}
   `;

  transport.sendMail({
    to: email,
    from: VERIFICATION_MAIL,
    subject: "Reset Password Link",
    html: message,
  });
};

// export const sendForgetPasswordLink = async (options: Options) => {
//   const { link, email } = options;

//   const message = `We just received a request that you forgot your password.
//    No problem you can use the link and create a new password.
//    ${link}
//    `;

// mailTransporter({
//   to: email,
//   from: VERIFICATION_MAIL,
//   subject: "Reset Password Link",
//   html: message,
// });
// };

interface MailOptions {
  email: string;
  name: string;
}
export const sendPasswordRestSuccess = async (options: MailOptions) => {
  const transport = mailTransporter();
  const { name, email } = options;
  const message = `Dear ${name} we just updated your new password. You can now sign in with your new password.`;

  transport.sendMail({
    to: [email],
    from: VERIFICATION_MAIL,
    subject: "Password Reset Successfully",
    html: message,
  });
};
