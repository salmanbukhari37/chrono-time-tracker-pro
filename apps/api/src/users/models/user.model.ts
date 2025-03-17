export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  joinDate?: string;
  avatar?: string;
}

export type SafeUser = Omit<User, "password">;

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
}
