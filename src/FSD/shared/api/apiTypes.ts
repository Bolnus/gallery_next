import { Album, GalleryImage } from "../lib/common/galleryTypes";

export interface ApiAlbum {
  _id: string;
  albumName: string;
  albumSize: number;
  changedDate: string;
  tags: ApiTag[];
  pictureIds?: string[];
}

export interface ApiResponse<T> {
  rc: number;
  data: T;
  isOk?: boolean;
}

export interface ApiMessage {
  title: string;
  message: string;
}

export interface ApiTag {
  _id: string;
  tagName: string;
  albumsCount: number;
}
