"use client";

import { updateTaskStatus, deleteTask, updateTask } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { useState, useTransition } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: string;
}

const statusLabels: Record<string, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const statusColors: Record<string, string> = {
  todo: "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const nextStatus: Record<string, string> = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

export function TaskItem({ task }: { task: Task }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleStatusCycle() {
    startTransition(() => {
      updateTaskStatus(task.id, nextStatus[task.status]);
    });
  }

  function handleDelete() {
    startTransition(() => {
      deleteTask(task.id);
    });
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateTask(task.id, formData);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <form
        action={handleUpdate}
        className="border border-border rounded-lg p-4 space-y-3"
      >
        <input
          name="title"
          type="text"
          defaultValue={task.title}
          required
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          name="description"
          defaultValue={task.description || ""}
          placeholder="Description (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        <div className="flex gap-2 flex-wrap">
          <select
            name="status"
            defaultValue={task.status}
            className="px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            name="priority"
            defaultValue={task.priority}
            className="px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            name="dueDate"
            type="date"
            defaultValue={
              task.dueDate
                ? new Date(task.dueDate).toISOString().split("T")[0]
                : ""
            }
            className="px-3 py-2 border border-border rounded-md bg-background text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 border border-border rounded-md text-sm hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`border border-border rounded-lg p-4 flex items-start gap-3 transition-opacity ${
        isPending ? "opacity-50" : ""
      } ${task.status === "done" ? "opacity-60" : ""}`}
    >
      {/* Status cycle button */}
      <button
        onClick={handleStatusCycle}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
          task.status === "done"
            ? "border-green-500 bg-green-500 text-white"
            : task.status === "in-progress"
            ? "border-blue-500"
            : "border-gray-300"
        }`}
        title={`Click to move to ${statusLabels[nextStatus[task.status]]}`}
      >
        {task.status === "done" && (
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {task.status === "in-progress" && (
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-medium text-sm ${
              task.status === "done" ? "line-through" : ""
            }`}
          >
            {task.title}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
              statusColors[task.status]
            }`}
          >
            {statusLabels[task.status]}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>
        )}
        {task.dueDate && (
          <p className="text-xs text-muted-foreground mt-1">
            Due {formatDate(task.dueDate)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
