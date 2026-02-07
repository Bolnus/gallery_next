import { AlbumPage } from "../../../../FSD/pages/album/ui/AlbumPage";
import { PAGE_PARAM, SIZE_PARAM, SORT_PARAM } from "../../../../FSD/pages/albumsSearch/consts/consts";
import { Suspense } from "react";
import { AlbumPageProps, AlbumParam, AlbumsListSorting } from "../../../../FSD/shared/lib/common/galleryTypes";
import { getAlbumServerSide, getAlbumsListServerSide } from "../../../../FSD/shared/api/album/albumApiServer";
import { Metadata } from "next";
import { routing } from "../../../request";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateStaticParams(): Promise<AlbumParam[]> {
  const paths: AlbumParam[] = [];
  for (const locale of routing.locales) {
    let downloadedCount = 0;
    let totalCount = 1;
    let pageNumber = 1;
    while (downloadedCount < totalCount) {
      const searchParams = new URLSearchParams();
      searchParams.set(PAGE_PARAM, String(pageNumber));
      searchParams.set(SIZE_PARAM, "50");
      searchParams.set(SORT_PARAM, AlbumsListSorting.changedDate);
      const res = await getAlbumsListServerSide(searchParams, locale);
      totalCount = res.data.totalCount;
      for (const album of res.data.albumsList) {
        paths.push({ id: album.id, locale });
      }
      downloadedCount = 50 * pageNumber;
      pageNumber++;
      if (pageNumber === 3) {
        break;
      }
    }
  }

  return paths;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const { data } = await getAlbumServerSide(locale, id);
  const intl = await getTranslations({ locale, namespace: "LayoutMetadata" });

  const title = `${data?.albumName} | ${intl("title")}`;
  const description = `${data?.description} | ${intl("description")}`;
  return {
    title,
    description,
    keywords: data?.tags?.map((tag) => tag.tagName),
    openGraph: {
      title,
      description,
      images: data?.snapImages?.[0]?.url ? [data?.snapImages?.[0]?.url] : undefined
    }
  };
}

async function AlbumWrapper({ id, locale }: Readonly<AlbumParam>): Promise<JSX.Element> {
  const res = await getAlbumServerSide(locale, id);
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
  const { id, locale } = await params;
  setRequestLocale(locale);

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
      <AlbumWrapper id={id} locale={locale} />
    </Suspense>
  );
}
