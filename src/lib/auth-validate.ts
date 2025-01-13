export function validateName(name: string): boolean {
  return /^[a-zA-Z]+([''-]?[a-zA-Z]+)*([ ]?[a-zA-Z]+)*$/.test(name);
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  // Validate phone number format: 0XXXXXXXXX (10 digits starting with 0)
  return /^0\d{9}$/.test(phoneNumber);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.endsWith(".com");
}
// function validateEmail(email: string): boolean {
//   // This regex pattern is more permissive and covers most valid email formats
//   const emailRegex =
//     /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//   return emailRegex.test(email);
// }

export function validatePassword(password: string): boolean {
  return password.length >= 12;
}
