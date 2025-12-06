import { AlbumListItemLoading } from "../../../widgets/AlbumListItem/ui/AlbumsListItemLoading";

export function mapLoaders(loaderId: string): JSX.Element {
  return <AlbumListItemLoading key={loaderId} />;
}
