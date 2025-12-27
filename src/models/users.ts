import type { UUID } from "node:crypto";

export type UserStatus = 'active' | 'disabled' | 'banned';

export interface User {
    id: UUID;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    status: UserStatus;
    createdAt: Date;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}