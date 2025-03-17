"use client";

import { useState, useEffect } from "react";
import { WelcomePanel } from "@/components/auth";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useRedirectIfAuthenticated } from "@/utils/auth";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);

  // Redirect to dashboard if already authenticated
  useRedirectIfAuthenticated();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <WelcomePanel className={mounted ? "animate-slideInLeft" : "opacity-0"} />
      <SignUpForm className={mounted ? "animate-slideInRight" : "opacity-0"} />
    </div>
  );
}
