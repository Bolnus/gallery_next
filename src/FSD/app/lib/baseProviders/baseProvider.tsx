"use client";
import React from "react";

function onResize() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export function BaseProvider({ children }: { children: React.ReactNode }): JSX.Element {
  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return <>{children}</>;
}
