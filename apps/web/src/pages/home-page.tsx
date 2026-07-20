import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderOpen,
  Layers3,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { TaskDto } from "@yuno/shared-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatTaskStatus } from "@/lib/formatters";
import { useDashboardPage } from "@/hooks/dashboardPage";
import { HomeProjectList } from "../components/home/home-project-list";
import { useI18n } from "@/providers/i18n-provider";

export function HomePage() {
  const dashboard = useDashboardPage();
  const { locale, t } = useI18n();
  const summary = dashboard.summary;
  const stats = summary?.stats;
  const inProgressTasks: TaskDto[] = summary?.tasksInProgress ?? [];

  return (
    <section className="grid gap-6">
      <Card className="overflow-hidden border-border/70 bg-card/88">
        <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="grid gap-4">
            <Badge className="w-fit" variant="secondary">
              {t("dashboard.badge")}
            </Badge>
            <div className="grid gap-3">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("dashboard.title")}
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                {t("dashboard.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/app/projects">
                <Button variant="outline">
                  {t("dashboard.cta.projects")}
                  <FolderOpen className="size-4" />
                </Button>
              </Link>
              <Link to={dashboard.isAuthenticated ? "/app/tasks" : "/auth"}>
                <Button>
                  {dashboard.isAuthenticated ? t("dashboard.cta.tasks") : t("auth.connect")}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3">
              <span className="text-sm text-muted-foreground">{t("common.userPanel")}</span>
              <span className="text-sm font-medium">
                {dashboard.isAuthenticated ? dashboard.user?.name : "Invitado"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3">
              <span className="text-sm text-muted-foreground">{t("dashboard.stats.projects")}</span>
              <span className="text-sm font-medium">
                {stats?.projectsCount ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3">
              <span className="text-sm text-muted-foreground">{t("dashboard.stats.inProgress")}</span>
              <span className="text-sm font-medium">
                {stats?.tasksInProgressCount ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3">
              <span className="text-sm text-muted-foreground">{t("dashboard.stats.progress")}</span>
              <span className="text-sm font-medium">
                {stats ? `${stats.completionRate}%` : "0%"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers3 className="size-4 text-primary" /> {t("dashboard.stats.projects")}
            </CardTitle>
            <CardDescription>
              {t("projects.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats?.projectsCount ?? 0}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock3 className="size-4 text-primary" /> {t("dashboard.stats.inProgress")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.tasks.title")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats?.tasksInProgressCount ?? 0}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="size-4 text-primary" /> {t("dashboard.stats.assigned")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.stats.assigned")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats?.assignedTasksCount ?? 0}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="size-4 text-primary" /> {t("dashboard.stats.progress")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.stats.progress")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats ? `${stats.completionRate}%` : "0%"}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <HomeProjectList
          projects={summary?.projects ?? []}
          isLoading={dashboard.isLoading}
        />

        <Card className="border-border/70 bg-card/88">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock3 className="size-5 text-primary" /> {t("dashboard.tasks.title")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {dashboard.isLoading ? (
              <p className="text-sm text-muted-foreground">
                {t("common.loadingMore")}
              </p>
            ) : null}

            {!dashboard.isLoading && inProgressTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.tasks.empty")}
              </p>
            ) : null}

            {inProgressTasks.slice(0, 5).map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-border/70 bg-background/75 p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {task.description ?? t("common.noDescription")}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {formatTaskStatus(task.status, locale)}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {task.project?.name ?? t("common.noDescription")}
                  </Badge>
                  {task.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                  <Badge variant="outline">{formatDate(task.updatedAt, locale)}</Badge>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>

      {dashboard.error ? (
        <p className="text-sm text-red-600">{dashboard.error}</p>
      ) : null}
    </section>
  );
}
