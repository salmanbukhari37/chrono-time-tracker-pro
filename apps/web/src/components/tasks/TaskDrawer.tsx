import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaExclamation,
  FaRegListAlt,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";
import type { Task } from "./TasksBoard";

// Define status types explicitly for type safety
type TaskStatus = "todo" | "in-progress" | "completed";

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task;
  mode: "create" | "edit";
}

// Define dummy employees data
const DUMMY_EMPLOYEES = [
  { id: "1", name: "John Smith", role: "Frontend Developer" },
  { id: "2", name: "Sarah Johnson", role: "Backend Developer" },
  { id: "3", name: "Michael Chen", role: "UI/UX Designer" },
  { id: "4", name: "Emily Brown", role: "Project Manager" },
  { id: "5", name: "David Wilson", role: "Full Stack Developer" },
];

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  mode,
}) => {
  // Form state
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(
    task?.priority || "medium"
  );
  const [assignee, setAssignee] = useState(task?.assignee || "");
  const [status, setStatus] = useState<TaskStatus>(
    (task?.status || "todo") as TaskStatus
  );

  // Validation state
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setAssignee(task.assignee || "");
      setStatus(task.status as TaskStatus);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignee("");
      setStatus("todo");
    }
    // Reset validation state
    setErrors({ title: "", description: "" });
    setTouched({ title: false, description: false });
  }, [task]);

  // Validate form fields
  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "title":
        if (!value.trim()) {
          error = "Title is required";
        } else if (value.trim().length < 3) {
          error = "Title must be at least 3 characters";
        } else if (value.length > 100) {
          error = "Title must be less than 100 characters";
        }
        break;
      case "description":
        if (value.length > 500) {
          error = "Description must be less than 500 characters";
        }
        break;
    }
    return error;
  };

  // Handle field blur for validation
  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    const fieldValue = field === "title" ? title : description;
    const error = validateField(field, fieldValue);
    setErrors({ ...errors, [field]: error });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const titleError = validateField("title", title);
    const descriptionError = validateField("description", description);

    // Update errors state
    setErrors({
      title: titleError,
      description: descriptionError,
    });

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
    });

    // Check if form is valid
    if (titleError || descriptionError) {
      return;
    }

    // Submit form if valid
    onSave({
      title,
      description,
      priority,
      assignee: assignee.trim() || undefined,
      status,
    });
  };

  // Check if form is valid
  const isFormValid = !errors.title && !errors.description;

  // Helper functions for UI
  const getPriorityColor = (selectedPriority: Task["priority"]) => {
    switch (selectedPriority) {
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

  // Helper functions for status workflow logic
  const canShowInProgress = (currentStatus: TaskStatus): boolean => {
    return currentStatus === "todo" || currentStatus === "in-progress";
  };

  const canShowCompleted = (currentStatus: TaskStatus): boolean => {
    return currentStatus === "in-progress";
  };

  // Helper function to render status label with proper types
  const getStatusLabel = (statusValue: TaskStatus): string => {
    switch (statusValue) {
      case "todo":
        return "Todo";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return statusValue;
    }
  };

  // Status chip component
  const StatusChip = ({
    value,
    active,
  }: {
    value: TaskStatus;
    active: boolean;
  }) => {
    const styles = getStatusStyles(value);
    return (
      <div
        className={`
        flex items-center px-3 py-2 rounded-lg border transition-all duration-200
        ${
          active
            ? `${styles.bg} ${styles.text} ${styles.border} shadow-sm`
            : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
        }
        ${status === value ? "ring-2 ring-primary-500 ring-offset-1" : ""}
      `}
      >
        {styles.icon}
        <span className="font-medium">{getStatusLabel(value)}</span>
      </div>
    );
  };

  const getStatusStyles = (statusValue: Task["status"]) => {
    switch (statusValue) {
      case "todo":
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-300",
          icon: <FaRegListAlt className="mr-2" />,
        };
      case "in-progress":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-300",
          icon: <FaClock className="mr-2" />,
        };
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-300",
          icon: <FaCheckCircle className="mr-2" />,
        };
    }
  };

  const getCharacterCountClass = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 70) return "text-gray-500";
    if (percentage < 90) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="flex items-center text-sm font-medium text-gray-700 mb-1 space-x-1"
              >
                <span>Title</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (touched.title) {
                      setErrors({
                        ...errors,
                        title: validateField("title", e.target.value),
                      });
                    }
                  }}
                  onBlur={() => handleBlur("title")}
                  className={`
                    block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors
                    ${
                      errors.title && touched.title
                        ? "border-red-500 pr-10"
                        : "border-gray-300"
                    }
                  `}
                  placeholder="Enter a clear and concise title"
                  required
                />
                {errors.title && touched.title && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaExclamationCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.title && touched.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
              <p
                className={`mt-1 text-sm ${getCharacterCountClass(
                  title.length,
                  100
                )}`}
              >
                {title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="flex items-center text-sm font-medium text-gray-700 mb-1"
              >
                <span>Description</span>
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (touched.description) {
                      setErrors({
                        ...errors,
                        description: validateField(
                          "description",
                          e.target.value
                        ),
                      });
                    }
                  }}
                  onBlur={() => handleBlur("description")}
                  rows={4}
                  className={`
                    block w-full rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors
                    ${
                      errors.description && touched.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                  `}
                  placeholder="Add a detailed description of the task"
                />
              </div>
              {errors.description && touched.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
              <p
                className={`mt-1 text-sm ${getCharacterCountClass(
                  description.length,
                  500
                )}`}
              >
                {description.length}/500 characters
              </p>
            </div>

            {/* Status Selection */}
            {mode === "edit" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-3">
                  {/* Todo status - always visible */}
                  <div
                    className={`cursor-pointer ${
                      status === "todo" ? "" : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setStatus("todo")}
                  >
                    <StatusChip value="todo" active={status === "todo"} />
                  </div>

                  {/* In-Progress status */}
                  {canShowInProgress(status) && (
                    <div className="flex items-center">
                      <div className="px-2 text-gray-400">
                        <FaArrowRight />
                      </div>
                      <div
                        className={`cursor-pointer ${
                          status === "in-progress"
                            ? ""
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setStatus("in-progress")}
                      >
                        <StatusChip
                          value="in-progress"
                          active={status === "in-progress"}
                        />
                      </div>
                    </div>
                  )}

                  {/* Completed status */}
                  {canShowCompleted(status) && (
                    <div className="flex items-center">
                      <div className="px-2 text-gray-400">
                        <FaArrowRight />
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => setStatus("completed")}
                      >
                        <StatusChip
                          value="completed"
                          active={status === "completed"}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "low", label: "Low", color: "bg-green-500" },
                  { value: "medium", label: "Medium", color: "bg-yellow-500" },
                  { value: "high", label: "High", color: "bg-red-500" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setPriority(option.value as Task["priority"])
                    }
                    className={`flex items-center justify-center px-4 py-2 rounded-md border ${
                      priority === option.value
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${option.color} mr-2`}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee Dropdown */}
            <div>
              <label
                htmlFor="assignee"
                className="flex items-center text-sm font-medium text-gray-700 mb-1"
              >
                <FaUser className="mr-2 text-gray-500" />
                <span>Assignee</span>
              </label>
              <select
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
              >
                <option value="">Select an assignee</option>
                {DUMMY_EMPLOYEES.map((employee) => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name} - {employee.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Footer */}
            <div className="flex justify-between space-x-3 pt-4 border-t">
              <div className="flex items-center">
                {mode === "edit" && onDelete && task && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(task.id);
                      onClose();
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete Task
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`
                    px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                    transition-all duration-200 inline-flex items-center space-x-2
                    ${
                      isFormValid
                        ? "bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <span>
                    {mode === "create" ? "Create Task" : "Save Changes"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
