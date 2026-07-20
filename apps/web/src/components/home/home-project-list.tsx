import { useState } from "react";
import { FolderOpenDot, Search } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeProjectCardDto } from "@yuno/shared-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/formatters";
import { useI18n } from "@/providers/i18n-provider";

type HomeProjectListProps = {
  projects: HomeProjectCardDto[];
  isLoading?: boolean;
};

export function HomeProjectList({
  projects,
  isLoading = false,
}: HomeProjectListProps) {
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

  const visibleProjects = normalizedSearch
    ? projects.filter((project) => {
        const searchableText = [project.name, project.description ?? ""]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
    : projects;

  return (
    <Card className="border-border/70 bg-card/88">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{t("dashboard.projects.title")}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <Badge variant="secondary">
            {visibleProjects.length}/{projects.length}
          </Badge>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">{t("dashboard.projects.search")}</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("dashboard.projects.search")}
              className="pl-9"
            />
          </div>
        </label>
      </CardHeader>

      <CardContent className="grid gap-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.loadingMore")}</p>
        ) : null}

        {!isLoading && visibleProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.projects.empty")}
          </p>
        ) : null}

        {visibleProjects.map((project) => (
          <Link key={project.id} to={`/app/projects/${project.id}`}>
            <Card className="border-border/70 bg-background/80 transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex gap-4 p-4">
                <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card">
                  <FolderOpenDot className="size-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="grid gap-1">
                    <h3 className="truncate text-base font-semibold">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.description ?? t("common.noDescription")}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{project.taskCount} tareas</Badge>
                    <Badge variant="outline">
                      {project.inProgressTaskCount} en curso
                    </Badge>
                    <Badge variant="outline">
                      {t("common.updated")} {formatDate(project.updatedAt, locale)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
