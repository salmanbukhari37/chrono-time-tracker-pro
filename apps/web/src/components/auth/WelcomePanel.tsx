import React from "react";
import { FaClock, FaArrowRight } from "react-icons/fa";

interface WelcomePanelProps {
  className?: string;
}

export const WelcomePanel: React.FC<WelcomePanelProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-primary-600 to-primary-800 text-white md:w-1/2 p-8 md:p-12 flex flex-col justify-center ${className}`}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <div className="bg-white p-3 rounded-full mr-4">
            <FaClock className="text-primary-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold">Chrono Time Tracker Pro</h1>
        </div>

        <h2 className="text-4xl font-extrabold mb-6">Welcome Back!</h2>
        <p className="text-xl mb-8 text-primary-100">
          Track your time efficiently, analyze your productivity, and optimize
          your workflow.
        </p>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
          <h3 className="font-semibold mb-2 text-lg">
            Why use Chrono Time Tracker?
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="bg-primary-500 p-1 rounded-full mr-2 mt-1">
                <FaArrowRight className="text-xs" />
              </div>
              <span>Simple and intuitive time tracking</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-500 p-1 rounded-full mr-2 mt-1">
                <FaArrowRight className="text-xs" />
              </div>
              <span>Detailed analytics and reports</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-500 p-1 rounded-full mr-2 mt-1">
                <FaArrowRight className="text-xs" />
              </div>
              <span>Project management integration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
