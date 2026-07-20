import { FolderOpenDot, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/formatters";
import { useProjectsPage } from "@/hooks/projectsPage";
import { useI18n } from "@/providers/i18n-provider";

export function ProjectsPage() {
  const projects = useProjectsPage();
  const { locale, t } = useI18n();

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="border-border/70 bg-card/88">
        <CardHeader>
          <CardTitle>{t("projects.create.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="grid gap-2">
            <Label>{t("projects.create.name")}</Label>
            <Input
              value={projects.values.name}
              onChange={(event) =>
                projects.setValues((currentValue) => ({
                  ...currentValue,
                  name: event.target.value,
                }))
              }
              placeholder={t("projects.create.name")}
            />
          </label>
          <label className="grid gap-2">
            <Label>{t("projects.create.description")}</Label>
            <Textarea
              value={projects.values.description}
              onChange={(event) =>
                projects.setValues((currentValue) => ({
                  ...currentValue,
                  description: event.target.value,
                }))
              }
              placeholder={t("projects.create.description")}
            />
          </label>
          <Button
            type="button"
            disabled={projects.isSubmitting}
            onClick={() => void projects.createProject()}
          >
            <Plus className="size-4" />
            {projects.isSubmitting ? t("common.loading") : t("projects.create.button")}
          </Button>
          {projects.error ? (
            <p className="text-sm text-red-600">{projects.error}</p>
          ) : null}
          {!projects.isAuthenticated ? (
            <p className="text-sm text-muted-foreground">
              {t("projects.subtitle")}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t("projects.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("projects.subtitle")}</p>
          </div>
          <Badge variant="secondary">{projects.projects.length} activos</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.projects.map((project) => (
            <Link key={project.id} to={`/app/projects/${project.id}`}>
              <Card className="border-border/70 bg-card/82 transition hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FolderOpenDot className="size-4 text-primary" />
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground">
                  <p>{project.description ?? t("common.noDescription")}</p>
                  <p>{t("common.updated")} {formatDate(project.updatedAt, locale)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
