import { LocaleValue } from "../../../../app/request";

export interface DefinedTag {
  id: string;
  tagName: string;
  albumsCount: number;
}

export enum FileLoadState {
  added = 0,
  uploadPlanned = 1,
  startedUploading = 2,
  downloadFailed = 101,
  downloading = 102,
  downloaded = 103,
  uploaded = 104,
  uploadFailed = 105,
  parsingFailed = 106,
  uploadCanceled = 107
}

export interface GalleryImage {
  id: string;
  url?: string;
  name?: string;
  type?: string;
  data?: File;
  pictureNumber?: number;
  loadState: FileLoadState;
}

export interface AlbumsCategory extends DefinedTag {
  coverSnap: GalleryImage;
}

export interface AlbumHeaders {
  id: string;
  albumName: string;
  changedDate: string;
  albumSize: number;
  tags: DefinedTag[];
  description: string;
  locale?: LocaleValue;
}

export interface Album extends AlbumHeaders {
  snapImages: GalleryImage[];
}

export const FileLoadStateAdded = 0;
export const FileLoadStateUploadPlanned = 1;
export const FileLoadStateStartedUploading = 2;
export const FileLoadStateDownloadFailed = 101;
export const FileLoadStateDownloading = 102;
export const FileLoadStateDownloaded = 103;
export const FileLoadStateUploaded = 104;
export const FileLoadStateUploadFailed = 105;
export const FileLoadStateParsingFailed = 106;
export const FileLoadStateUploadCanceled = 107;

export type ParamsProps<T> = {
  params: Promise<T>;
};

export interface LocaleProps {
  locale: string;
}

export interface AlbumParam extends LocaleProps {
  id: string;
}

export type AlbumPageProps = ParamsProps<AlbumParam>;

export interface AlbumsListParam extends LocaleProps {
  pageNumber: string;
}

export interface CategoryAlbumsParam extends AlbumsListParam {
  category: string;
}

export type AlbumsListProps = ParamsProps<AlbumsListParam>;

export enum AlbumsListSorting {
  changedDate = "changedDate",
  sample = "sample",
  none = ""
}
