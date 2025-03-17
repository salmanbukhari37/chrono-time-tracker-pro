"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { TasksBoard, Task, Column } from "@/components/tasks/TasksBoard";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { FaPlus } from "react-icons/fa";

export default function TasksPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "completed", title: "Completed", tasks: [] },
  ]);

  const handleOpenDrawer = (task?: Task) => {
    setSelectedTask(task);
    setDrawerMode(task ? "edit" : "create");
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTask(undefined);
  };

  const calculateTotalTime = (
    checkInTime: Date,
    checkOutTime: Date
  ): string => {
    const diff = checkOutTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // If dropped outside any droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) {
      return;
    }

    // Create copies of the task arrays
    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : Array.from(destColumn.tasks);

    // Remove task from source
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Update task status and time tracking
    const updatedTask = { ...movedTask };

    // Handle time tracking based on column transitions
    if (
      destination.droppableId === "in-progress" &&
      source.droppableId !== "in-progress"
    ) {
      // Starting work on task
      updatedTask.checkInTime = new Date();
      updatedTask.checkOutTime = undefined;
      updatedTask.totalTime = undefined;
    } else if (
      destination.droppableId === "completed" &&
      source.droppableId !== "completed"
    ) {
      // Completing task
      const checkOutTime = new Date();
      updatedTask.checkOutTime = checkOutTime;
      if (updatedTask.checkInTime) {
        updatedTask.totalTime = calculateTotalTime(
          updatedTask.checkInTime,
          checkOutTime
        );
      }
    } else if (destination.droppableId === "todo") {
      // Moving back to todo
      updatedTask.checkInTime = undefined;
      updatedTask.checkOutTime = undefined;
      updatedTask.totalTime = undefined;
    }

    updatedTask.status = destination.droppableId as Task["status"];

    // Insert task at new position
    destTasks.splice(destination.index, 0, updatedTask);

    // Update columns state
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      })
    );
  };

  const handleSaveTask = (task: Partial<Task>) => {
    if (drawerMode === "create") {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: task.title!,
        description: task.description!,
        priority: task.priority!,
        status: "todo",
        assignee: task.assignee,
      };

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === "todo" ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );
    } else if (selectedTask) {
      // Handle status changes when editing a task
      const oldStatus = selectedTask.status;
      const newStatus = task.status || oldStatus;

      // Check if status has changed
      if (oldStatus !== newStatus) {
        // Remove task from its current column
        const updatedColumns = columns.map((col) => {
          if (col.id === oldStatus) {
            return {
              ...col,
              tasks: col.tasks.filter((t) => t.id !== selectedTask.id),
            };
          }
          return col;
        });

        // Create updated task with all the edited properties
        const updatedTask: Task = {
          ...selectedTask,
          ...task,
        };

        // Handle time tracking based on status transitions
        if (newStatus === "in-progress" && oldStatus !== "in-progress") {
          // Starting work on task
          updatedTask.checkInTime = new Date();
          updatedTask.checkOutTime = undefined;
          updatedTask.totalTime = undefined;
        } else if (newStatus === "completed" && oldStatus !== "completed") {
          // Completing task
          const checkOutTime = new Date();
          updatedTask.checkOutTime = checkOutTime;
          if (updatedTask.checkInTime) {
            updatedTask.totalTime = calculateTotalTime(
              updatedTask.checkInTime,
              checkOutTime
            );
          }
        } else if (newStatus === "todo") {
          // Moving back to todo
          updatedTask.checkInTime = undefined;
          updatedTask.checkOutTime = undefined;
          updatedTask.totalTime = undefined;
        }

        // Add task to its new column
        setColumns(
          updatedColumns.map((col) => {
            if (col.id === newStatus) {
              return {
                ...col,
                tasks: [updatedTask, ...col.tasks],
              };
            }
            return col;
          })
        );
      } else {
        // If status hasn't changed, just update the task properties
        setColumns((prevColumns) =>
          prevColumns.map((col) => ({
            ...col,
            tasks: col.tasks.map((t) =>
              t.id === selectedTask.id ? { ...t, ...task } : t
            ),
          }))
        );
      }
    }
    handleCloseDrawer();
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))
    );
  };

  return (
    <DashboardLayout title="Tasks">
      <div className="h-full flex flex-col bg-gray-100">
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <TasksBoard
            className="h-full"
            onEditTask={handleOpenDrawer}
            columns={columns}
            onDragEnd={handleDragEnd}
          />
        </div>

        {/* Task Drawer */}
        <TaskDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          task={selectedTask}
          mode={drawerMode}
        />
      </div>
    </DashboardLayout>
  );
}
