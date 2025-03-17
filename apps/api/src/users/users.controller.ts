import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiQuery({
    name: "role",
    required: false,
    description: "Filter users by role",
  })
  @ApiResponse({ status: 200, description: "Return all users" })
  getUsers(@Query("role") role?: string) {
    const users = this.usersService.findAll(role);
    // Remove passwords from the response
    const safeUsers = users.map(({ password, ...user }) => user);
    return {
      users: safeUsers,
      count: safeUsers.length,
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "Return the user" })
  @ApiResponse({ status: 404, description: "User not found" })
  getUserById(@Param("id") id: string) {
    try {
      const user = this.usersService.findById(id);
      // Remove password from the response
      const { password, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException("User not found");
    }
  }
}
