import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaClock,
  FaChartBar,
  FaSignOutAlt,
  FaTimes,
  FaTasks,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  toggleSidebar,
  handleSignOut,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleCollapse = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setSidebarCollapsed(!sidebarCollapsed);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: FaChartBar },
    { name: "Tasks", href: "/tasks", icon: FaTasks },
  ];

  return (
    <>
      {/* Sidebar backdrop for mobile */}
      <div
        className={`fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-primary-800 text-white transform transition-all duration-300 ease-in-out lg:static lg:h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "w-20" : "w-64"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-primary-700">
          <Link href="/dashboard" className="flex items-center flex-1 min-w-0">
            <div className="bg-white p-2 rounded-full flex-shrink-0">
              <FaClock className="text-primary-600 text-xl" />
            </div>
            <span
              className={`ml-3 text-xl font-semibold truncate transition-opacity duration-300 ${
                sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Chrono
            </span>
          </Link>
          <button
            className="p-2 rounded-md lg:hidden hover:bg-primary-700"
            onClick={toggleSidebar}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-primary-700 text-white"
                  : "text-primary-100 hover:bg-primary-700"
              }`}
              title={sidebarCollapsed ? item.name : ""}
            >
              <item.icon
                className={`${sidebarCollapsed ? "mx-auto" : "mr-3"} h-5 w-5 ${
                  pathname === item.href
                    ? "text-white"
                    : "text-primary-300 group-hover:text-white"
                }`}
              />
              <span
                className={`transition-opacity duration-300 ${
                  sidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-primary-700 p-4 space-y-2">
          <button
            onClick={toggleCollapse}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white rounded-md transition-colors ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Expand sidebar" : "Hide sidebar"}
            disabled={isTransitioning}
          >
            {sidebarCollapsed ? (
              <FaChevronRight className={`h-5 w-5`} />
            ) : (
              <>
                <FaChevronLeft className="h-5 w-5 mr-3" />
                <span>Hide sidebar</span>
              </>
            )}
          </button>
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white rounded-md transition-colors ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Sign out" : ""}
          >
            <FaSignOutAlt
              className={`${sidebarCollapsed ? "mx-auto" : "mr-3"} h-5 w-5`}
            />
            <span
              className={`transition-opacity duration-300 ${
                sidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
              }`}
            >
              Sign out
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
