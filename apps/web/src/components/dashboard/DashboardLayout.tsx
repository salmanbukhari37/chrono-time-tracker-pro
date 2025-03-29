import React, { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../common/Sidebar";
import { Header } from "../common/Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleSignOut={handleSignOut}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header title={title} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
