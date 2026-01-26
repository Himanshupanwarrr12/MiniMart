import type { Request } from "express";
import validator, { trim } from "validator";

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
  const { email, password } = req.body || {};

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
    errors.push("Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols");
  }

  return {
    isValid : errors.length === 0,
    errors,
    data: errors.length === 0 ? { email:trimmedEmail,password } : undefined
  }
}
