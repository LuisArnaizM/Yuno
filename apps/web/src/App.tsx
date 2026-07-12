import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { buttonClassName } from "@/components/ui/button/classname";
import { HomePage } from "@/pages/home-page";
import { TasksPage } from "@/pages/tasks-page";

function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:px-6">
        <header className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Yuno</p>
              <h1 className="text-2xl font-semibold">Task Sandbox</h1>
            </div>
            <nav className="flex gap-2">
              <Link
                to="/"
                className={buttonClassName({ variant: "ghost", size: "sm" })}
              >
                Inicio
              </Link>
              <Link to="/tasks" className={buttonClassName({ size: "sm" })}>
                Tasks DTO Demo
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tasks", element: <TasksPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
