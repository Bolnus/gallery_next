import { AlbumPage } from "../../../FSD/pages/album/ui/AlbumPage";
import { AlbumWithImages } from "../../../FSD/shared/api/album/types";
import { PAGE_PARAM, SIZE_PARAM } from "../../../FSD/pages/albumsSearch/consts/consts";
import { Suspense } from "react";
import { useQuery } from "react-query";
import { AlbumPageProps, AlbumParam } from "../../../FSD/shared/lib/common/galleryTypes";
import { getAlbumServerSide, getAlbumsListServerSide } from "../../../FSD/shared/api/album/albumApiServer";

export async function generateStaticParams(): Promise<AlbumParam[]> {
  let downloadedCount = 0;
  let totalCount = 1;
  let pageNumber = 1;
  const paths: AlbumParam[] = [];
  while (downloadedCount < totalCount) {
    const searchParams = new URLSearchParams();
    searchParams.set(PAGE_PARAM, String(pageNumber));
    searchParams.set(SIZE_PARAM, "50");
    const res = await getAlbumsListServerSide(searchParams);
    totalCount = res.data.totalCount;
    for (const album of res.data.albumsList) {
      paths.push({ id: album.id });
    }
    downloadedCount = 50 * pageNumber;
    pageNumber++;
  }

  return paths;
}

function AlbumWrapper(props: AlbumWithImages): JSX.Element {
  return (
    <Suspense
      fallback={
        <AlbumPage
          isFetching
          id={props?.id}
          fullImages={[]}
          albumName="--"
          snapImages={[]}
          albumSize={0}
          tags={[]}
          changedDate=""
          description=""
        />
      }
      key={props?.id}
    >
      <AlbumPage {...props} />
    </Suspense>
  );
}

export default async function Page({ params }: AlbumPageProps): Promise<JSX.Element> {
  const res = await getAlbumServerSide(params?.id);
  if (res.rc < 300 && res.rc >= 200 && res.data) {
    return <AlbumWrapper {...res.data} />;
  }
  return (
    <AlbumWrapper
      id={params?.id}
      fullImages={[]}
      albumName="404: Not found"
      snapImages={[]}
      albumSize={0}
      tags={[]}
      changedDate=""
      description=""
      // isFetching={isLoading}
    />
  );
}
