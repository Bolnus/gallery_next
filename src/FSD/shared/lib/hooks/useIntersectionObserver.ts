"use client";
import React from "react";

export function useIntersectionObserver(
  target: React.MutableRefObject<Element | null>,
  options: IntersectionObserverInit
) {
  const [intersecting, setIntersecting] = React.useState(false);

  React.useEffect(
    () => {
      let observer: IntersectionObserver;
      if (target.current) {
        observer = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => setIntersecting(entries?.[0]?.isIntersecting),
          options
        );
        observer.observe(target.current);
      }
      return function () {
        observer?.disconnect();
      };
    },
    [target.current]
  );

  return intersecting;
}
