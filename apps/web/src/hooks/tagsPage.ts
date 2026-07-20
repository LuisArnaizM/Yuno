import { useEffect, useState } from "react";
import { createTagDtoSchema, type TagDto } from "@yuno/shared-types";
import { ApiError } from "@/lib/api-client";
import { tagsService } from "@/services/tags-service";

export function useTagsPage() {
  const [tags, setTags] = useState<TagDto[]>([]);
  const [values, setValues] = useState({ name: "", color: "#14b8a6" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refresh() {
    setIsLoading(true);
    setError(null);

    try {
      setTags(await tagsService.list());
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : "No se pudieron cargar los tags",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function createTag() {
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = createTagDtoSchema.parse({
        name: values.name,
        color: values.color || undefined,
      });
      const tag = await tagsService.create(payload);
      setTags((currentValue) => [tag, ...currentValue]);
      setValues({ name: "", color: values.color || "#14b8a6" });
    } catch (errorValue) {
      if (errorValue instanceof ApiError) {
        setError(errorValue.message);
      } else if (errorValue instanceof Error) {
        setError(errorValue.message);
      } else {
        setError("No se pudo crear el tag");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    tags,
    values,
    setValues,
    error,
    isLoading,
    isSubmitting,
    refresh,
    createTag,
  };
}