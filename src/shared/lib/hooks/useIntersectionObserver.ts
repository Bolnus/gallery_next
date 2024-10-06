"use client";
import React from "react";

function onObserverChange(setIntersecting: (flag: boolean) => void, entries: IntersectionObserverEntry[]) {
  setIntersecting(entries?.[0]?.isIntersecting);
}

export function useIntersectionObserver(
  target: React.MutableRefObject<Element | null>,
  options: IntersectionObserverInit
) {
  const [intersecting, setIntersecting] = React.useState(false);

  React.useEffect(
    function () {
      let observer: IntersectionObserver;
      if (target.current) {
        observer = new IntersectionObserver(onObserverChange.bind(null, setIntersecting), options);
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
