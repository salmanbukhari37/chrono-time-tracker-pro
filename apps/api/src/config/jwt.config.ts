import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleOptions = {
  secret: "your-secret-key-change-this-in-production", // In a real app, use ConfigService
  signOptions: { expiresIn: "7d" },
};
