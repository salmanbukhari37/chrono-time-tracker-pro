import Link from "next/link";
import { FaClock, FaChartBar, FaCalendarAlt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chrono Time Tracker Pro
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your time efficiently, analyze your productivity, and optimize
          your workflow.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="card flex flex-col items-center text-center">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <FaClock className="text-primary-600 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Time Tracking</h2>
          <p className="text-gray-600 mb-4">
            Easily track time spent on tasks and projects with a simple
            start/stop interface.
          </p>
          <Link href="/timer" className="btn btn-primary mt-auto">
            Start Tracking
          </Link>
        </div>

        <div className="card flex flex-col items-center text-center">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <FaChartBar className="text-primary-600 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-600 mb-4">
            Visualize your time data with insightful charts and reports to
            improve productivity.
          </p>
          <Link href="/analytics" className="btn btn-primary mt-auto">
            View Reports
          </Link>
        </div>

        <div className="card flex flex-col items-center text-center">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <FaCalendarAlt className="text-primary-600 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <p className="text-gray-600 mb-4">
            Organize your time entries by projects and categories for better
            management.
          </p>
          <Link href="/projects" className="btn btn-primary mt-auto">
            Manage Projects
          </Link>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to boost your productivity?
        </h2>
        <Link href="/login" className="btn btn-primary px-8 py-3 text-lg">
          Sign In
        </Link>
        <span className="mx-2 text-gray-500">or</span>
        <Link href="/signup" className="btn btn-secondary px-8 py-3 text-lg">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
