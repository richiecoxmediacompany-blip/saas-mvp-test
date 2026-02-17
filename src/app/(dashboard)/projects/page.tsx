import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createProject } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { tasks: true } },
      tasks: {
        where: { status: "done" },
        select: { id: true },
      },
    },
  });

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* New project form */}
      <form action={createProject} className="mb-8">
        <div className="flex gap-3">
          <input
            name="name"
            type="text"
            required
            placeholder="New project name..."
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            name="description"
            type="text"
            placeholder="Description (optional)"
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create
          </button>
        </div>
      </form>

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No projects yet</p>
          <p className="text-sm mt-1">
            Create your first project to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const total = project._count.tasks;
            const done = project.tasks.length;
            const progress = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium">{project.name}</h2>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>
                      {done}/{total} tasks done
                    </div>
                    <div className="text-xs mt-0.5">
                      Updated {formatDate(project.updatedAt)}
                    </div>
                  </div>
                </div>
                {total > 0 && (
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
