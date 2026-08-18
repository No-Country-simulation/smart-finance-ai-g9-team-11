import {
  useEffect,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  color: string;
}

interface HeroBackgroundProps {
  className?: string;
}

const DARK_PARTICLE_COLORS = [
  "rgba(167, 139, 250, 0.95)",
  "rgba(96, 165, 250, 0.85)",
  "rgba(45, 212, 191, 0.8)",
  "rgba(255, 255, 255, 0.65)",
] as const;

const LIGHT_PARTICLE_COLORS = [
  "rgba(109, 40, 217, 0.72)",
  "rgba(37, 99, 235, 0.6)",
  "rgba(13, 148, 136, 0.55)",
  "rgba(71, 85, 105, 0.38)",
] as const;

const DESKTOP_CONNECTION_DISTANCE = 170;
const MOBILE_CONNECTION_DISTANCE = 120;

function randomBetween(
  minimum: number,
  maximum: number,
): number {
  return (
    Math.random() *
      (maximum - minimum) +
    minimum
  );
}

function isLightTheme(): boolean {
  return (
    document.documentElement.classList.contains(
      "light",
    ) ||
    document.documentElement.dataset.theme ===
      "light"
  );
}

function createParticle(
  width: number,
  height: number,
  colors: readonly string[],
): Particle {
  const colorIndex = Math.floor(
    Math.random() * colors.length,
  );

  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    velocityX: randomBetween(
      -0.38,
      0.38,
    ),
    velocityY: randomBetween(
      -0.3,
      0.3,
    ),
    radius: randomBetween(1.2, 2.8),
    color:
      colors[colorIndex] ??
      colors[0] ??
      "rgba(167, 139, 250, 0.9)",
  };
}

function getParticleCount(
  width: number,
): number {
  if (width < 640) {
    return 32;
  }

  if (width < 1024) {
    return 52;
  }

  return 82;
}

export function HeroBackground({
  className,
}: Readonly<HeroBackgroundProps>) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !container) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    let animationFrameId = 0;
    let width = 1;
    let height = 1;
    let particles: Particle[] = [];
    let isPageVisible =
      document.visibilityState ===
      "visible";

    const configureCanvas = (): void => {
      const bounds =
        container.getBoundingClientRect();

      width = Math.max(
        Math.round(bounds.width),
        1,
      );

      height = Math.max(
        Math.round(bounds.height),
        1,
      );

      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      canvas.width = Math.round(
        width * pixelRatio,
      );

      canvas.height = Math.round(
        height * pixelRatio,
      );

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0,
      );

      const colors = isLightTheme()
        ? LIGHT_PARTICLE_COLORS
        : DARK_PARTICLE_COLORS;

      particles = Array.from(
        {
          length: getParticleCount(width),
        },
        () =>
          createParticle(
            width,
            height,
            colors,
          ),
      );
    };

    const updateParticle = (
      particle: Particle,
    ): void => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (
        particle.x <= particle.radius ||
        particle.x >=
          width - particle.radius
      ) {
        particle.velocityX *= -1;

        particle.x = Math.min(
          Math.max(
            particle.x,
            particle.radius,
          ),
          width - particle.radius,
        );
      }

      if (
        particle.y <= particle.radius ||
        particle.y >=
          height - particle.radius
      ) {
        particle.velocityY *= -1;

        particle.y = Math.min(
          Math.max(
            particle.y,
            particle.radius,
          ),
          height - particle.radius,
        );
      }
    };

    const drawParticle = (
      particle: Particle,
    ): void => {
      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2,
      );

      context.fillStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = 8;
      context.fill();
      context.shadowBlur = 0;
    };

    const connectParticles = (): void => {
      const maximumDistance =
        width < 640
          ? MOBILE_CONNECTION_DISTANCE
          : DESKTOP_CONNECTION_DISTANCE;

      const lineRgb = isLightTheme()
        ? "99, 102, 241"
        : "167, 139, 250";

      for (
        let firstIndex = 0;
        firstIndex < particles.length;
        firstIndex += 1
      ) {
        const firstParticle =
          particles[firstIndex];

        if (!firstParticle) {
          continue;
        }

        for (
          let secondIndex =
            firstIndex + 1;
          secondIndex < particles.length;
          secondIndex += 1
        ) {
          const secondParticle =
            particles[secondIndex];

          if (!secondParticle) {
            continue;
          }

          const distanceX =
            firstParticle.x -
            secondParticle.x;

          const distanceY =
            firstParticle.y -
            secondParticle.y;

          const distance = Math.hypot(
            distanceX,
            distanceY,
          );

          if (distance >= maximumDistance) {
            continue;
          }

          const proximity =
            1 -
            distance / maximumDistance;

          const opacity =
            0.28 * proximity;

          context.beginPath();

          context.moveTo(
            firstParticle.x,
            firstParticle.y,
          );

          context.lineTo(
            secondParticle.x,
            secondParticle.y,
          );

          context.strokeStyle = `rgba(${lineRgb}, ${opacity})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    };

    const drawFrame = (): void => {
      context.clearRect(
        0,
        0,
        width,
        height,
      );

      for (const particle of particles) {
        updateParticle(particle);
        drawParticle(particle);
      }

      connectParticles();
    };

    const animate = (): void => {
      if (
        !isPageVisible ||
        reducedMotionQuery.matches
      ) {
        return;
      }

      drawFrame();

      animationFrameId =
        window.requestAnimationFrame(
          animate,
        );
    };

    const restartAnimation = (): void => {
      window.cancelAnimationFrame(
        animationFrameId,
      );

      drawFrame();

      if (
        isPageVisible &&
        !reducedMotionQuery.matches
      ) {
        animationFrameId =
          window.requestAnimationFrame(
            animate,
          );
      }
    };

    const handleVisibilityChange =
      (): void => {
        isPageVisible =
          document.visibilityState ===
          "visible";

        restartAnimation();
      };

    const handleMotionPreferenceChange =
      (): void => {
        restartAnimation();
      };

    configureCanvas();
    restartAnimation();

    const resizeObserver =
      new ResizeObserver(() => {
        configureCanvas();
        restartAnimation();
      });

    resizeObserver.observe(container);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    reducedMotionQuery.addEventListener(
      "change",
      handleMotionPreferenceChange,
    );

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );

      resizeObserver.disconnect();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      reducedMotionQuery.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none",
        "absolute inset-0 z-0",
        "block h-full w-full",
        "opacity-100",
        className,
      )}
      aria-hidden="true"
    />
  );
}