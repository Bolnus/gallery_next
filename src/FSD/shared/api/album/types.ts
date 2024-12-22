import { Album, GalleryImage } from "../../lib/common/galleryTypes";

export interface AlbumWithImages extends Album {
  fullImages: GalleryImage[];
}

export interface PutAlbumHeadersArgs {
  id: string;
  albumName: string;
  tags: string[];
}
