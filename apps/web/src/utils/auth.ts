import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// JWT secret key (in a real app, this would be in an environment variable)
const JWT_SECRET = "your-secret-key-change-this-in-production";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  joinDate?: string;
  avatar?: string;
}

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verify a JWT token
 * @param token The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get the current user from localStorage token (client-side only)
 * @returns The current user or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const userJson = localStorage.getItem("user");
    if (!userJson) {
      return null;
    }

    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Check if the user is authenticated (client-side only)
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

/**
 * Log out the current user (client-side only)
 */
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Hook to protect client components
 * Redirects to login if not authenticated
 */
export const useRequireAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    user: null as ReturnType<typeof getCurrentUser>,
    isAuthenticated: false,
    isLoading: true,
    error: null as string | null,
  });

  useEffect(() => {
    try {
      const auth = isAuthenticated();
      const user = getCurrentUser();

      setAuthState({
        user,
        isAuthenticated: auth,
        isLoading: false,
        error: null,
      });

      if (!auth) {
        console.log("User not authenticated, redirecting to login");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error in useRequireAuth:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Authentication check failed",
      });
    }
  }, [router]);

  return authState;
};

/**
 * Hook to redirect authenticated users away from auth pages
 */
export const useRedirectIfAuthenticated = (redirectTo = "/dashboard") => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    try {
      if (isAuthenticated()) {
        console.log("User already authenticated, redirecting to", redirectTo);
        router.push(redirectTo);
      }
      setIsChecking(false);
    } catch (error) {
      console.error("Error in useRedirectIfAuthenticated:", error);
      setIsChecking(false);
    }
  }, [router, redirectTo]);

  return { isChecking };
};

export const verifyTokenAsync = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }

    const response = await fetch("http://localhost:3001/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.authenticated === true;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
};
