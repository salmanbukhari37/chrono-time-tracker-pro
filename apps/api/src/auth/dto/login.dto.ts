import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "john@example.com",
    description: "The email of the user",
  })
  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    example: "Password123",
    description: "The password of the user",
  })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
