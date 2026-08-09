// Using inline SVGs for social icons to avoid import issues with lucide-react
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { BrandLogo } from "../BrandLogo";

const navigation = [
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
    label: "Tecnologias",
    href: "#tecnologias",
  },
  {
    label: "Equipe",
    href: "#equipe",
  },
];

export function LandingFooter() {
  function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 19 19" width="17" height="17" fill="currentColor" aria-hidden="true" {...props}>
        <path fill="currentColor" fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd" />
      </svg>
    );
  }

  function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M4.98 3.5C4.98 4.6 4.12 5.5 3 5.5S1 4.6 1 3.5 1.86 1.5 3 1.5s1.98.9 1.98 2zM.5 8.98h5V23h-5V8.98zM8.5 8.98h4.79v1.94h.07c.67-1.27 2.3-2.6 4.74-2.6 5.07 0 6 3.33 6 7.66V23h-5v-6.5c0-1.55-.03-3.55-2.17-3.55-2.17 0-2.5 1.7-2.5 3.45V23h-5V8.98z" />
      </svg>
    );
  }
  return (
    <footer className="border-t border-border-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <BrandLogo />

            <p className="mt-4 text-xs leading-5 text-text-muted">
              Inteligência financeira para
              transformar dados em decisões mais
              conscientes.
            </p>
          </div>

          <nav
            aria-label="Navegação do rodapé"
            className="flex flex-wrap gap-x-5 gap-y-3"
          >
            {navigation.map(
              ({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-xs font-medium text-text-muted transition-colors hover:text-primary-bright"
                >
                  {label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub do Finance AI"
              className={cn(
                "flex size-10 items-center",
                "justify-center rounded-[12px]",
                "border border-border-muted",
                "text-text-muted",
                "transition-colors",
                "hover:border-primary/30",
                "hover:text-primary-bright",
              )}
            >
              <GithubIcon aria-hidden="true" />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn da equipe"
              className={cn(
                "flex size-10 items-center",
                "justify-center rounded-[12px]",
                "border border-border-muted",
                "text-text-muted",
                "transition-colors",
                "hover:border-primary/30",
                "hover:text-primary-bright",
              )}
            >
              <LinkedinIcon aria-hidden="true" />
            </a>

            <Link
              to="/login"
              className="ml-2 text-xs font-semibold text-primary-bright hover:underline"
            >
              Entrar
            </Link>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-border-muted pt-6 text-[10px] text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Finance AI.
            Todos os direitos reservados.
          </p>

          <p>
            Projeto desenvolvido para o Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}