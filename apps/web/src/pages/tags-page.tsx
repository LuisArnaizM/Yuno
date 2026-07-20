import { Palette, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTagsPage } from "@/hooks/tagsPage";

export function TagsPage() {
  const tags = useTagsPage();

  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="border-border/70 bg-card/88">
        <CardHeader>
          <CardTitle>Crear tag</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="grid gap-2">
            <Label>Nombre</Label>
            <Input
              value={tags.values.name}
              onChange={(event) =>
                tags.setValues((currentValue) => ({
                  ...currentValue,
                  name: event.target.value,
                }))
              }
              placeholder="Ej. Backend"
            />
          </label>
          <label className="grid gap-2">
            <Label>Color</Label>
            <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-3 py-2">
              <input
                type="color"
                value={tags.values.color}
                onChange={(event) =>
                  tags.setValues((currentValue) => ({
                    ...currentValue,
                    color: event.target.value,
                  }))
                }
                className="size-10 rounded-md border-0 bg-transparent p-0"
              />
              <Input
                value={tags.values.color}
                onChange={(event) =>
                  tags.setValues((currentValue) => ({
                    ...currentValue,
                    color: event.target.value,
                  }))
                }
              />
            </div>
          </label>
          <Button
            type="button"
            disabled={tags.isSubmitting}
            onClick={() => void tags.createTag()}
          >
            <Plus className="size-4" />
            {tags.isSubmitting ? "Guardando..." : "Crear tag"}
          </Button>
          {tags.error ? (
            <p className="text-sm text-red-600">{tags.error}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/88">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="size-4 text-primary" /> Biblioteca de tags
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-3">
            {tags.tags.map((tag) => (
              <div
                key={tag.id}
                className="flex min-w-36 items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              >
                <span
                  className="size-4 rounded-full"
                  style={{ backgroundColor: tag.color ?? "#94a3b8" }}
                />
                <div className="grid">
                  <span className="text-sm font-medium">{tag.name}</span>
                  <Badge variant="outline" className="mt-1 w-fit">
                    {tag.color ?? "Sin color"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
