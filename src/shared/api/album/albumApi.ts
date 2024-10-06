import { ApiAlbum, ApiMessage, ApiResponse } from "../apiTypes";
import { mapAlbums, mapPictureIdToFullRef } from "../apiUtils";
import { axiosClient, handleResponseError, isApiError, isAxiosError } from "../galleryApi";
import { AlbumWithImages } from "./types";

export async function getAlbum(albumId: string): Promise<ApiResponse<AlbumWithImages | null>> {
  const path = "/albums_list/album";
  try {
    const response = await axiosClient.get<ApiAlbum>(`${path}?id=${albumId}`);
    return {
      rc: 200,
      data: {
        album: mapAlbums(response.data),
        images: response.data?.pictureIds.map(mapPictureIdToFullRef)
      }
    };
  } catch (localError: unknown) {
    return handleResponseError(localError, path);
  }
}

export async function putAlbumHeaders(
  id: string,
  albumName: string,
  tags: string[]
): Promise<ApiResponse<ApiMessage | null>> {
  const path = "/albums_list/album/headers";
  try {
    await axiosClient.put(path, {
      id,
      albumName,
      tags
    });
    return {
      rc: 200,
      data: null
    };
  } catch (localError: unknown) {
    handleResponseError(localError, path);
    if (isApiError(localError)) {
      return {
        rc: localError?.response?.status || 500,
        data: localError?.response?.data as ApiMessage
      };
    }
    if (isAxiosError(localError)) {
      return {
        rc: localError?.response?.status || 500,
        data: {
          message: localError?.message,
          title: localError?.code || ""
        }
      };
    }
    return {
      rc: 500,
      data: {
        message: "Unknown error",
        title: "Unknown error"
      }
    };
  }
}
