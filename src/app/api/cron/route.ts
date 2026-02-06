import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export function GET(): Response {
  revalidatePath("/[locale]/categories", "page");
  revalidatePath("/[locale]/main/[pageNumber]", "page");
  revalidatePath("/[locale]/categories/[category]/[pageNumber]", "page");
  return NextResponse.json({ success: true });
}
