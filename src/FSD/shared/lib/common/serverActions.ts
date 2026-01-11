"use server";
import { revalidatePath } from "next/cache";
// import { routing } from "../../../../app/request";

// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidateAlbum(id: string): Promise<void> {
  // for (const locale of routing.locales) {
  revalidatePath(`/[locale]/album/${id}`);
  // }
}
