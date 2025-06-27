export interface DefinedTag {
  id: string;
  tagName: string;
  albumsCount: number;
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

export interface AlbumHeaders {
  id: string;
  albumName: string;
  changedDate: string;
  albumSize: number;
  tags: DefinedTag[];
  description: string;
}

export interface Album extends AlbumHeaders {
  snapImages: GalleryImage[];
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

export interface AlbumParam {
  id: string;
}

export interface AlbumPageProps {
  params: AlbumParam;
}

export interface AlbumsListParam {
  pageNumber: string;
}

export interface AlbumsListProps {
  params: AlbumsListParam;
}
