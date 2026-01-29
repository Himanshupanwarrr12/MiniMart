import type { Request } from "express";
import validator from "validator";

interface SignUpData {
  email: string;
  password: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data: SignUpData | undefined;
}

export function validateSignUpData(req: Request): ValidationResult {
  const errors: string[] = [];
  const { fullName, email, password } = req.body || {};

  const trimmedFullName = fullName?.trim();
  if (!trimmedFullName) {
    errors.push("Full name is required!");
  } else if (trimmedFullName.length < 3) {
    errors.push("Full name must be at least 3 characters long!");
  } else if (trimmedFullName.length > 100) {
    errors.push("Full name must not exceed 100 characters!");
  } else if (!validator.matches(trimmedFullName, /^[a-zA-Z ]+$/)) {
    errors.push("Full name should only contain letters and spaces!");
  }

  //validate email
  const trimmedEmail = email?.trim();
  if (!trimmedEmail) {
    errors.push("Email Is Required!");
  } else if (!validator.isEmail(trimmedEmail)) {
    errors.push("Please Provide  A Valid Email Address!");
  }

  // validate password
  if (!password) {
    errors.push("Password Is Required");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.push(
      "Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? { email: trimmedEmail, password } : undefined,
  };
}
