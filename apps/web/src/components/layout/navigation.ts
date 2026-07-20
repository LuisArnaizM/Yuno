import {
  FolderOpen,
  Home,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  to: string;
  labelKey: "nav.dashboard.label" | "nav.projects.label";
  descriptionKey: "nav.dashboard.description" | "nav.projects.description";
  icon: LucideIcon;
  end?: boolean;
};

export const SIDEBAR_WIDTH = 288;
export const SIDEBAR_PEEK = 18;
export const SIDEBAR_MIN_OFFSET = -(SIDEBAR_WIDTH - SIDEBAR_PEEK);
export const THEME_STORAGE_KEY = "yuno-theme";

export const HEADER_HEIGHT_PX = 72;

export const navigationItems: NavigationItem[] = [
  {
    to: "/app",
    labelKey: "nav.dashboard.label",
    descriptionKey: "nav.dashboard.description",
    icon: Home,
    end: true,
  },
  {
    to: "/app/projects",
    labelKey: "nav.projects.label",
    descriptionKey: "nav.projects.description",
    icon: FolderOpen,
  },
] as const;

export type Theme = "light" | "dark";
