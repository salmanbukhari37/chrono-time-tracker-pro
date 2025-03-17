import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FormInput } from "./FormInput";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { LoadingSpinner, Button } from "@/components/ui";

// Define the validation schema with Zod
const signupSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the type from the schema
type SignUpFormValues = z.infer<typeof signupSchema>;

interface SignUpFormProps {
  className?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ className = "" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setServerError("");
    setIsLoading(true);

    try {
      // Call the signup API
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      // Store the token in localStorage
      localStorage.setItem("token", result.token);

      // Store user data
      localStorage.setItem("user", JSON.stringify(result.user));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setServerError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white md:w-1/2 p-8 md:p-12 flex items-center justify-center ${className}`}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

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
              id="name"
              type="text"
              label="Full name"
              placeholder="John Doe"
              error={errors.name?.message}
              Icon={FaUser}
              autoComplete="name"
              register={register("name")}
            />

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
              autoComplete="new-password"
              register={register("password")}
            />

            <FormInput
              id="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              Icon={FaLock}
              autoComplete="new-password"
              register={register("confirmPassword")}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors ${
                errors.terms ? "border-red-500" : ""
              }`}
              {...register("terms")}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">
              {errors.terms.message}
            </p>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Sign up
            </Button>
          </div>
        </form>

        <SocialLoginButtons />
      </div>
    </div>
  );
};
