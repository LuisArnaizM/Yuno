import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "@/components/router/RequireAuth";
import { AuthPage } from "@/pages/auth-page";
import { HomePage } from "@/pages/home-page";
import { ProjectDetailPage } from "@/pages/project-detail-page";
import { ProjectsPage } from "@/pages/projects-page";
import { TagsPage } from "@/pages/tags-page";
import { TasksPage } from "@/pages/tasks-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:projectId", element: <ProjectDetailPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "tasks", element: <TasksPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
