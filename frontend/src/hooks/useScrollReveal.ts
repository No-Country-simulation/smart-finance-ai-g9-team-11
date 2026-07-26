import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseScrollRevealResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isVisible: boolean;
}

export function useScrollReveal<
  T extends HTMLElement = HTMLDivElement,
>({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  triggerOnce = true,
}: UseScrollRevealOptions = {}): UseScrollRevealResult<T> {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] =
    useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setIsVisible(true);

          if (triggerOnce) {
            observer.unobserve(element);
          }

          return;
        }

        if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    rootMargin,
    threshold,
    triggerOnce,
  ]);

  return {
    ref,
    isVisible,
  };
}