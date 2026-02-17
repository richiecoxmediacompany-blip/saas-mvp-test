import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/projects");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">TaskFlow</h1>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Manage your projects
            <br />
            <span className="text-muted-foreground">without the complexity</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            TaskFlow is a simple project and task manager. Create projects,
            organize tasks by status and priority, and stay on top of deadlines.
            No clutter, no learning curve.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        TaskFlow — Simple project management
      </footer>
    </div>
  );
}
