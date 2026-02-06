import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export function GET(): Response {
  try {
    console.log(`CRON STARTED ${new Date().toISOString()}`);
    revalidatePath("/[locale]/categories", "page");
    revalidatePath("/[locale]/main/[pageNumber]", "page");
    revalidatePath("/[locale]/categories/[category]/[pageNumber]", "page");
    console.log(`CRON FINISHED ${new Date().toISOString()}`);
    return NextResponse.json({ success: true });
  } catch (localError) {
    console.warn(localError);
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: localError instanceof Error ? localError.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
