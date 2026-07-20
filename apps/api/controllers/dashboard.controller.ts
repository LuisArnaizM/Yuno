import type { HomeSummaryDto } from "@yuno/shared-types";
import { listProjects } from "@/controllers/project.controller";
import { listTags } from "@/controllers/tag.controller";
import { listAssignedTasks, listTasks } from "@/controllers/task.controller";

export async function getDashboardSummary(
  userId: number,
): Promise<HomeSummaryDto> {
  const [projects, tasks, assignedTasks, tags] = await Promise.all([
    listProjects(userId),
    listTasks(userId),
    listAssignedTasks(userId),
    listTags(),
  ]);

  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const completedTasksCount = tasks.filter(
    (task) => task.status === "done",
  ).length;

  const projectStatsById = new Map<
    number,
    {
      taskCount: number;
      inProgressTaskCount: number;
      updatedAt: string;
    }
  >(
    projects.map((project) => [
      project.id,
      {
        taskCount: 0,
        inProgressTaskCount: 0,
        updatedAt: project.updatedAt,
      },
    ]),
  );

  for (const task of tasks) {
    if (task.projectId == null) {
      continue;
    }

    const projectStats = projectStatsById.get(task.projectId);

    if (!projectStats) {
      continue;
    }

    projectStats.taskCount += 1;

    if (task.status === "in_progress") {
      projectStats.inProgressTaskCount += 1;
    }

    if (task.updatedAt > projectStats.updatedAt) {
      projectStats.updatedAt = task.updatedAt;
    }
  }

  return {
    stats: {
      projectsCount: projects.length,
      tasksInProgressCount: inProgressTasks.length,
      assignedTasksCount: assignedTasks.length,
      tagsCount: tags.length,
      completionRate:
        tasks.length > 0
          ? Math.round((completedTasksCount / tasks.length) * 100)
          : 0,
    },
    projects: projects.map((project) => {
      const projectStats = projectStatsById.get(project.id);

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        taskCount: projectStats?.taskCount ?? 0,
        inProgressTaskCount: projectStats?.inProgressTaskCount ?? 0,
        updatedAt: projectStats?.updatedAt ?? project.updatedAt,
      };
    }),
    tasksInProgress: inProgressTasks,
  };
}
