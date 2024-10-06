import { Album, GalleryImage } from "../../lib/common/galleryTypes";

export interface AlbumWithImages {
  album: Album;
  images: GalleryImage[];
}
