import { AxiosResponse } from "axios";
import { ApiAlbum, ApiMessage, ApiResponse } from "../apiTypes";
import { mapAlbumHeaders, mapAlbums, mapPictureIdToFullRef } from "../apiUtils";
import { axiosClient, handleResponseError, isApiError, isAxiosError } from "../galleryApi";
import { AlbumWithImages, PutAlbumHeadersArgs } from "./types";
import { AlbumHeaders } from "../../lib/common/galleryTypes";

export async function getAlbum(albumId: string): Promise<ApiResponse<AlbumWithImages | null>> {
  const path = "/albums_list/album";
  try {
    const response = await axiosClient.get<ApiAlbum>(`${path}?id=${albumId}`);
    return {
      rc: 200,
      data: {
        ...mapAlbums(response.data),
        fullImages: response.data?.pictureIds?.length ? response.data.pictureIds.map(mapPictureIdToFullRef) : []
      }
    };
  } catch (localError: unknown) {
    return handleResponseError(localError, path);
  }
}

export async function getAlbumQuery(albumId: string): Promise<AlbumWithImages> {
  const path = "/albums_list/album";
  const response = await axiosClient.get<ApiAlbum>(`${path}?id=${albumId}`);
  return {
    ...mapAlbums(response.data),
    fullImages: response.data?.pictureIds?.length ? response.data.pictureIds.map(mapPictureIdToFullRef) : []
  };
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

export async function saveAlbumHeadersMutation({
  id,
  albumName,
  tags
}: PutAlbumHeadersArgs): Promise<AxiosResponse<{ id?: string }>> {
  // const path = "/albums_list/album/headers";
  if (id) {
    return axiosClient.put<{ id?: string }>("/albums_list/album/headers", {
      id,
      albumName,
      tags
    });
  }
  return axiosClient.post<{ id?: string }>("/albums_list/album", {
    albumName,
    tags
  });
}

export async function getAlbumHeadersQuery(albumId: string): Promise<AlbumHeaders> {
  const response = await axiosClient.get<ApiAlbum>(`/albums_list/album/headers?id=${albumId}`);
  return mapAlbumHeaders(response.data);
}

export async function deleteAlbumMutation(id: string): Promise<AxiosResponse> {
  return axiosClient.delete(`/albums_list/album?id=${id}`);
}

export function putAlbumHeadersError(localError: unknown): ApiResponse<string> {
  const path = "/albums_list/album/headers";
  handleResponseError(localError, path);
  if (isApiError(localError)) {
    return {
      rc: localError?.response?.status || 500,
      data: localError?.response?.data?.message || ""
    };
  }
  if (isAxiosError(localError)) {
    return {
      rc: localError?.response?.status || 500,
      data: localError?.message || ""
    };
  }
  return {
    rc: 500,
    data: "Unknown error"
  };
}

