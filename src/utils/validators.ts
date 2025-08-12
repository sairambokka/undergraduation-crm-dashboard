export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  return { isValid: true };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  return { isValid: true };
}

export function validateGPA(gpa: number | string): ValidationResult {
  const numericGPA = typeof gpa === 'string' ? parseFloat(gpa) : gpa;
  
  if (isNaN(numericGPA)) {
    return { isValid: false, error: 'GPA must be a number' };
  }
  
  if (numericGPA < 0 || numericGPA > 4.5) {
    return { isValid: false, error: 'GPA must be between 0 and 4.5' };
  }
  
  return { isValid: true };
}

export function validateSATScore(score: number | string): ValidationResult {
  const numericScore = typeof score === 'string' ? parseInt(score) : score;
  
  if (isNaN(numericScore)) {
    return { isValid: false, error: 'SAT score must be a number' };
  }
  
  if (numericScore < 400 || numericScore > 1600) {
    return { isValid: false, error: 'SAT score must be between 400 and 1600' };
  }
  
  return { isValid: true };
}

export function validateACTScore(score: number | string): ValidationResult {
  const numericScore = typeof score === 'string' ? parseInt(score) : score;
  
  if (isNaN(numericScore)) {
    return { isValid: false, error: 'ACT score must be a number' };
  }
  
  if (numericScore < 1 || numericScore > 36) {
    return { isValid: false, error: 'ACT score must be between 1 and 36' };
  }
  
  return { isValid: true };
}

export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
}

export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

export function validateDate(date: string | Date): ValidationResult {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }
  
  return { isValid: true };
}

export function validateAge(birthDate: string | Date): ValidationResult {
  const dateValidation = validateDate(birthDate);
  if (!dateValidation.isValid) {
    return dateValidation;
  }
  
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  
  if (age < 13 || age > 120) {
    return { isValid: false, error: 'Age must be between 13 and 120' };
  }
  
  return { isValid: true };
}

export function validateMultiple(validators: (() => ValidationResult)[]): ValidationResult {
  for (const validator of validators) {
    const result = validator();
    if (!result.isValid) {
      return result;
    }
  }
  
  return { isValid: true };
}