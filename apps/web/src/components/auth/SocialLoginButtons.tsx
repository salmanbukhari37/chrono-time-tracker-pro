import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui";

export const SocialLoginButtons: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="inline-flex justify-center"
        >
          <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="inline-flex justify-center"
        >
          <FaGithub className="h-5 w-5 text-gray-900 mr-2" />
          GitHub
        </Button>
      </div>
    </div>
  );
};
