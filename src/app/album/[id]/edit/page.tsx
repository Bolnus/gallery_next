import { AlbumEditView } from "../../../../FSD/pages/albumEdit/ui/AlbumEditView";
import { AlbumPageProps } from "../../../../FSD/shared/lib/common/galleryTypes";
import { revalidateAlbum } from "../../../../FSD/shared/lib/common/serverActions";

export default async function Page({ params }: Readonly<AlbumPageProps>): Promise<JSX.Element> {
  const { id } = await params;
  return <AlbumEditView onEditAlbumId={id} revalidateAlbum={revalidateAlbum} />;
}
