import React, { CSSProperties } from "react";
import { FaFolder } from "react-icons/fa";

interface Project {
  id: string;
  name: string;
  progress: number;
  hoursLogged: string;
  color?: string;
}

interface ProjectListProps {
  projects: Project[];
  className?: string;
  style?: CSSProperties;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  className = "",
  style,
}) => {
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 ${className}`}
      style={style}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Active Projects
      </h2>
      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No active projects found.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-md mr-3 ${
                      project.color || "bg-primary-100"
                    }`}
                  >
                    <FaFolder
                      className={
                        project.color ? "text-white" : "text-primary-600"
                      }
                    />
                  </div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {project.hoursLogged}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${getProgressColor(
                    project.progress
                  )}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-700">
                  {project.progress}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      {projects.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all projects
          </button>
        </div>
      )}
    </div>
  );
};
