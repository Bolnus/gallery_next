import { AlbumPage } from "../../../FSD/pages/album/ui/AlbumPage";
import { PAGE_PARAM, SIZE_PARAM, SORT_PARAM } from "../../../FSD/pages/albumsSearch/consts/consts";
import { Suspense } from "react";
import { AlbumPageProps, AlbumParam, AlbumsListSorting } from "../../../FSD/shared/lib/common/galleryTypes";
import { getAlbumServerSide, getAlbumsListServerSide } from "../../../FSD/shared/api/album/albumApiServer";
import { Metadata } from "next";

export async function generateStaticParams(): Promise<AlbumParam[]> {
  let downloadedCount = 0;
  let totalCount = 1;
  let pageNumber = 1;
  const paths: AlbumParam[] = [];
  while (downloadedCount < totalCount) {
    const searchParams = new URLSearchParams();
    searchParams.set(PAGE_PARAM, String(pageNumber));
    searchParams.set(SIZE_PARAM, "50");
    searchParams.set(SORT_PARAM, AlbumsListSorting.changedDate);
    const res = await getAlbumsListServerSide(searchParams);
    totalCount = res.data.totalCount;
    for (const album of res.data.albumsList) {
      paths.push({ id: album.id });
    }
    downloadedCount = 50 * pageNumber;
    pageNumber++;
    if (pageNumber === 3) {
      break;
    }
  }

  return paths;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getAlbumServerSide(id);

  return {
    title: data?.albumName,
    description: data?.description,
    keywords: data?.tags?.map((tag) => tag.tagName),
    openGraph: {
      title: data?.albumName,
      description: data?.description,
      images: data?.snapImages?.[0]?.url ? [data?.snapImages?.[0]?.url] : undefined
    },
    robots: {
      index: true, // Allow search engines to index
      follow: true, // Allow following links on the page
      nocache: false, // Prevent caching (rarely used)
      noarchive: false, // Prevent showing cached version in search
      nosnippet: false, // Prevent showing snippets in search
      noimageindex: false, // Prevent indexing images on the page
      notranslate: false // Prevent Google from offering translation
    }
  };
}

async function AlbumWrapper({ id }: Readonly<AlbumParam>): Promise<JSX.Element> {
  const res = await getAlbumServerSide(id);
  if (res.rc < 300 && res.rc >= 200 && res.data) {
    return <AlbumPage {...res.data} />;
  }
  return (
    <AlbumPage
      id={id}
      fullImages={[]}
      albumName="404: Not found"
      snapImages={[]}
      albumSize={0}
      tags={[]}
      changedDate=""
      description=""
    />
  );
}

export default async function Page({ params }: Readonly<AlbumPageProps>): Promise<JSX.Element> {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <AlbumPage
          isFetching
          id={id}
          fullImages={[]}
          albumName="--"
          snapImages={[]}
          albumSize={0}
          tags={[]}
          changedDate=""
          description=""
        />
      }
      key={id}
    >
      <AlbumWrapper id={id} />
    </Suspense>
  );
}
