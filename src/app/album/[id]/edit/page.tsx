import { AlbumEditView } from "../../../../FSD/pages/albumEdit/ui/AlbumEditView";
import { AlbumPageProps } from "../../../../FSD/shared/lib/common/galleryTypes";
import { revalidateAlbum } from "../../../../FSD/shared/lib/common/serverActions";

export default function Page({ params }: AlbumPageProps) {
  return <AlbumEditView onEditAlbumId={params.id} revalidateAlbum={revalidateAlbum} />;
}
