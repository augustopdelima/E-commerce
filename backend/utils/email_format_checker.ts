export function emailFormatChecker(email: string): boolean {
  if (typeof email !== "string") return false;

  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@") || atIndex === email.length - 1) {
    return false;
  }

  
  if (dotIndex < atIndex + 2 || dotIndex === email.length - 1) {
    return false;
  }

  
  if (email.includes(" ")) {
    return false;
  }

  return true;
}