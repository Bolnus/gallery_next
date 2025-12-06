"use server";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidateAlbum(id: string): Promise<void> {
  revalidatePath(`/album/${id}`);
}
