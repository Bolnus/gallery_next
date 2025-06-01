"use server";
import { revalidatePath } from "next/cache";

export async function revalidateAlbum(id: string): Promise<void> {
  revalidatePath(`/album/${id}`);
}
