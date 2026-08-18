import {
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { BrandLogo } from "../BrandLogo";

const navigationItems = [
  {
    label: "Benefícios",
    href: "#beneficios",
  },
  {
    label: "Como funciona",
    href: "#como-funciona",
  },
  {
    label: "Recursos",
    href: "#recursos",
  },
  {
    label: "Equipe",
    href: "#equipe",
  },
] as const;

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "border-b transition-[background-color,border-color,box-shadow]",
        "duration-300",
        isScrolled
          ? [
              "border-border-muted",
              "bg-background/82",
              "shadow-[0_14px_45px_-30px_rgba(0,0,0,0.8)]",
              "backdrop-blur-xl",
            ]
          : [
              "border-transparent",
              "bg-transparent",
            ],
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-[72px]",
          "w-full max-w-7xl",
          "items-center justify-between",
          "gap-4 px-4",
          "sm:px-6 lg:px-8",
        )}
      >
        <BrandLogo />

        <nav
          className={cn(
            "hidden items-center gap-1",
            "lg:flex",
          )}
          aria-label="Navegação principal"
        >
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-3 py-2",
                "text-sm font-medium",
                "text-text-muted",
                "transition-colors",
                "hover:bg-surface-elevated/70",
                "hover:text-text",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div
          className={cn(
            "hidden items-center gap-2",
            "sm:flex",
          )}
        >
          <Link
            to="/login"
            className={cn(
              "inline-flex h-10",
              "items-center justify-center",
              "rounded-xl px-4",
              "text-sm font-semibold",
              "text-text-muted",
              "transition-colors",
              "hover:bg-surface-elevated",
              "hover:text-text",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary",
            )}
          >
            Entrar
          </Link>

          <Link
            to="/register"
            className={cn(
              "inline-flex h-10",
              "items-center justify-center",
              "gap-2 rounded-xl",
              "bg-primary px-4",
              "text-sm font-semibold",
              "text-primary-foreground",
              "shadow-[0_14px_40px_-18px_var(--glow-primary)]",
              "transition-[transform,opacity]",
              "hover:-translate-y-0.5",
              "hover:opacity-95",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary",
              "focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
              "motion-reduce:transition-none",
            )}
          >
            Criar conta

            <ArrowRight
              size={15}
              aria-hidden="true"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen((current) => !current)
          }
          className={cn(
            "flex size-10 items-center",
            "justify-center rounded-xl",
            "border border-border",
            "bg-surface-elevated/70",
            "text-text",
            "sm:hidden",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-primary",
          )}
          aria-label={
            isMenuOpen
              ? "Fechar menu"
              : "Abrir menu"
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={19} aria-hidden="true" />
          ) : (
            <Menu
              size={19}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t",
          "bg-background/95",
          "backdrop-blur-xl",
          "transition-[max-height,opacity,border-color]",
          "duration-300 sm:hidden",
          isMenuOpen
            ? [
                "max-h-96",
                "border-border-muted",
                "opacity-100",
              ]
            : [
                "max-h-0",
                "border-transparent",
                "opacity-0",
              ],
        )}
      >
        <nav
          className="space-y-1 px-4 py-4"
          aria-label="Navegação mobile"
        >
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={cn(
                "flex min-h-11",
                "items-center rounded-xl",
                "px-3 text-sm font-medium",
                "text-text-muted",
                "hover:bg-surface-elevated",
                "hover:text-text",
              )}
            >
              {item.label}
            </a>
          ))}

          <div
            className={cn(
              "grid grid-cols-2 gap-2",
              "border-t border-border-muted",
              "pt-4",
            )}
          >
            <Link
              to="/login"
              onClick={closeMenu}
              className={cn(
                "inline-flex h-11",
                "items-center justify-center",
                "rounded-xl border",
                "border-border",
                "text-sm font-semibold",
                "text-text",
              )}
            >
              Entrar
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className={cn(
                "inline-flex h-11",
                "items-center justify-center",
                "rounded-xl bg-primary",
                "text-sm font-semibold",
                "text-primary-foreground",
              )}
            >
              Criar conta
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}