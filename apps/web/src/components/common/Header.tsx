import React from "react";
import { FaBars, FaUser, FaBell } from "react-icons/fa";

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          className="p-2 rounded-md text-gray-500 lg:hidden hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <FaBars className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 lg:block">
          {title}
        </h1>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <FaBell className="h-6 w-6" />
          </button>
          <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <FaUser className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
