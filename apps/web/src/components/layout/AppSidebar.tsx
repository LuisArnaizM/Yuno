import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { HEADER_HEIGHT_PX, navigationItems } from "./navigation";
import { useI18n } from "@/providers/i18n-provider";

interface AppSidebarProps {
  isOpen: boolean;
  sidebarOffset: number;
  isDragging: boolean;
  onToggle: () => void;
  onClose: () => void;
  onDragStart: (clientX: number) => void;
}

export function AppSidebar({
  isOpen,
  sidebarOffset,
  isDragging,
  onToggle,
  onClose,
  onDragStart,
}: AppSidebarProps) {
  const { t } = useI18n();

  return (
    <>
      <div
        aria-hidden={isOpen ? "false" : "true"}
        className={cn(
          "absolute inset-0 z-30 bg-black/45 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "absolute left-0 z-40 flex w-72 flex-col border-r border-border/70 bg-card/92 shadow-2xl backdrop-blur-xl transition-transform",
          isDragging ? "duration-0" : "duration-300",
        )}
        style={{
          top: `${HEADER_HEIGHT_PX}px`,
          height: `calc(100% - ${HEADER_HEIGHT_PX}px)`,
          transform: `translateX(${sidebarOffset}px)`,
        }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Yuno
            </p>
            <h2 className="text-lg font-semibold">Workspace</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="size-9 px-0"
            onClick={onToggle}
            aria-label={isOpen ? "Cerrar menu lateral" : "Abrir menu lateral"}
          >
            {isOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </Button>
        </div>

        <div className="px-3 pb-3">
          <div className="rounded-2xl bg-background/75 p-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-xl border",
                          isActive
                            ? "border-white/10 bg-white/10"
                            : "border-border bg-card",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="grid gap-0.5">
                        <span className="font-medium">
                          {t(item.labelKey as never)}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            isActive
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {t(item.descriptionKey as never)}
                        </span>
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <Separator className="my-2" />

        <div className="px-4 pb-4">
          <Card className="border-border/70 bg-background/70 shadow-none">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Linear style</CardTitle>
              <CardDescription>{t("dashboard.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
              {t("common.loadingMore")}
            </CardContent>
          </Card>
        </div>

        <div
          className="absolute inset-y-0 -right-[25px] flex w-[50px] items-center justify-center"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            event.preventDefault();
            onDragStart(event.clientX);
          }}
        >
          <button
            type="button"
            className="sidebar-grab-handle"
            aria-label="Deslizar menu lateral"
            onClick={onToggle}
          >
            <Menu className="size-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
