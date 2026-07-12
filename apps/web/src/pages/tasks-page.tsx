import { useEffect, useState } from "react";
import {
  createTaskDtoSchema,
  taskDtoSchema,
  type TaskDto,
} from "@yuno/shared-types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:3001";

export function TasksPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadTasks() {
    setError(null);

    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      setError("No se pudieron cargar las tasks");
      return;
    }

    const raw = await response.json();
    const parsed = taskDtoSchema.array().safeParse(raw);

    if (!parsed.success) {
      setError("La respuesta de la API no cumple el DTO compartido");
      return;
    }

    setTasks(parsed.data);
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const dto = createTaskDtoSchema.safeParse({
      title,
      description: description || undefined,
    });

    if (!dto.success) {
      setError(dto.error.issues[0]?.message ?? "Payload invalido");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto.data),
      });

      if (!response.ok) {
        setError("El backend rechazo la task");
        return;
      }

      setTitle("");
      setDescription("");
      await loadTasks();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6">
      <form
        className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-xl font-semibold">Crear task</h2>
          <p className="text-sm text-muted-foreground">
            El payload se valida en frontend y backend con el mismo schema Zod.
          </p>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Titulo</span>
          <input
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: Preparar meeting semanal"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Descripcion</span>
          <textarea
            className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Opcional"
          />
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            <Plus className="size-4" />
            {isSubmitting ? "Guardando..." : "Crear task"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadTasks()}
          >
            Recargar
          </Button>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>

      <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Tasks ({tasks.length})</h3>
        <ul className="grid gap-3">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">
                {task.description ?? "Sin descripcion"}
              </p>
              <p className="mt-1 text-xs uppercase text-muted-foreground">
                Estado: {task.status}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
