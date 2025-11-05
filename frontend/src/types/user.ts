
export type UserRole = "admin" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserRole;
}