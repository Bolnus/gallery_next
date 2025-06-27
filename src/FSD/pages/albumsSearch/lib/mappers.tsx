import { AlbumListItemLoading } from "../../../widgets/AlbumListItem/ui/AlbumsListItemLoading";

export function mapLoaders(loaderId: string) {
  return <AlbumListItemLoading key={loaderId} />;
}
