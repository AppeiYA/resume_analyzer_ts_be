import { BaseEntity } from "../models/BaseEntity.js";

export class LoginUserDto extends BaseEntity<LoginUserDto> {
  email!: string;
  password!: string;
}

export class LoginData extends BaseEntity<LoginData> {
  id!: string;
  first_name!: string;
  last_name!: string;
  email!: string;
  created_at!: Date;
}
export class LoginResponseDto extends BaseEntity<LoginResponseDto>{
  data!: LoginData;
  token!: string;
  refresh_token!: string
}
