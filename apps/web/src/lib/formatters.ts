import type { Locale } from "@/i18n/translations";

export function formatDate(value: string, locale: Locale = "es") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTaskStatus(status: string, locale: Locale = "es") {
  const labels =
    locale === "en"
      ? {
          todo: "Created",
          in_progress: "In development",
          blocked: "Blocked",
          done: "Done",
        }
      : {
          todo: "Creado",
          in_progress: "En desarrollo",
          blocked: "Progreso parado",
          done: "Realizado",
        };

  return labels[status as keyof typeof labels] ?? labels.todo;
}
