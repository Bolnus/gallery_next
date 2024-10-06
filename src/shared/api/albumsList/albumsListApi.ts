import { ApiResponse } from "../apiTypes";
import { mapAlbums } from "../apiUtils";
import { axiosClient, handleResponseError } from "../galleryApi";
import { AlbumsListWithTotal, ApiAlbumsWithTotal } from "./types";

export async function getAlbumsList(searchParams?: URLSearchParams): Promise<ApiResponse<AlbumsListWithTotal>> {
  const path = "/albums_list";
  try {
    let outSearchParams: URLSearchParams;
    if (searchParams) {
      outSearchParams = new URLSearchParams(searchParams.toString());
    } else {
      outSearchParams = new URLSearchParams();
    }
    // const expectedNumber = Number(outSearchParams.get("limit"));
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
