import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("signup")
  @ApiOperation({ summary: "User signup" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 409, description: "Email already in use" })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Get("verify")
  @ApiOperation({ summary: "Verify JWT token" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Token is valid" })
  @ApiResponse({ status: 401, description: "Invalid token" })
  async verify(@Headers("authorization") authHeader: string) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException({
        authenticated: false,
        message: "No token found",
      });
    }

    const token = authHeader.split(" ")[1];
    return this.authService.verify(token);
  }
}
