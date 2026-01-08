"use client";
import { useLocale } from "next-intl";
import React from "react";
import { axiosClient } from "../../../shared/api/galleryApi";

function onResize() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export function BaseProvider({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const locale = useLocale();

  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    const interceptor = axiosClient.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = locale;
      return config;
    });

    return () => axiosClient.interceptors.request.eject(interceptor);
  }, [locale]);

  return <>{children}</>;
}
