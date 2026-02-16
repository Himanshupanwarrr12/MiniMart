import validator from "validator";

interface SignUpReq {
  fullName: string;
  email: string;
  password: string;
}

export function validateSignUpData(body: SignUpReq): void {
  const { fullName, email, password } = body

  //fullName validate
  const trimmedFullName = fullName?.trim();
  if (!trimmedFullName) {
    throw new Error("Full name is required");
  }
  if (trimmedFullName.length < 3 || trimmedFullName.length > 100) {
    throw new Error("Full name must be between 3 and 100 characters");
  }
  if (!validator.matches(trimmedFullName, /^[a-zA-Z ]+$/)) {
    throw new Error("Full name can contain only letters and spaces");
  }

  //email validate
  const trimmedEmail = email?.trim();
  console.log("Email",trimmedEmail)

  if (!trimmedEmail) {
    throw new Error("Email is required");
  }
  if (!validator.isEmail(trimmedEmail)) {
    throw new Error("Invalid email address");
  }
  console.log("Email",trimmedEmail)

  //password validate
  if (!password) {
    throw new Error("Password is required");
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  )
   {
    throw new Error(
      "Password must contain uppercase, lowercase, number, and symbol",
    );
  }
}
