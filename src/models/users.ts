import type { UUID } from "node:crypto";

export type UserStatus = "active" | "disabled" | "banned";

export interface User {
  id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  status: UserStatus;
  created_at: Date;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginResponseData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
}

export interface LoginUserResponse {
  data: LoginResponseData;
  token: string;
  refresh_token: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}
