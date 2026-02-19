export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  return null;
};

export const validateFullName = (name: string): string | null => {
  if (!name.trim()) {
    return "Full name is required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Name can only contain letters and spaces";
  }

  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};

export interface PasswordStrength {
  score: number;
  label: "Weak" | "Medium" | "Strong";
  color: string;
  widthClass: string;
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      label: "Weak",
      color: "bg-gray-300",
      widthClass: "w-0",
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      score,
      label: "Weak",
      color: "bg-red-500",
      widthClass: "w-1/3",
    };
  }

  if (score <= 4) {
    return {
      score,
      label: "Medium",
      color: "bg-amber-500",
      widthClass: "w-2/3",
    };
  }

  return {
    score,
    label: "Strong",
    color: "bg-emerald-500",
    widthClass: "w-full",
  };
};

export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignupForm = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameError = validateFullName(fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(password, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
