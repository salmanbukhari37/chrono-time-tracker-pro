import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from "../config/jwt.config";

@Module({
  imports: [JwtModule.register(jwtConfig)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
