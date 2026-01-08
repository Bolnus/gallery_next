import { createNavigation } from "next-intl/navigation";
import { routing } from "./request";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
