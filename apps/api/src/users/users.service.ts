import { Injectable, NotFoundException } from "@nestjs/common";
import { User, CreateUserDto } from "./models/user.model";

// Mock user data (in a real app, this would come from a database)
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    password: "Password123", // In a real app, this would be hashed
    role: "admin",
    department: "IT",
    joinDate: "2022-01-15",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "Password123",
    role: "user",
    department: "Marketing",
    joinDate: "2022-02-20",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

@Injectable()
export class UsersService {
  private users: User[] = MOCK_USERS;

  findAll(role?: string): User[] {
    if (role) {
      return this.users.filter((user) => user.role === role);
    }
    return this.users;
  }

  findById(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return this.users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      return undefined;
    }
  }

  create(createUserDto: CreateUserDto): User {
    // Generate a new ID
    const newId = (this.users.length + 1).toString();

    // Get current date for join date
    const joinDate = new Date().toISOString().split("T")[0];

    // Create new user
    const newUser: User = {
      id: newId,
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password, // In a real app, this would be hashed
      role: createUserDto.role || "user",
      department: createUserDto.department || "New User",
      joinDate,
      avatar: `https://randomuser.me/api/portraits/${
        Math.random() > 0.5 ? "men" : "women"
      }/${Math.floor(Math.random() * 100)}.jpg`,
    };

    // Add to users
    this.users.push(newUser);

    return newUser;
  }
}
