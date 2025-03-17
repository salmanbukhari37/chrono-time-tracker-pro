import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      // Find the user
      const user = await this.usersService.findByEmail(email);

      // Check if user exists and password matches
      if (!user || user.password !== password) {
        throw new UnauthorizedException("Invalid email or password");
      }

      // Create the token payload (without exp and iat - JWT module will add these)
      const tokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Generate JWT token
      const token = this.jwtService.sign(tokenPayload);

      // Return the token and user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error("Login error:", error);
      throw new BadRequestException("An error occurred during login");
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      const { name, email, password } = signupDto;

      // Check if email is already in use
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new ConflictException("Email is already in use");
      }

      // Create new user
      const newUser = this.usersService.create({
        name,
        email,
        password,
        role: "user",
      });

      // Create the token payload (without exp and iat - JWT module will add these)
      const tokenPayload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      // Generate JWT token
      const token = this.jwtService.sign(tokenPayload);

      // Return the token and user data (excluding password)
      const { password: _, ...userWithoutPassword } = newUser;
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error("Signup error:", error);
      throw new BadRequestException("An error occurred during signup");
    }
  }

  async verify(token: string) {
    try {
      // Verify the token
      const decoded = this.jwtService.verify(token);
      return {
        authenticated: true,
        user: decoded,
        message: "Token verified successfully",
      };
    } catch (error) {
      throw new UnauthorizedException({
        authenticated: false,
        message: "Invalid token",
        error: error.message,
      });
    }
  }
}
