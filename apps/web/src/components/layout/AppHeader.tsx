import { LogOut, Menu, Moon, Sun } from "lucide-react";
import type { UserDto } from "@yuno/shared-types";
import { Button } from "@/components/ui/button";
import { buttonClassName } from "@/components/ui/button/classname";
import { Switch } from "@/components/ui/switch";
import type { Theme } from "./navigation";
import { useI18n } from "@/providers/i18n-provider";

interface AppHeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  user: UserDto | null;
  onLogout: () => void;
}

export function AppHeader({
  isSidebarOpen,
  onSidebarToggle,
  theme,
  onThemeToggle,
  user,
  onLogout,
}: AppHeaderProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-border/80 bg-card/88 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="size-10 px-0"
            onClick={onSidebarToggle}
            aria-label={isSidebarOpen ? "Cerrar menu" : "Abrir menu"}
          >
            <Menu className="size-5" />
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">Yuno</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Task Sandbox
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1 rounded-full border border-border/80 bg-background/80 p-1">
            <button
              type="button"
              onClick={() => setLocale("es")}
              className={buttonClassName({
                variant: locale === "es" ? "default" : "ghost",
                size: "sm",
              })}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={buttonClassName({
                variant: locale === "en" ? "default" : "ghost",
                size: "sm",
              })}
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-border/80 bg-background/80 px-3 py-2">
            {theme === "dark" ? (
              <Moon className="size-4 text-primary" />
            ) : (
              <Sun className="size-4 text-primary" />
            )}
            <Switch
              checked={theme === "dark"}
              onCheckedChange={onThemeToggle}
              aria-label={t("common.theme")}
            />
          </div>

          {user ? (
            <div className="hidden items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-2 lg:flex">
              <div className="text-right">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-9 px-0"
                onClick={onLogout}
                aria-label={t("common.userPanel")}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
