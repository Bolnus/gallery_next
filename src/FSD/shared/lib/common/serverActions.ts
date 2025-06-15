"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function revalidateAlbum(id: string): Promise<void> {
  revalidatePath(`/album/${id}`);
}
