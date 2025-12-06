import { DefinedTag } from "../../lib/common/galleryTypes";
import { ApiResponse, ApiTag } from "../apiTypes";
import { mapTags } from "../apiUtils";
import { axiosClient, handleResponseError } from "../galleryApi";

export async function getAllTagsQuery(): Promise<DefinedTag[]> {
  const response = await axiosClient.get<ApiTag[]>("/tags");
  return response.data.map(mapTags);
}

export function getAllTagsError(error: unknown): ApiResponse<null> {
  return handleResponseError(error, "/tags");
}

export async function getAllTags(): Promise<ApiResponse<DefinedTag[] | null>> {
  const path = "/tags";
  try {
    const response = await axiosClient.get<ApiTag[]>(path);
    return {
      rc: 200,
      data: response.data.map(mapTags)
    };
  } catch (error: unknown) {
    return handleResponseError(error, "/tags");
  }
}
