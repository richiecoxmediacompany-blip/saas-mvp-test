import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-muted/30 shrink-0">
        <div className="p-4 border-b border-border">
          <Link href="/projects" className="text-lg font-bold">
            TaskFlow
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Link
            href="/projects"
            className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors font-medium"
          >
            All Projects
          </Link>

          {projects.length > 0 && (
            <div className="pt-3">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Projects
              </p>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors truncate"
                >
                  {project.name}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="px-3 py-1 text-sm text-muted-foreground truncate mb-2">
            {session.user.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full px-3 py-1.5 text-sm text-left rounded-md hover:bg-accent transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
