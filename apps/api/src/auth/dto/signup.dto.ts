import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({
    example: "John Smith",
    description: "The full name of the user",
  })
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  name: string;

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
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/[0-9]/, { message: "Password must contain at least one number" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
