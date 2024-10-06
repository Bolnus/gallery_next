export interface DefinedTag {
  id: string;
  tagName: string;
}

export interface GalleryImage {
  id: string;
  url?: string;
  name?: string;
  type?: string;
  data?: string;
  loadState: FileLoadState;
}

export interface Album {
  id: string;
  albumName: string;
  changedDate: string;
  picturesSnap: GalleryImage[];
  albumSize: number;
  tags: DefinedTag[];
}

export enum FileLoadState {
  added = 0,
  parsed = 1,
  uploaded = 101,
  downloaded = 102,
  uploadFailed = 103,
  parsingFailed = 104
}