import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export function GET(): Response {
  revalidatePath("/[locale]/main/[pageNumber]", "page");
  return NextResponse.json({ success: true });
}
