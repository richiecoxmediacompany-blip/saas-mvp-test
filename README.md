# TaskFlow

A simple project and task management app. Create projects, organize tasks by status and priority, and track deadlines.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** v4
- **Prisma** v6 + SQLite
- **Auth.js** v5 (email/password)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your AUTH_SECRET

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Features

- User registration and login
- Create and manage projects
- Add tasks with title, description, priority, and due date
- Cycle task status: To Do → In Progress → Done
- Filter tasks by status and priority
- Inline task editing
- Progress tracking per project
