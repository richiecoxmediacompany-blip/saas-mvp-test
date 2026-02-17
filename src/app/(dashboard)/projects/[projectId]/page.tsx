import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { createTask, deleteProject } from "@/lib/actions";
import { TaskItem } from "@/components/task-item";
import { TaskFilters } from "@/components/task-filters";

interface Props {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ status?: string; priority?: string }>;
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;
  const { status: filterStatus, priority: filterPriority } =
    await searchParams;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) notFound();

  const where: Record<string, unknown> = { projectId };
  if (filterStatus) where.status = filterStatus;
  if (filterPriority) where.priority = filterPriority;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
  });

  const allTasks = await prisma.task.findMany({
    where: { projectId },
    select: { status: true },
  });

  const counts = {
    total: allTasks.length,
    todo: allTasks.filter((t) => t.status === "todo").length,
    "in-progress": allTasks.filter((t) => t.status === "in-progress").length,
    done: allTasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Project header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {project.description}
            </p>
          )}
        </div>
        <form action={deleteProject.bind(null, project.id)}>
          <button
            type="submit"
            className="px-3 py-1.5 text-sm text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors"
          >
            Delete project
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: counts.total },
          { label: "To Do", value: counts.todo },
          { label: "In Progress", value: counts["in-progress"] },
          { label: "Done", value: counts.done },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-border rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add task form */}
      <form action={createTask} className="mb-6">
        <input type="hidden" name="projectId" value={project.id} />
        <div className="flex gap-2 flex-wrap">
          <input
            name="title"
            type="text"
            required
            placeholder="New task title..."
            className="flex-1 min-w-[200px] px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            name="priority"
            defaultValue="medium"
            className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            name="dueDate"
            type="date"
            className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Add task
          </button>
        </div>
      </form>

      {/* Filters */}
      <TaskFilters
        projectId={project.id}
        currentStatus={filterStatus}
        currentPriority={filterPriority}
      />

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tasks{filterStatus || filterPriority ? " matching filters" : " yet"}</p>
          <p className="text-sm mt-1">
            {filterStatus || filterPriority
              ? "Try adjusting your filters"
              : "Add your first task above"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
