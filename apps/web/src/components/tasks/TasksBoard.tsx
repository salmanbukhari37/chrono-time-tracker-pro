import React, { useState, useRef, useEffect } from "react";
import {
  FaPlus,
  FaClock,
  FaUser,
  FaEllipsisH,
  FaGripVertical,
} from "react-icons/fa";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  totalTime?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface TasksBoardProps {
  className?: string;
  columns: Column[];
  onDragEnd: (result: any) => void;
  onEditTask: (task?: Task) => void;
}

export const TasksBoard: React.FC<TasksBoardProps> = ({
  className = "",
  columns,
  onDragEnd,
  onEditTask,
}) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [touchPosition, setTouchPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // For desktop drag and drop
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    processDrop(columnId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // For touch devices
  const handleTouchStart = (e: React.TouchEvent, task: Task) => {
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    setDraggedTask(task);
    // Prevent scrolling during drag
    document.body.style.overflow = "hidden";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedTask) return;

    e.preventDefault(); // Prevent scrolling during drag
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });

    // Find which column we're over
    const elementsUnderTouch = document.elementsFromPoint(
      touch.clientX,
      touch.clientY
    );
    const columnElement = elementsUnderTouch.find((el) =>
      el.getAttribute("data-column-id")
    );

    if (columnElement) {
      const columnId = columnElement.getAttribute("data-column-id");
      if (columnId) {
        setDragOverColumn(columnId);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedTask || !dragOverColumn) {
      setDraggedTask(null);
      setDragOverColumn(null);
      setTouchPosition(null);
      document.body.style.overflow = "";
      return;
    }

    processDrop(dragOverColumn);
    document.body.style.overflow = ""; // Re-enable scrolling
  };

  // Common drop processing logic
  const processDrop = (columnId: string) => {
    if (!draggedTask) return;

    // Find source column
    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === draggedTask.id)
    );

    // Find destination column
    const destColumn = columns.find((col) => col.id === columnId);

    if (!sourceColumn || !destColumn) return;

    // Create a result object similar to react-beautiful-dnd
    const result = {
      draggableId: draggedTask.id,
      source: {
        droppableId: sourceColumn.id,
        index: sourceColumn.tasks.findIndex(
          (task) => task.id === draggedTask.id
        ),
      },
      destination: {
        droppableId: destColumn.id,
        index: 0, // Add to the top of the destination column
      },
    };

    // Call the onDragEnd handler
    onDragEnd(result);

    // Reset drag state
    setDraggedTask(null);
    setDragOverColumn(null);
    setTouchPosition(null);
  };

  // Calculate position for touch dragging ghost element
  const getTaskStyle = (task: Task) => {
    if (draggedTask?.id === task.id && touchPosition) {
      return {
        position: "fixed" as const,
        left: touchPosition.x - 100, // Adjust based on expected width
        top: touchPosition.y - 30, // Adjust based on where you want the "grab" point
        zIndex: 1000,
        opacity: 0.8,
        width: "200px", // Fixed width for the ghost element
        pointerEvents: "none" as const,
      };
    }
    return {};
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 h-full ${className}`}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          data-column-id={column.id}
          className={`flex flex-col bg-gray-50/80 rounded-lg transition-colors duration-200 min-h-[calc(100vh-6rem)] ${
            dragOverColumn === column.id
              ? "bg-blue-50 ring-2 ring-blue-200"
              : ""
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="px-3 py-2.5 border-b border-gray-200/80">
            <h3 className="text-sm font-medium text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                {column.title}
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <button
                onClick={() => onEditTask()}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FaPlus className="h-3.5 w-3.5" />
              </button>
            </h3>
          </div>

          {/* Tasks Container */}
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                ref={(el) => {
                  if (el) taskRefs.current.set(task.id, el);
                }}
                draggable
                onDragStart={() => handleDragStart(task)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, task)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => onEditTask(task)}
                style={getTaskStyle(task)}
                className={`group bg-white rounded-lg shadow-sm border border-gray-200/80 select-none transition-all duration-200 
                  ${
                    draggedTask?.id === task.id && !touchPosition
                      ? "opacity-50 scale-105 shadow-lg ring-2 ring-primary-500"
                      : "hover:shadow-md hover:translate-y-[-1px]"
                  }
                  ${dragOverColumn ? "cursor-grabbing" : "cursor-grab"}
                `}
              >
                <div className="p-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <FaGripVertical className="h-3.5 w-3.5 mr-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h4 className="text-sm font-medium text-gray-900">
                        {task.title}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-2 w-2 rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaEllipsisH className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                          task.priority === "high"
                            ? "bg-red-50 text-red-700"
                            : task.priority === "medium"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.assignee && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <FaUser className="mr-1 h-3 w-3" />
                          {task.assignee}
                        </span>
                      )}
                    </div>
                    {task.totalTime && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <FaClock className="mr-1 h-3 w-3" />
                        {task.totalTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Card Button */}
          <div className="p-2 mt-auto">
            <button
              onClick={() => onEditTask()}
              className="w-full flex items-center px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200 text-sm"
            >
              <FaPlus className="h-3 w-3 mr-2" />
              <span>Add a card</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
