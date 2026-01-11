import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(): Promise<unknown> {
  revalidatePath("[locale]/main/[pageNumber]");
  return NextResponse.json({ success: true });
}
