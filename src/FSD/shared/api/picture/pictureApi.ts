import { AxiosResponse } from "axios";
import { axiosClient, handleResponseError, isApiError, isAxiosError } from "../galleryApi";
import { GalleryImage } from "../../lib/common/galleryTypes";
import { PostPicturesResp, UploadImageData } from "./types";

export async function postAlbumPicturesMutation(
  albumId: string,
  images: GalleryImage[]
): Promise<AxiosResponse<PostPicturesResp>> {
  const formData = new FormData();
  formData.append("albumId", albumId);
  for (const image of images) {
    if (image.data) {
      formData.append("images", image.data);
    }
  }
  return axiosClient.post<PostPicturesResp>("/albums_list/album/picture", formData);
}

export async function putAlbumPicturesMutation(albumId: string, imageIds: string[]): Promise<AxiosResponse<null>> {
  return axiosClient.put("/albums_list/album/picture", {
    albumId,
    imageIds
  });
}
