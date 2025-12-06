import { Suspense } from "react";
import { DEFAULT_PAGE_SIZE, PAGE_PARAM, SIZE_PARAM } from "../../../FSD/pages/albumsSearch/consts/consts";
import { getAlbumsListServerSide } from "../../../FSD/shared/api/album/albumApiServer";
import { AlbumsListParam, AlbumsListProps } from "../../../FSD/shared/lib/common/galleryTypes";
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

async function AlbumsHome({ pageNumber }: Readonly<AlbumsListParam>): Promise<JSX.Element> {
  const searchParams = new URLSearchParams();
  searchParams.set(PAGE_PARAM, pageNumber);
  searchParams.set(SIZE_PARAM, "30");
  const res = await getAlbumsListServerSide(searchParams);
  const { totalCount, albumsList } = res.data;

  return (
    <AlbumsListPage
      albums={albumsList}
      totalCount={totalCount}
      pageNumber={Number(pageNumber)}
      pageSize={DEFAULT_PAGE_SIZE}
    />
  );
}

export default async function Page({ params }: Readonly<AlbumsListProps>): Promise<JSX.Element> {
  const { pageNumber } = await params;
  return (
    <Suspense fallback={<AlbumsListLoading />}>
      <AlbumsHome pageNumber={pageNumber} />
    </Suspense>
  );
}
