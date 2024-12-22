import { AlbumListItemLoading } from "../../../widgets/AlbumListItem/ui/AlbumListItemLoading";

export function mapLoaders(loaderId: string) {
  return <AlbumListItemLoading key={loaderId} />;
}
