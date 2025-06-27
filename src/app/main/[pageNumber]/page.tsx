import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DEFAULT_PAGE_SIZE, PAGE_PARAM, SIZE_PARAM } from "../../../FSD/pages/albumsSearch/consts/consts";
import { getAlbumsListServerSide } from "../../../FSD/shared/api/album/albumApiServer";
import { AlbumParam, AlbumsListParam, AlbumsListProps } from "../../../FSD/shared/lib/common/galleryTypes";
import { AlbumsList } from "../../../FSD/widgets/AlbumListItem/ui/AlbumsList";
import { AlbumsListLoading } from "../../../FSD/pages/albumsListLoading/ui/AlbumsListLoading";
import { AlbumsListPage } from "../../../FSD/pages/albumsList/ui/AlbumsListPage";

export async function generateStaticParams(): Promise<AlbumsListParam[]> {
  const paths: AlbumsListParam[] = [];
  const searchParams = new URLSearchParams();
  searchParams.set(PAGE_PARAM, "0");
  searchParams.set(SIZE_PARAM, "30");
  const res = await getAlbumsListServerSide(searchParams);
  const { totalCount } = res.data;
  for (let i = 1; i <= Math.ceil(totalCount / 30); i++) {
    paths.push({ pageNumber: String(i) });
  }
  return paths;
}

export default async function AlbumsHome({ params }: AlbumsListProps): Promise<JSX.Element> {
  const searchParams = new URLSearchParams();
  searchParams.set(PAGE_PARAM, params.pageNumber);
  searchParams.set(SIZE_PARAM, "30");
  const res = await getAlbumsListServerSide(searchParams);
  const { totalCount, albumsList } = res.data;

  return (
    <Suspense fallback={<AlbumsListLoading />}>
      <AlbumsListPage
        albums={albumsList}
        totalCount={totalCount}
        pageNumber={Number(params.pageNumber)}
        pageSize={DEFAULT_PAGE_SIZE}
      />
    </Suspense>
  );
}
