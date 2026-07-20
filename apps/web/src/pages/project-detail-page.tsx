import { useMemo } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { TaskStatus } from "@yuno/shared-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectDetailPage } from "@/hooks/projectDetailPage";
import { formatDate, formatTaskStatus } from "@/lib/formatters";
import { useI18n } from "@/providers/i18n-provider";
import { TaskEditorModal } from "@/components/projects/TaskEditorModal";

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "blocked", "done"];

export function ProjectDetailPage() {
  const params = useParams();
  const projectId = Number(params.projectId);
  const { locale, t } = useI18n();
  const page = useProjectDetailPage(projectId);

  const counts = useMemo(
    () =>
      STATUS_ORDER.map((status) => ({
        status,
        count: page.groupedTasks[status].length,
      })),
    [page.groupedTasks],
  );

  if (Number.isNaN(projectId)) {
    return <p className="text-sm text-red-600">Invalid project</p>;
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <Link to="/app/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            {t("projects.back")}
          </Link>
          <h2 className="text-3xl font-semibold tracking-tight">
            {page.project?.name ?? t("common.loading")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {page.project?.description ?? t("common.noDescription")}
          </p>
        </div>

        <Button onClick={page.openCreateTask} disabled={!page.project}>
          <Plus className="size-4" />
          {t("projectDetail.createTask")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {counts.map((entry) => (
          <Card key={entry.status} className="border-border/70 bg-card/82">
            <CardHeader>
              <CardTitle className="text-lg">{formatTaskStatus(entry.status, locale)}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{entry.count}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <Card key={status} className="border-border/70 bg-card/88">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{formatTaskStatus(status, locale)}</span>
                <Badge variant="secondary">{page.groupedTasks[status].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {page.groupedTasks[status].map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid gap-1">
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.description ?? t("common.noDescription")}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => page.openEditTask(task)}>
                      {t("common.edit")}
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("common.updated")} {formatDate(task.updatedAt, locale)}
                  </p>
                </article>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {page.error ? <p className="text-sm text-red-600">{page.error}</p> : null}

      <TaskEditorModal
        open={page.isModalOpen}
        mode={page.editingTaskId === null ? "create" : "edit"}
        values={page.values}
        tags={page.tags}
        projectName={page.project?.name ?? ""}
        isSubmitting={page.isSubmitting}
        onClose={page.closeModal}
        onSubmit={() => void page.saveTask()}
        onChange={page.updateValues}
        onToggleTag={page.toggleTag}
      />
    </section>
  );
}