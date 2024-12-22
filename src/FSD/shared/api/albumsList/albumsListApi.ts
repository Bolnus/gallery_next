import { ApiResponse } from "../apiTypes";
import { mapAlbums } from "../apiUtils";
import { axiosClient, handleResponseError } from "../galleryApi";
import { AlbumsListWithTotal, ApiAlbumsWithTotal } from "./types";

export async function getAlbumsListQuery(searchParams?: URLSearchParams): Promise<AlbumsListWithTotal> {
  let outSearchParams: URLSearchParams;
  if (searchParams) {
    outSearchParams = new URLSearchParams(searchParams.toString());
  } else {
    outSearchParams = new URLSearchParams();
  }
  const queryString = outSearchParams.toString().replace(/\+/g, "%20");
  const response = await axiosClient.get<ApiAlbumsWithTotal>(`/albums_list?${queryString}`);
  return {
    albumsList: response.data.albumsList.map(mapAlbums),
    totalCount: response.data.totalCount
  };
}

export function getAlbumsListError(localError: unknown) {
  return handleResponseError(localError, "/albums_list");
}

export async function getAlbumsList(searchParams?: URLSearchParams): Promise<ApiResponse<AlbumsListWithTotal>> {
  const path = "/albums_list";
  try {
    let outSearchParams: URLSearchParams;
    if (searchParams) {
      outSearchParams = new URLSearchParams(searchParams.toString());
    } else {
      outSearchParams = new URLSearchParams();
    }
    const queryString = outSearchParams.toString().replace(/\+/g, "%20");
    const response = await axiosClient.get<ApiAlbumsWithTotal>(`${path}?${queryString}`);

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