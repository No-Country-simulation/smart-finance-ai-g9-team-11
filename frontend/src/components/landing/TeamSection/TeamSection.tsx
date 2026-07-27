import type { LucideIcon } from "lucide-react";

import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Github,
  Linkedin,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";

import {
  teamMembers,
  type TeamMember,
  type TeamStackGroup,
} from "@/data/team";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface SocialLinkProps {
  href?: string;
  label: string;
  icon: LucideIcon;
}

interface TeamAvatarProps {
  member: TeamMember;
}

interface StackGroupProps {
  group: TeamStackGroup;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function TeamAvatar({
  member,
}: Readonly<TeamAvatarProps>) {
  const initials = getInitials(member.name);

  return (
    <div
      className={cn(
        "relative size-24 shrink-0",
        "overflow-hidden rounded-full",
        "border-2 border-primary/30",
        "bg-gradient-to-br",
        "from-primary/30",
        "via-secondary/20",
        "to-success/20",
        "shadow-[0_0_45px_-14px_var(--glow-primary)]",
        "sm:size-28",
      )}
    >
      {member.photoUrl ? (
        <img
          src={member.photoUrl}
          alt={`Foto de ${member.name}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full",
            "items-center justify-center",
            "text-2xl font-bold",
            "tracking-[-0.04em]",
            "text-primary-bright",
          )}
          aria-label={`Avatar de ${member.name}`}
        >
          {initials}
        </div>
      )}

      <span
        className={cn(
          "pointer-events-none",
          "absolute inset-0 rounded-full",
          "ring-1 ring-inset ring-white/10",
        )}
        aria-hidden="true"
      />
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: Readonly<SocialLinkProps>) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label} — abrir em nova aba`}
      className={cn(
        "inline-flex h-11 items-center",
        "justify-center gap-2.5",
        "rounded-[13px] border",
        "border-border-muted",
        "bg-background/45 px-4",
        "text-xs font-semibold",
        "text-text-muted",
        "transition-[transform,border-color,background-color,color]",
        "hover:-translate-y-0.5",
        "hover:border-primary/30",
        "hover:bg-primary/10",
        "hover:text-primary-bright",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary/50",
      )}
    >
      <Icon
        size={16}
        aria-hidden="true"
      />

      {label}

      <ArrowUpRight
        size={13}
        aria-hidden="true"
      />
    </a>
  );
}

function StackGroup({
  group,
}: Readonly<StackGroupProps>) {
  return (
    <div
      className={cn(
        "rounded-[14px] border",
        "border-border-muted",
        "bg-background/30 p-3.5",
      )}
    >
      <div className="flex items-center gap-2">
        <Code2
          size={14}
          className="shrink-0 text-primary-bright"
          aria-hidden="true"
        />

        <span
          className={cn(
            "text-[10px] font-semibold",
            "uppercase tracking-[0.12em]",
            "text-text-subtle",
          )}
        >
          {group.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {group.technologies.map(
          (technology) => (
            <span
              key={technology}
              className={cn(
                "rounded-full border",
                "border-primary/15",
                "bg-primary/[0.07]",
                "px-2.5 py-1",
                "text-[10px] font-medium",
                "text-primary-bright",
              )}
            >
              {technology}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function TeamSection() {
  const {
    ref,
    isVisible,
  } = useScrollReveal<HTMLElement>({
    threshold: 0.04,
  });

  return (
    <section
      ref={ref}
      id="equipe"
      className={cn(
        "relative scroll-mt-24",
        "overflow-hidden",
        "border-y border-border-muted",
        "px-4 py-24",
        "sm:px-6",
        "lg:px-8 lg:py-36",
      )}
    >
      <div
        className={cn(
          "pointer-events-none",
          "absolute inset-x-0 top-0",
          "h-[620px]",
          "bg-[radial-gradient(circle_at_top,var(--glow-primary),transparent_68%)]",
          "opacity-20",
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          "pointer-events-none",
          "absolute -left-40 top-1/3",
          "size-80 rounded-full",
          "bg-secondary/10 blur-[130px]",
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          "pointer-events-none",
          "absolute -right-40 bottom-1/4",
          "size-80 rounded-full",
          "bg-primary/10 blur-[130px]",
        )}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div
          className={cn(
            "scroll-reveal",
            "mx-auto max-w-4xl",
            "text-center",
            isVisible &&
              "scroll-reveal--visible",
          )}
        >
          <div
            className={cn(
              "mx-auto flex size-14",
              "items-center justify-center",
              "rounded-[18px] border",
              "border-primary/20",
              "bg-primary/10",
              "text-primary-bright",
              "shadow-[0_18px_55px_-28px_var(--glow-primary)]",
            )}
          >
            <UsersRound
              size={24}
              aria-hidden="true"
            />
          </div>

          <span
            className={cn(
              "mt-6 block",
              "text-xs font-semibold",
              "uppercase tracking-[0.18em]",
              "text-primary-bright",
            )}
          >
            Pessoas por trás do produto
          </span>

          <h2
            className={cn(
              "mt-4 text-balance",
              "text-3xl font-bold",
              "tracking-[-0.045em]",
              "text-text",
              "sm:text-4xl",
              "lg:text-6xl",
            )}
          >
            Uma equipe multidisciplinar construindo o Finance AI
          </h2>

          <p
            className={cn(
              "mx-auto mt-6 max-w-3xl",
              "text-pretty text-sm",
              "leading-7 text-text-muted",
              "sm:text-base",
            )}
          >
            Cada integrante participou diretamente
            da construção do produto, contribuindo
            com arquitetura, interface, backend,
            inteligência artificial, banco de dados,
            infraestrutura e integração.
          </p>

          <div
            className={cn(
              "mx-auto mt-8",
              "grid max-w-3xl gap-3",
              "sm:grid-cols-3",
            )}
          >
            {[
              {
                value: `${teamMembers.length}`,
                label: "Integrantes",
              },
              {
                value: "Full Stack",
                label: "Arquitetura integrada",
              },
              {
                value: "IA + Cloud",
                label: "Tecnologia aplicada",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-[16px] border",
                  "border-border-muted",
                  "bg-surface/55 px-4 py-4",
                  "backdrop-blur-xl",
                )}
              >
                <strong
                  className={cn(
                    "block text-lg font-bold",
                    "text-primary-bright",
                  )}
                >
                  {item.value}
                </strong>

                <span
                  className={cn(
                    "mt-1 block text-[10px]",
                    "uppercase tracking-[0.1em]",
                    "text-text-subtle",
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-7 lg:grid-cols-2">
          {teamMembers.map(
            (member, index) => (
              <article
                key={member.id}
                className={cn(
                  "scroll-reveal",
                  isVisible &&
                    "scroll-reveal--visible",
                  "group relative",
                  "flex min-w-0 flex-col",
                  "overflow-hidden",
                  "rounded-[26px] border",
                  member.featured
                    ? "border-primary/35 bg-primary/[0.065]"
                    : "border-border-muted bg-surface/65",
                  "p-5 backdrop-blur-xl",
                  "sm:p-7",
                  "transition-[transform,border-color,box-shadow]",
                  "duration-300",
                  "hover:-translate-y-1",
                  "hover:border-primary/35",
                  "hover:shadow-[0_30px_85px_-55px_var(--glow-primary)]",
                )}
                style={{
                  transitionDelay: `${index * 90}ms`,
                }}
              >
                <div
                  className={cn(
                    "pointer-events-none",
                    "absolute inset-x-0 top-0",
                    "h-40",
                    "bg-gradient-to-b",
                    member.featured
                      ? "from-primary/10 to-transparent"
                      : "from-surface-elevated/45 to-transparent",
                  )}
                  aria-hidden="true"
                />

                {member.featured && (
                  <div
                    className={cn(
                      "relative mb-5",
                      "flex items-center",
                      "justify-between gap-3",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center",
                        "gap-2 rounded-full border",
                        "border-primary/20",
                        "bg-primary/10",
                        "px-3 py-1.5",
                        "text-[9px] font-semibold",
                        "uppercase tracking-[0.12em]",
                        "text-primary-bright",
                      )}
                    >
                      <Star
                        size={12}
                        aria-hidden="true"
                      />

                      Liderança técnica
                    </span>

                    <Sparkles
                      size={18}
                      className="text-primary-bright"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "relative flex flex-col",
                    "gap-5 sm:flex-row",
                    "sm:items-center",
                  )}
                >
                  <TeamAvatar
                    member={member}
                  />

                  <div className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        "uppercase tracking-[0.13em]",
                        "text-text-subtle",
                      )}
                    >
                      {member.area}
                    </span>

                    <h3
                      className={cn(
                        "mt-2 text-2xl font-bold",
                        "tracking-[-0.035em]",
                        "text-text",
                      )}
                    >
                      {member.name}
                    </h3>

                    <p
                      className={cn(
                        "mt-1 text-sm font-semibold",
                        "text-primary-bright",
                      )}
                    >
                      {member.role}
                    </p>

                    <p
                      className={cn(
                        "mt-3 text-xs leading-6",
                        "text-text-muted",
                      )}
                    >
                      {member.summary}
                    </p>
                  </div>
                </div>

                <div className="relative mt-7">
                  <div className="flex items-center gap-2">
                    <Star
                      size={14}
                      className="text-warning"
                      aria-hidden="true"
                    />

                    <p
                      className={cn(
                        "text-[10px] font-semibold",
                        "uppercase tracking-[0.13em]",
                        "text-text-subtle",
                      )}
                    >
                      Destaques no projeto
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.highlights.map(
                      (highlight) => (
                        <span
                          key={highlight}
                          className={cn(
                            "rounded-full border",
                            "border-warning/15",
                            "bg-warning/[0.07]",
                            "px-3 py-1.5",
                            "text-[10px] font-medium",
                            "text-warning",
                          )}
                        >
                          {highlight}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="relative mt-7">
                  <p
                    className={cn(
                      "text-[10px] font-semibold",
                      "uppercase tracking-[0.13em]",
                      "text-text-subtle",
                    )}
                  >
                    Skills profissionais
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.skills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className={cn(
                            "rounded-full border",
                            "border-border-muted",
                            "bg-background/45",
                            "px-2.5 py-1",
                            "text-[10px] font-medium",
                            "text-text-muted",
                            "transition-colors",
                            "group-hover:border-primary/15",
                          )}
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="relative mt-7">
                  <p
                    className={cn(
                      "text-[10px] font-semibold",
                      "uppercase tracking-[0.13em]",
                      "text-text-subtle",
                    )}
                  >
                    Stack utilizada
                  </p>

                  <div
                    className={cn(
                      "mt-4 grid gap-3",
                      "sm:grid-cols-2",
                      "xl:grid-cols-3",
                    )}
                  >
                    {member.stackGroups.map(
                      (group) => (
                        <StackGroup
                          key={group.label}
                          group={group}
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="relative mt-7 flex-1">
                  <p
                    className={cn(
                      "text-[10px] font-semibold",
                      "uppercase tracking-[0.13em]",
                      "text-text-subtle",
                    )}
                  >
                    Participação no desenvolvimento
                  </p>

                  <ul className="mt-4 space-y-3">
                    {member.activities.map(
                      (activity) => (
                        <li
                          key={activity}
                          className="flex items-start gap-2.5"
                        >
                          <CheckCircle2
                            size={15}
                            className={cn(
                              "mt-0.5 shrink-0",
                              "text-success",
                            )}
                            aria-hidden="true"
                          />

                          <span
                            className={cn(
                              "text-xs leading-5",
                              "text-text-muted",
                            )}
                          >
                            {activity}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div
                  className={cn(
                    "relative mt-8",
                    "flex flex-wrap gap-3",
                    "border-t border-border-muted",
                    "pt-5",
                  )}
                >
                  <SocialLink
                    href={member.githubUrl}
                    label="GitHub"
                    icon={Github}
                  />

                  <SocialLink
                    href={member.linkedinUrl}
                    label="LinkedIn"
                    icon={Linkedin}
                  />
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}