"use client";

import { useState, useEffect } from "react";
import { WelcomePanel, ForgotPasswordForm } from "@/components/auth";

export default function ForgotPasswordPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <WelcomePanel className={mounted ? "animate-slideInLeft" : "opacity-0"} />
      <ForgotPasswordForm
        className={mounted ? "animate-slideInRight" : "opacity-0"}
      />
    </div>
  );
}
