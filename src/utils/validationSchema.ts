import * as yup from "yup";
import { isValidObjectId } from "mongoose";
export const RegisterUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing")
    .min(3, "Name must be longer than 3 characters")
    .max(20, "Name is too long,. Max 20 characters"),
  email: yup.string().required("Email is missing").email("Invalid email id!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing")
    .min(8, "Password is too short")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password is too simple")
    
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid token"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
});

export const EmailValidationSchema = yup.object().shape({
  email: yup.string().required("Email is required").email('Invalid email'),
  password: yup
    .string()
    .trim()
    .required("Password is required")

   
});

