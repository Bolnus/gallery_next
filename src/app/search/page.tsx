import { Suspense } from "react";
import { AlbumsSearchPage } from "../../FSD/pages/albumsSearch/ui/AlbumSearchPage";
import { AlbumsListLoading } from "../../FSD/pages/albumsListLoading/ui/AlbumsListLoading";

export default function AlbumsSearch() {
  return (
    <Suspense fallback={<AlbumsListLoading hasSearch />}>
      <AlbumsSearchPage />
    </Suspense>
  );
}
