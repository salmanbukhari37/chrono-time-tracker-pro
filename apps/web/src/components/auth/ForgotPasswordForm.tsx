import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { FormInput } from "./FormInput";
import { LoadingSpinner, SuccessIcon, Button } from "@/components/ui";

// Define the validation schema with Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Infer the type from the schema
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  className?: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setServerError("");
    setIsLoading(true);

    try {
      // In a real app, you would call your password reset API here
      console.log("Reset password for:", data.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setIsSubmitted(true);
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white md:w-1/2 p-8 md:p-12 flex items-center justify-center ${className}`}
    >
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Reset your password
              </h2>
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password.
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

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="Sending..."
                >
                  Send reset link
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center animate-fadeIn">
            <SuccessIcon className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Check your email
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              size="sm"
            >
              Didn't receive the email? Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
