import { Album, DefinedTag } from "../../../shared/lib/common/galleryTypes";

export interface AlbumsListState {
  searchString: string;
  albums: Album[];
  isFetching: boolean;
  totalCount: number;
  searchTags: DefinedTag[];
}
