import { Suspense } from "react";
import { AlbumsSearchPage } from "../../FSD/pages/albumsSearch/ui/AlbumSearchPage";
import { AlbumSearchPageLoading } from "../../FSD/pages/albumsSearch/ui/AlbumSearchPageLoading";

export default function AlbumsSearch() {
  return (
    <Suspense fallback={<AlbumSearchPageLoading />}>
      <AlbumsSearchPage />
    </Suspense>
  );
}
