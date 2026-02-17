"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn, auth } from "./auth";
import { prisma } from "./db";

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

// Auth actions
export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || password.length < 6) {
    return { error: "Email and password (min 6 chars) are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/projects",
  });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/projects",
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "type" in error &&
      error.type === "CredentialsSignin"
    ) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }
}

// Project actions
export async function createProject(formData: FormData) {
  const userId = await getUserId();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return;

  await prisma.project.create({
    data: {
      name,
      description: description || null,
      userId,
    },
  });

  revalidatePath("/projects");
}

export async function deleteProject(projectId: string) {
  const userId = await getUserId();

  await prisma.project.deleteMany({
    where: { id: projectId, userId },
  });

  revalidatePath("/projects");
  redirect("/projects");
}

// Task actions
export async function createTask(formData: FormData) {
  const userId = await getUserId();
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!title || !projectId) return;

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });
  if (!project) return;

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function updateTaskStatus(taskId: string, status: string) {
  const userId = await getUserId();

  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { userId } },
    include: { project: true },
  });
  if (!task) return;

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath(`/projects/${task.projectId}`);
}

export async function updateTask(taskId: string, formData: FormData) {
  const userId = await getUserId();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;

  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { userId } },
  });
  if (!task) return;

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title: title || task.title,
      description: description || null,
      priority: priority || task.priority,
      status: status || task.status,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
}

export async function deleteTask(taskId: string) {
  const userId = await getUserId();

  const task = await prisma.task.findFirst({
    where: { id: taskId, project: { userId } },
  });
  if (!task) return;

  await prisma.task.delete({ where: { id: taskId } });

  revalidatePath(`/projects/${task.projectId}`);
}
