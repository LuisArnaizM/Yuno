import { useEffect, useState } from "react";
import { createProjectDtoSchema, type ProjectDto } from "@yuno/shared-types";
import { ApiError } from "@/lib/api-client";
import { useAppSession } from "@/providers/app-session-provider";
import { projectsService } from "@/services/projects-service";

export function useProjectsPage() {
  const session = useAppSession();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [values, setValues] = useState({ name: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refresh() {
    if (!session.token) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setProjects(await projectsService.list(session.token));
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : "No se pudieron cargar los proyectos",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [session.token]);

  async function createProject() {
    if (!session.token) {
      setError("Necesitas iniciar sesion para crear proyectos");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = createProjectDtoSchema.parse({
        name: values.name,
        description: values.description || undefined,
      });
      const project = await projectsService.create(session.token, payload);
      setProjects((currentValue) => [project, ...currentValue]);
      setValues({ name: "", description: "" });
    } catch (errorValue) {
      if (errorValue instanceof ApiError) {
        setError(errorValue.message);
      } else if (errorValue instanceof Error) {
        setError(errorValue.message);
      } else {
        setError("No se pudo crear el proyecto");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ...session,
    projects,
    values,
    setValues,
    error,
    isLoading,
    isSubmitting,
    refresh,
    createProject,
  };
}