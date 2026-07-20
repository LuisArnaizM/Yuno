import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  SIDEBAR_MIN_OFFSET,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/components/layout/navigation";
import { useAppSession } from "@/providers/app-session-provider";

export function AppLayout() {
  const session = useAppSession();
  const [theme, setTheme] = useState<Theme>("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartOpenRef = useRef(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!isDraggingSidebar) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (dragStartXRef.current === null) {
        return;
      }

      setDragOffset(event.clientX - dragStartXRef.current);
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (dragStartXRef.current === null) {
        setIsDraggingSidebar(false);
        return;
      }

      const baseOffset = dragStartOpenRef.current ? 0 : SIDEBAR_MIN_OFFSET;
      const deltaX = event.clientX - dragStartXRef.current;
      const finalOffset = Math.max(
        SIDEBAR_MIN_OFFSET,
        Math.min(0, baseOffset + deltaX),
      );
      const shouldOpen = finalOffset > SIDEBAR_MIN_OFFSET / 2;

      dragStartXRef.current = null;
      setDragOffset(0);
      setIsSidebarOpen(shouldOpen);
      setIsDraggingSidebar(false);
      document.body.style.userSelect = "";
    };

    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      document.body.style.userSelect = "";
    };
  }, [isDraggingSidebar]);

  const baseSidebarOffset = isSidebarOpen ? 0 : SIDEBAR_MIN_OFFSET;
  const sidebarOffset = Math.max(
    SIDEBAR_MIN_OFFSET,
    Math.min(0, baseSidebarOffset + dragOffset),
  );

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  function handleSidebarToggle() {
    setDragOffset(0);
    setIsSidebarOpen((currentValue) => !currentValue);
  }

  function handleDragStart(clientX: number) {
    dragStartOpenRef.current = isSidebarOpen;
    dragStartXRef.current = clientX;
    setIsDraggingSidebar(true);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <AppSidebar
        isOpen={isSidebarOpen}
        sidebarOffset={sidebarOffset}
        isDragging={isDraggingSidebar}
        onToggle={handleSidebarToggle}
        onClose={() => setIsSidebarOpen(false)}
        onDragStart={handleDragStart}
      />

      <div className="relative min-h-screen">
        <AppHeader
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={handleSidebarToggle}
          theme={theme}
          onThemeToggle={toggleTheme}
          user={session.user}
          onLogout={session.logout}
        />

        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-6 pt-24 sm:px-6 lg:pb-8">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
