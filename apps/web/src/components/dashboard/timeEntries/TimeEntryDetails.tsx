import React from "react";
import { TimeEntry } from "shared";
import { FaStickyNote, FaEdit, FaTrash } from "react-icons/fa";

interface TimeEntryDetailsProps {
  entry: TimeEntry;
  onEdit?: (entry: TimeEntry) => void;
  onDelete?: (id: string) => void;
}

const TimeEntryDetails: React.FC<TimeEntryDetailsProps> = ({
  entry,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mt-3 ml-13 pl-13">
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
        {/* Notes */}
        {(entry.checkInNotes || entry.checkOutNotes) && (
          <div className="mb-3">
            {entry.checkInNotes && (
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500 flex items-center">
                  <FaStickyNote className="h-3 w-3 text-indigo-400 mr-1" />
                  Check-in Notes:
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap pl-4 mt-1 border-l-2 border-indigo-200">
                  {entry.checkInNotes}
                </p>
              </div>
            )}

            {entry.checkOutNotes && (
              <div>
                <p className="text-xs font-medium text-gray-500 flex items-center">
                  <FaStickyNote className="h-3 w-3 text-indigo-400 mr-1" />
                  Check-out Notes:
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap pl-4 mt-1 border-l-2 border-indigo-200">
                  {entry.checkOutNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(entry)}
              className="p-1 text-indigo-500 hover:text-indigo-700"
              aria-label="Edit entry"
            >
              <FaEdit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1 text-red-400 hover:text-red-600"
              aria-label="Delete entry"
            >
              <FaTrash size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeEntryDetails;
