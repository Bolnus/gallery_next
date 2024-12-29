import { AlbumPage } from "../../../FSD/pages/album/ui/AlbumPage";
import { getAlbum, getAlbumQuery } from "../../../FSD/shared/api/album/albumApi";
import { AlbumWithImages } from "../../../FSD/shared/api/album/types";
import { PAGE_PARAM, SIZE_PARAM } from "../../../FSD/pages/albumsSearch/consts/consts";
import { getAlbumsList } from "../../../FSD/shared/api/albumsList/albumsListApi";
import { Suspense } from "react";
import { useQuery } from "react-query";

interface AlbumParam {
  id: string;
}

interface PageProps {
  params: AlbumParam;
}

export async function generateStaticParams(): Promise<AlbumParam[]> {
  let downloadedCount = 0;
  let totalCount = 1;
  let pageNumber = 1;
  const paths: AlbumParam[] = [];
  while (downloadedCount < totalCount) {
    const searchParams = new URLSearchParams();
    searchParams.set(PAGE_PARAM, String(pageNumber));
    searchParams.set(SIZE_PARAM, "50");
    const res = await getAlbumsList(searchParams);
    totalCount = res.data.totalCount;
    for (const album of res.data.albumsList) {
      paths.push({ id: album.id });
    }
    downloadedCount = 50 * pageNumber;
    pageNumber++;
  }

  return paths;
}

function AlbumWrapper(props: AlbumWithImages) {
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
        />
      }
      key={props?.id}
    >
      <AlbumPage {...props} />
    </Suspense>
  );
}

export default async function Page({ params }: PageProps) {
  const res = await getAlbum(params?.id);
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
      // isFetching={isLoading}
    />
  );
}
