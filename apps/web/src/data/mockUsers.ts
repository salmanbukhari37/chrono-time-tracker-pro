// Mock user data for testing authentication and user management
// Each user has a unique ID, name, email, password (which would be hashed in production),
// role, and additional profile information

export const MOCK_USERS = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    password: "Password123", // In a real app, this would be hashed
    role: "admin",
    department: "Engineering",
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
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@example.com",
    password: "Password123",
    role: "manager",
    department: "Product",
    joinDate: "2022-03-10",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    password: "Password123",
    role: "user",
    department: "Sales",
    joinDate: "2022-04-05",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    password: "Password123",
    role: "user",
    department: "Customer Support",
    joinDate: "2022-05-12",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "6",
    name: "Jessica Patel",
    email: "jessica@example.com",
    password: "Password123",
    role: "manager",
    department: "Human Resources",
    joinDate: "2022-06-18",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: "7",
    name: "Robert Wilson",
    email: "robert@example.com",
    password: "Password123",
    role: "user",
    department: "Finance",
    joinDate: "2022-07-22",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "8",
    name: "Lisa Thompson",
    email: "lisa@example.com",
    password: "Password123",
    role: "admin",
    department: "IT",
    joinDate: "2022-08-30",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "9",
    name: "James Garcia",
    email: "james@example.com",
    password: "Password123",
    role: "user",
    department: "Operations",
    joinDate: "2022-09-14",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    id: "10",
    name: "Salman Bukhari",
    email: "salmanbukhari37@gmail.com",
    password: "Password123",
    role: "manager",
    department: "Design",
    joinDate: "2022-10-25",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
  },
];

// Helper function to find a user by email
export const findUserByEmail = (email: string) => {
  return MOCK_USERS.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

// Helper function to find a user by ID
export const findUserById = (id: string) => {
  return MOCK_USERS.find((user) => user.id === id);
};
