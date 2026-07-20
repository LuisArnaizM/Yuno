import { useEffect, useState } from "react";
import {
  createTaskDtoSchema,
  type ProjectDto,
  type TagDto,
  type TaskDto,
} from "@yuno/shared-types";
import { ApiError } from "@/lib/api-client";
import { useAppSession } from "@/providers/app-session-provider";
import { projectsService } from "@/services/projects-service";
import { tagsService } from "@/services/tags-service";
import { tasksService } from "@/services/tasks-service";

export function useTasksPage() {
  const session = useAppSession();
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<TaskDto[]>([]);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [values, setValues] = useState({
    title: "",
    description: "",
    projectId: "",
    tagIds: [] as number[],
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refresh() {
    setIsLoading(true);
    setError(null);

    try {
      const tagsPromise = tagsService.list();

      if (!session.token) {
        setTags(await tagsPromise);
        setTasks([]);
        setAssignedTasks([]);
        setProjects([]);
        return;
      }

      const [tasksData, assignedData, projectsData, tagsData] =
        await Promise.all([
          tasksService.list(session.token),
          tasksService.listAssigned(session.token),
          projectsService.list(session.token),
          tagsPromise,
        ]);

      setTasks(tasksData);
      setAssignedTasks(assignedData);
      setProjects(projectsData);
      setTags(tagsData);
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : "No se pudieron cargar las tasks",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [session.token]);

  async function createTask() {
    if (!session.token) {
      setError("Necesitas iniciar sesion para crear tasks");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = createTaskDtoSchema.parse({
        title: values.title,
        description: values.description || undefined,
        projectId: values.projectId ? Number(values.projectId) : undefined,
        tagIds: values.tagIds.length > 0 ? values.tagIds : undefined,
      });

      const task = await tasksService.create(session.token, payload);
      setTasks((currentValue) => [task, ...currentValue]);
      if (task.assignee?.id === session.user?.id) {
        setAssignedTasks((currentValue) => [task, ...currentValue]);
      }
      setValues({ title: "", description: "", projectId: "", tagIds: [] });
    } catch (errorValue) {
      if (errorValue instanceof ApiError) {
        setError(errorValue.message);
      } else if (errorValue instanceof Error) {
        setError(errorValue.message);
      } else {
        setError("No se pudo crear la task");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleTag(tagId: number) {
    setValues((currentValue) => ({
      ...currentValue,
      tagIds: currentValue.tagIds.includes(tagId)
        ? currentValue.tagIds.filter((id) => id !== tagId)
        : [...currentValue.tagIds, tagId],
    }));
  }

  return {
    ...session,
    tasks,
    assignedTasks,
    projects,
    tags,
    values,
    setValues,
    error,
    isLoading,
    isSubmitting,
    refresh,
    createTask,
    toggleTag,
  };
}