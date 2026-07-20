import { CheckSquare2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTasksPage } from "@/hooks/tasksPage";
import { formatDate, formatTaskStatus } from "@/lib/formatters";

export function TasksPage() {
  const tasks = useTasksPage();

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="h-fit border-border/70 bg-card/88">
        <CardHeader>
          <CardTitle>Crear task</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="grid gap-2">
            <Label>Titulo</Label>
            <Input
              value={tasks.values.title}
              onChange={(event) =>
                tasks.setValues((currentValue) => ({
                  ...currentValue,
                  title: event.target.value,
                }))
              }
              placeholder="Ej. Preparar release semanal"
            />
          </label>

          <label className="grid gap-2">
            <Label>Descripcion</Label>
            <Textarea
              value={tasks.values.description}
              onChange={(event) =>
                tasks.setValues((currentValue) => ({
                  ...currentValue,
                  description: event.target.value,
                }))
              }
              placeholder="Objetivo, contexto y dependencias"
            />
          </label>

          <label className="grid gap-2">
            <Label>Proyecto</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={tasks.values.projectId}
              onChange={(event) =>
                tasks.setValues((currentValue) => ({
                  ...currentValue,
                  projectId: event.target.value,
                }))
              }
            >
              <option value="">Sin proyecto</option>
              {tasks.projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tasks.tags.map((tag) => {
                const isActive = tasks.values.tagIds.includes(tag.id);

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => tasks.toggleTag(tag.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: tag.color ?? "#94a3b8" }}
                    />
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              disabled={tasks.isSubmitting}
              onClick={() => void tasks.createTask()}
            >
              <Plus className="size-4" />
              {tasks.isSubmitting ? "Guardando..." : "Crear task"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void tasks.refresh()}
            >
              Recargar
            </Button>
          </div>

          {tasks.error ? (
            <p className="text-sm text-red-600">{tasks.error}</p>
          ) : null}
          {!tasks.isAuthenticated ? (
            <p className="text-sm text-muted-foreground">
              Necesitas sesion para listar y crear tasks privadas.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle className="text-lg">Todas las tasks</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {tasks.tasks.length}
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle className="text-lg">Asignadas a mi</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {tasks.assignedTasks.length}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70 bg-card/88">
          <CardHeader>
            <CardTitle>Backlog visible</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {tasks.tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-border/70 bg-background/75 p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare2 className="size-4 text-primary" />
                    <h3 className="font-medium">{task.title}</h3>
                  </div>
                  <Badge variant="outline">
                    {formatTaskStatus(task.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {task.description ?? "Sin descripcion"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {task.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: tag.color ?? "#94a3b8" }}
                      />
                      {tag.name}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Actualizada {formatDate(task.updatedAt)}
                </p>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/88">
          <CardHeader>
            <CardTitle>Mis prioridades</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {tasks.assignedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.project?.name ?? "Sin proyecto"}
                  </p>
                </div>
                <Badge variant="secondary">
                  {formatTaskStatus(task.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
