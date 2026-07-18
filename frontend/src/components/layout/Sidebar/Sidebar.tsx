import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  BrainCircuit,
  ChevronLeft,
  CircleHelp,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { NAVIGATION_ITEMS } from "@/constants/navigation.constants";
import { cn } from "@/lib/utils";
import { userMock } from "@/mocks/user.mock";

import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

function getUserInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function Sidebar({
  isMobileOpen,
  onCloseMobile,
}: Readonly<SidebarProps>) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const sidebarRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const initials = getUserInitials(userMock.name);

  const toggleCollapsed = (): void => {
    setIsCollapsed((currentState) => !currentState);
  };

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleEscape = (event: globalThis.KeyboardEvent): void => {
      if (event.key === "Escape") {
        onCloseMobile();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileOpen, onCloseMobile]);

  const handleSidebarKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
  ): void => {
    if (event.key !== "Tab" || !isMobileOpen) {
      return;
    }

    const sidebar = sidebarRef.current;

    if (!sidebar) {
      return;
    }

    const focusableElements = Array.from(
      sidebar.querySelectorAll<HTMLElement>(
        [
          "a[href]",
          "button:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          '[tabindex]:not([tabindex="-1"])',
        ].join(","),
      ),
    ).filter(
      (element) =>
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-hidden") !== "true",
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement =
      focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement?.focus();
      return;
    }

    if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement?.focus();
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px]",
          "transition-opacity duration-300 md:hidden",
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
        aria-label="Fechar menu principal"
        aria-hidden={!isMobileOpen}
        tabIndex={isMobileOpen ? 0 : -1}
      />

      <aside
        ref={sidebarRef}
        onKeyDown={handleSidebarKeyDown}
        className={cn(
          "fixed inset-y-0 left-0 z-50",
          "flex min-h-dvh flex-col overflow-hidden",
          "border-r border-border bg-surface/98",
          "shadow-elevated backdrop-blur-xl",
          "transition-[width,transform] duration-300 ease-out",
          "motion-reduce:transition-none",
          "w-[min(18rem,calc(100vw-1rem))]",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
          "md:static md:min-h-0 md:translate-x-0",
          "md:rounded-[20px] md:border",
          "md:border-border-highlight/60",
          isCollapsed
            ? "md:w-[80px]"
            : "md:w-[176px] xl:w-[196px]",
        )}
        aria-label="Menu principal"
        aria-hidden={!isMobileOpen ? undefined : false}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-40",
            "bg-[radial-gradient(circle_at_top,var(--glow-primary),transparent_70%)]",
            "opacity-60",
          )}
          aria-hidden="true"
        />

        <div
          className={cn(
            "relative flex min-h-[82px] shrink-0 items-center",
            "border-b border-border-muted",
            isCollapsed
              ? "justify-between px-4 md:justify-center md:px-2"
              : "justify-between px-4",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 items-center",
              isCollapsed
                ? "gap-3 md:justify-center"
                : "gap-3",
            )}
          >
            <div
              className={cn(
                "relative flex size-11 shrink-0 items-center",
                "justify-center rounded-[25px]",
                "border border-primary/35",
                "bg-gradient-to-br from-primary/25",
                "via-primary/10 to-secondary/20",
                "text-primary-bright",
                "shadow-[0_0_24px_-8px_var(--glow-primary)]",
              )}
            >
              <BrainCircuit
                size={25}
                strokeWidth={2}
                aria-hidden="true"
              />

              <Sparkles
                size={10}
                className="absolute right-1 top-1 text-secondary-bright"
                aria-hidden="true"
              />
            </div>

            <div
              className={cn(
                "min-w-0 transition-[opacity,transform,width]",
                "duration-200 motion-reduce:transition-none",
                isCollapsed
                  ? "md:pointer-events-none md:w-0 md:-translate-x-2 md:opacity-0"
                  : "w-auto translate-x-0 opacity-100",
              )}
            >
              <p className="truncate text-sm font-semibold tracking-tight text-text">
                FINANCE AI
              </p>

              
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onCloseMobile}
            className={cn(
              "flex size-10 shrink-0 items-center justify-center",
              "rounded-xl border border-border bg-surface-elevated",
              "text-text-muted transition-colors",
              "hover:border-border-highlight hover:text-text",
              "focus-visible:ring-2 focus-visible:ring-primary",
              "md:hidden",
            )}
            aria-label="Fechar menu principal"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <nav
          className={cn(
            "relative flex min-h-0 flex-1 flex-col",
            "gap-2 overflow-y-auto overflow-x-hidden",
            "px-3 py-5",
          )}
          aria-label="Navegação da aplicação"
        >
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              onNavigate={onCloseMobile}
            />
          ))}
        </nav>

        <div className="relative shrink-0 space-y-2 px-3 pb-3">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Central de ajuda — Em breve"
            className={cn(
              "flex min-h-11 w-full items-center rounded-xl",
              "border border-border-muted",
              "bg-surface-elevated/45 text-text-muted",
              "disabled:cursor-not-allowed disabled:opacity-70",
              isCollapsed
                ? "justify-start gap-3 px-3 md:justify-center md:gap-0 md:px-2"
                : "justify-start gap-3 px-3",
            )}
          >
            <CircleHelp
              size={19}
              className="shrink-0"
              aria-hidden="true"
            />

            <span
              className={cn(
                "min-w-0 truncate text-sm font-medium",
                isCollapsed && "md:hidden",
              )}
            >
              Ajuda
            </span>

            {!isCollapsed && (
              <span className="ml-auto text-[9px] uppercase tracking-wide text-text-subtle">
                Em breve
              </span>
            )}
          </button>

          <div
            className={cn(
              "flex min-h-[62px] items-center rounded-[15px]",
              "border border-border bg-card",
              "shadow-card",
              isCollapsed
                ? "gap-3 px-3 md:justify-center md:gap-0 md:px-2"
                : "gap-3 px-3",
            )}
          >
            <div className="relative shrink-0">
              <Avatar className="size-9 border border-border-highlight">
                <AvatarImage
                  src={userMock.avatar}
                  alt={`Foto de ${userMock.name}`}
                />

                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary-bright">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 size-2.5",
                  "rounded-full border-2 border-surface",
                  "bg-success",
                )}
                aria-label="Usuário online"
              />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-text">
                  {userMock.name}
                </p>

                <p className="mt-0.5 truncate text-[10px] font-medium text-primary-bright">
                  Premium
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Sair — autenticação ainda não integrada"
            className={cn(
              "flex min-h-10 w-full items-center rounded-xl",
              "text-text-muted transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-65",
              isCollapsed
                ? "justify-start gap-3 px-3 md:justify-center md:gap-0 md:px-2"
                : "justify-start gap-3 px-3",
            )}
          >
            <LogOut
              size={18}
              className="shrink-0"
              aria-hidden="true"
            />

            <span
              className={cn(
                "truncate text-sm font-medium",
                isCollapsed && "md:hidden",
              )}
            >
              Sair
            </span>
          </button>

          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "hidden min-h-10 w-full items-center rounded-xl",
              "border border-transparent text-sm font-medium",
              "text-text-muted transition-colors duration-200",
              "hover:border-border hover:bg-surface-elevated",
              "hover:text-text",
              "focus-visible:ring-2 focus-visible:ring-primary",
              "motion-reduce:transition-none md:flex",
              isCollapsed
                ? "justify-center px-2"
                : "justify-start gap-3 px-3",
            )}
            aria-label={
              isCollapsed
                ? "Expandir menu lateral"
                : "Recolher menu lateral"
            }
            aria-expanded={!isCollapsed}
          >
            <ChevronLeft
              size={18}
              className={cn(
                "shrink-0 transition-transform duration-300",
                "motion-reduce:transition-none",
                isCollapsed && "rotate-180",
              )}
              aria-hidden="true"
            />

            {!isCollapsed && <span>Recolher menu</span>}
          </button>
        </div>
      </aside>
    </>
  );
}