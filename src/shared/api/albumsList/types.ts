import { Album } from "../../lib/common/galleryTypes";
import { ApiAlbum } from "../apiTypes";

export interface AlbumsListWithTotal {
  albumsList: Album[];
  totalCount: number;
}

export interface ApiAlbumsWithTotal {
  albumsList: ApiAlbum[];
  totalCount: number;
}
