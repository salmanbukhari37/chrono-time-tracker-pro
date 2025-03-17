import React, { CSSProperties } from "react";
import { FaClock, FaCheckCircle, FaPauseCircle } from "react-icons/fa";

interface Activity {
  id: string;
  title: string;
  project: string;
  duration: string;
  time: string;
  status: "completed" | "in-progress" | "paused";
}

interface ActivityListProps {
  activities: Activity[];
  className?: string;
  style?: CSSProperties;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  className = "",
  style,
}) => {
  const getStatusIcon = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "in-progress":
        return <FaClock className="text-primary-500 animate-pulse-custom" />;
      case "paused":
        return <FaPauseCircle className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 ${className}`}
      style={style}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activities
      </h2>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No recent activities found.
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="mr-3">{getStatusIcon(activity.status)}</div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-500">{activity.project}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{activity.duration}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {activities.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all activities
          </button>
        </div>
      )}
    </div>
  );
};
