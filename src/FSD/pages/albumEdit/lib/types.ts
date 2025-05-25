import { GalleryImage } from "../../../shared/lib/common/galleryTypes";

export interface SendImagesPortionRes {
  idsMap: Map<string, string>;
  imagesPortion: GalleryImage[];
}
