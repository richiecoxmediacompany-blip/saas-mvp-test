"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  projectId: string;
  currentStatus?: string;
  currentPriority?: string;
}

export function TaskFilters({
  projectId,
  currentStatus,
  currentPriority,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/projects/${projectId}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <select
        value={currentStatus || ""}
        onChange={(e) => setFilter("status", e.target.value)}
        className="px-3 py-1.5 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All statuses</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={currentPriority || ""}
        onChange={(e) => setFilter("priority", e.target.value)}
        className="px-3 py-1.5 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {(currentStatus || currentPriority) && (
        <button
          onClick={() => router.push(`/projects/${projectId}`)}
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md border border-border transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
