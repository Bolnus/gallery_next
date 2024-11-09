import { Album, GalleryImage } from "../../../shared/lib/common/galleryTypes";

export enum ChangesSaveState {
  Saved = 0,
  Saving = 1,
  Unsaved = 2,
  Loading = 3
}

export interface AlbumStateOld {
  albumData: Album;
  images: GalleryImage[];
  currentViewId: string;
  isFetching: boolean;
  unsavedChanges: ChangesSaveState;
}

export interface AlbumState {
  currentAlbumId: string;
}
