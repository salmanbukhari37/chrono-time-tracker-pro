import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FormInput } from "./FormInput";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { LoadingSpinner, Button } from "@/components/ui";

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ className = "" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError("");
      setIsLoading(true);

      // Remove rememberMe from the request data
      const { rememberMe, ...loginData } = data;

      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Store the token in localStorage
      localStorage.setItem("token", result.token);

      // Store user data
      localStorage.setItem("user", JSON.stringify(result.user));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setServerError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to check token verification
  const checkTokenVerification = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await fetch("http://localhost:3001/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Token verification result:", result);
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Token verification check failed:", error);
      alert(
        "Verification check failed: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return (
    <div
      className={`bg-white md:w-1/2 p-8 md:p-12 flex items-center justify-center ${className}`}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Sign in to your account
          </h2>
          <p className="text-gray-600">
            Or{" "}
            <Link
              href="/signup"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Add debug buttons in development mode */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 flex space-x-4">
            <button
              type="button"
              onClick={checkTokenVerification}
              className="text-xs text-gray-500 underline"
            >
              Debug: Check Token
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard")}
              className="text-xs text-gray-500 underline"
            >
              Debug: Go to Dashboard
            </button>
          </div>
        )}

        {serverError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r animate-fadeIn">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormInput
              id="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              error={errors.email?.message}
              Icon={FaEnvelope}
              autoComplete="email"
              register={register("email")}
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              Icon={FaLock}
              autoComplete="current-password"
              register={register("password")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                {...register("rememberMe")}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign in
            </Button>
          </div>
        </form>

        <SocialLoginButtons />
      </div>
    </div>
  );
};
