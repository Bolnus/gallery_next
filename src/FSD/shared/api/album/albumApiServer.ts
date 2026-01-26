"use server";
import { AlbumsListWithTotal, ApiAlbumsWithTotal } from "../albumsList/types";
import { ApiAlbum, ApiResponse } from "../apiTypes";
import { mapAlbums, mapPictureIdToFullRef } from "../apiUtils";
import { handleResponseError } from "../galleryApi";
import { AlbumWithImages } from "./types";
import { axiosClientServer as axiosClient } from "../apiUtilsServer";
import { AxiosRequestConfig } from "axios";

function getServerHeaders(lang?: string): AxiosRequestConfig {
  return {
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Accept-Language": lang || "en"
    }
  };
}

export async function getAlbumServerSide(lang: string, albumId: string): Promise<ApiResponse<AlbumWithImages | null>> {
  const path = "/albums_list/album";
  try {
    const response = await axiosClient.get<ApiAlbum>(`${path}?id=${albumId}`, getServerHeaders(lang));
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

export async function getAlbumsListServerSide(
  searchParams?: URLSearchParams,
  lang?: string
): Promise<ApiResponse<AlbumsListWithTotal>> {
  const path = "/albums_list";
  try {
    let outSearchParams: URLSearchParams;
    if (searchParams) {
      outSearchParams = new URLSearchParams(searchParams.toString());
    } else {
      outSearchParams = new URLSearchParams();
    }
    const queryString = outSearchParams.toString().replace(/\+/g, "%20");
    const response = await axiosClient.get<ApiAlbumsWithTotal>(`${path}?${queryString}`, getServerHeaders(lang));

    return {
      rc: 200,
      data: {
        albumsList: response.data.albumsList.map(mapAlbums),
        totalCount: response.data.totalCount
      }
    };
  } catch (localError: unknown) {
    const respError = handleResponseError(localError, path);
    return {
      ...respError,
      data: {
        albumsList: [],
        totalCount: 0
      }
    };
  }
}
