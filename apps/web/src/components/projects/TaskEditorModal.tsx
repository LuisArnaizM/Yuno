import { X } from "lucide-react";
import type { TagDto, TaskStatus } from "@yuno/shared-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/providers/i18n-provider";

type TaskEditorValues = {
  title: string;
  description: string;
  status: TaskStatus;
  tagIds: number[];
};

type TaskEditorModalProps = {
  open: boolean;
  mode: "create" | "edit";
  values: TaskEditorValues;
  tags: TagDto[];
  projectName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (patch: Partial<TaskEditorValues>) => void;
  onToggleTag: (tagId: number) => void;
};

export function TaskEditorModal({
  open,
  mode,
  values,
  tags,
  projectName,
  isSubmitting,
  onClose,
  onSubmit,
  onChange,
  onToggleTag,
}: TaskEditorModalProps) {
  const { t } = useI18n();

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl border-border/70 bg-card/95 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 border-b border-border/60 p-5">
          <div className="grid gap-1">
            <CardTitle className="text-xl">
              {mode === "create"
                ? t("taskEditor.create.title")
                : t("taskEditor.edit.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{projectName}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="size-9 px-0"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="grid gap-4 p-5">
          <label className="grid gap-2">
            <Label>{t("taskEditor.title")}</Label>
            <Input
              value={values.title}
              onChange={(event) => onChange({ title: event.target.value })}
              placeholder={t("taskEditor.titlePlaceholder")}
            />
          </label>

          <label className="grid gap-2">
            <Label>{t("taskEditor.description")}</Label>
            <Textarea
              value={values.description}
              onChange={(event) =>
                onChange({ description: event.target.value })
              }
              placeholder={t("taskEditor.descriptionPlaceholder")}
            />
          </label>

          <label className="grid gap-2">
            <Label>{t("taskEditor.status")}</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={values.status}
              onChange={(event) =>
                onChange({ status: event.target.value as TaskStatus })
              }
            >
              <option value="todo">{t("taskStatus.todo")}</option>
              <option value="in_progress">{t("taskStatus.in_progress")}</option>
              <option value="blocked">{t("taskStatus.blocked")}</option>
              <option value="done">{t("taskStatus.done")}</option>
            </select>
          </label>

          <div className="grid gap-2">
            <Label>{t("taskEditor.tags")}</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isActive = values.tagIds.includes(tag.id);

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onToggleTag(tag.id)}
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

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? t("common.loading") : t("taskEditor.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
