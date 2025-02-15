import { AlbumEditView } from "../../../../FSD/pages/albumEdit/ui/AlbumEditView";
import { AlbumPageProps } from "../../../../FSD/shared/lib/common/galleryTypes";

export default function Page({ params }: AlbumPageProps) {
  return <AlbumEditView onEditAlbumId={params.id} />;
}
