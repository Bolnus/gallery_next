export function isProtectedPath(pathname: string): boolean {
  return (pathname.startsWith("/album") && pathname.endsWith("edit")) || pathname === "/album";
}
