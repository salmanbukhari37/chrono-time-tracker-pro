import React from "react";
import { FaClock } from "react-icons/fa";

const NoEntries: React.FC = () => {
  return (
    <div className="text-center py-10">
      <FaClock className="mx-auto h-12 w-12 text-gray-300" />
      <p className="mt-3 text-gray-500">No time entries yet</p>
    </div>
  );
};

export default NoEntries;
