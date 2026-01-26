import { AxiosRequestConfig } from "axios";
import { AlbumsCategory, DefinedTag } from "../../lib/common/galleryTypes";
import { ApiResponse, ApiTag } from "../apiTypes";
import { mapApiTagToCategory, mapTags } from "../apiUtils";
import { axiosClientServer } from "../apiUtilsServer";
import { handleResponseError } from "../galleryApi";

export function getServerHeaders(lang?: string): AxiosRequestConfig {
  return {
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Accept-Language": lang || "en"
    }
  };
}

export async function getCategoriesServerSide(lang: string): Promise<ApiResponse<AlbumsCategory[] | null>> {
  const path = "/tags";
  try {
    const response = await axiosClientServer.get<ApiTag[]>(`/tags?withCovers=1&locale=${lang}`, getServerHeaders(lang));
    return {
      rc: 200,
      data: response.data.map(mapApiTagToCategory)
    };
  } catch (localError: unknown) {
    return handleResponseError(localError, path);
  }
}

export async function getAllTagsServerSide(): Promise<DefinedTag[]> {
  const response = await axiosClientServer.get<ApiTag[]>("/tags");
  return response.data.map(mapTags);
}
