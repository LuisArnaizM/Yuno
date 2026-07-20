import { useEffect, useMemo, useState } from "react";
import type { ProjectDto, TagDto, TaskDto, TaskStatus } from "@yuno/shared-types";
import { ApiError } from "@/lib/api-client";
import { useAppSession } from "@/providers/app-session-provider";
import { projectsService } from "@/services/projects-service";
import { tagsService } from "@/services/tags-service";
import { tasksService } from "@/services/tasks-service";

type TaskEditorValues = {
  title: string;
  description: string;
  status: TaskStatus;
  tagIds: number[];
};

const defaultValues: TaskEditorValues = {
  title: "",
  description: "",
  status: "todo",
  tagIds: [],
};

export function useProjectDetailPage(projectId: number) {
  const session = useAppSession();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [values, setValues] = useState<TaskEditorValues>(defaultValues);

  async function refresh() {
    if (!session.token) {
      setProjects([]);
      setTasks([]);
      setTags([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [projectsData, tasksData, tagsData] = await Promise.all([
        projectsService.list(session.token),
        tasksService.list(session.token),
        tagsService.list(),
      ]);

      setProjects(projectsData);
      setTasks(tasksData);
      setTags(tagsData);
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : "No se pudo cargar el proyecto",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [session.token, projectId]);

  const project = useMemo(
    () => projects.find((currentProject) => currentProject.id === projectId) ?? null,
    [projects, projectId],
  );

  const projectTasks = useMemo(
    () => tasks.filter((task) => task.project?.id === projectId || task.projectId === projectId),
    [tasks, projectId],
  );

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, TaskDto[]> = {
      todo: [],
      in_progress: [],
      blocked: [],
      done: [],
    };

    for (const task of projectTasks) {
      groups[task.status].push(task);
    }

    return groups;
  }, [projectTasks]);

  function openCreateTask() {
    setEditingTaskId(null);
    setValues({ ...defaultValues, status: "todo" });
    setIsModalOpen(true);
  }

  function openEditTask(task: TaskDto) {
    setEditingTaskId(task.id);
    setValues({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      tagIds: task.tags.map((tag) => tag.id),
    });
    setIsModalOpen(true);
  }

  function updateValues(patch: Partial<TaskEditorValues>) {
    setValues((currentValue) => ({ ...currentValue, ...patch }));
  }

  function toggleTag(tagId: number) {
    setValues((currentValue) => ({
      ...currentValue,
      tagIds: currentValue.tagIds.includes(tagId)
        ? currentValue.tagIds.filter((currentTagId) => currentTagId !== tagId)
        : [...currentValue.tagIds, tagId],
    }));
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTaskId(null);
    setValues(defaultValues);
  }

  async function saveTask() {
    if (!session.token) {
      setError("Necesitas iniciar sesion para guardar tareas");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      title: values.title,
      description: values.description || undefined,
      projectId,
      status: values.status,
      tagIds: values.tagIds,
    };

    try {
      if (editingTaskId === null) {
        await tasksService.create(session.token, payload);
      } else {
        await tasksService.update(session.token, editingTaskId, payload);
      }

      closeModal();
      await refresh();
    } catch (errorValue) {
      if (errorValue instanceof ApiError) {
        setError(errorValue.message);
      } else if (errorValue instanceof Error) {
        setError(errorValue.message);
      } else {
        setError("No se pudo guardar la task");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ...session,
    project,
    projectTasks,
    groupedTasks,
    tags,
    error,
    isLoading,
    isSubmitting,
    isModalOpen,
    editingTaskId,
    values,
    refresh,
    openCreateTask,
    openEditTask,
    updateValues,
    toggleTag,
    closeModal,
    saveTask,
  };
}