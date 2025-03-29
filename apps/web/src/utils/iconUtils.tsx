import {
  FaClock,
  FaCalendarAlt,
  FaProjectDiagram,
  FaHourglassHalf,
} from "react-icons/fa";

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "FaClock":
      return <FaClock className="text-primary-600 h-6 w-6" />;
    case "FaProjectDiagram":
      return <FaProjectDiagram className="text-primary-600 h-6 w-6" />;
    case "FaCalendarAlt":
      return <FaCalendarAlt className="text-primary-600 h-6 w-6" />;
    case "FaHourglassHalf":
      return <FaHourglassHalf className="text-primary-600 h-6 w-6" />;
    default:
      return <FaClock className="text-primary-600 h-6 w-6" />;
  }
};
