import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidatePath("/main/[pageNumber]");
  return NextResponse.json({ success: true });
}
