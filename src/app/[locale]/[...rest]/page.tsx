import { notFound } from "next/navigation";

export default function CatchAll(): null {
  notFound();
  return null;
}
