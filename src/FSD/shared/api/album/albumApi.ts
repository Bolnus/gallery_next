import { AxiosResponse } from "axios";
import { ApiAlbum, ApiMessage, ApiResponse } from "../apiTypes";
import { mapAlbumHeaders, mapAlbums, mapPictureIdToFullRef } from "../apiUtils";
import { axiosClient, handleResponseError, isApiError, isAxiosError } from "../galleryApi";
import { AlbumWithImages, PutAlbumHeadersArgs } from "./types";
import { AlbumHeaders } from "../../lib/common/galleryTypes";

const HEADERS_PATH = "/albums_list/album/headers";
const UNKNOWN_ERROR = "Unknown error";

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
  try {
    await axiosClient.put(HEADERS_PATH, {
      id,
      albumName,
      tags
    });
    return {
      rc: 200,
      data: null
    };
  } catch (localError: unknown) {
    handleResponseError(localError, HEADERS_PATH);
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
        message: UNKNOWN_ERROR,
        title: UNKNOWN_ERROR
      }
    };
  }
}

export async function saveAlbumHeadersMutation({
  id,
  albumName,
  tags,
  description,
  locale
}: PutAlbumHeadersArgs): Promise<AxiosResponse<{ id?: string }>> {
  // const path = "/albums_list/album/headers";
  if (id) {
    return axiosClient.put<{ id?: string }>(HEADERS_PATH, {
      id,
      albumName,
      tags,
      description,
      locale
    });
  }
  return axiosClient.post<{ id?: string }>("/albums_list/album", {
    albumName,
    tags,
    description,
    locale
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
  handleResponseError(localError, HEADERS_PATH);
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
    data: UNKNOWN_ERROR
  };
}
