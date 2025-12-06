"use client";
import React from "react";

export function useIntersectionObserver(target: React.MutableRefObject<Element | null>, isLoaded?: boolean): boolean {
  const [intersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    let observer: IntersectionObserver;
    if (target.current) {
      observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => setIntersecting(entries?.[0]?.isIntersecting),
        { root: global.document && document.body }
      );
      observer.observe(target.current);
    }
    return () => {
      observer?.disconnect();
    };
  }, [target, isLoaded]);

  return intersecting;
}
