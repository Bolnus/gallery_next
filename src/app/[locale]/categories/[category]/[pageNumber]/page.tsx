import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_PARAM,
  SIZE_PARAM,
  TAGS_PARAM
} from "../../../../../FSD/pages/albumsSearch/consts/consts";
import { getAlbumsListServerSide } from "../../../../../FSD/shared/api/album/albumApiServer";
import { CategoryAlbumsParam, ParamsProps } from "../../../../../FSD/shared/lib/common/galleryTypes";
import { AlbumsListLoading } from "../../../../../FSD/pages/albumsListLoading/ui/AlbumsListLoading";
import { AlbumsListPage } from "../../../../../FSD/pages/albumsList/ui/AlbumsListPage";
import { routing } from "../../../../request";
import { getCategoriesServerSide } from "../../../../../FSD/shared/api/tags/tagsApiServerside";
import { Metadata } from "next";

export async function generateStaticParams(): Promise<CategoryAlbumsParam[]> {
  const paths: CategoryAlbumsParam[] = [];
  for (const locale of routing.locales) {
    const tags = await getCategoriesServerSide(locale);
    if (!tags.data) {
      return paths;
    }
    for (const tag of tags.data) {
      for (let i = 1; i <= Math.ceil(tag.albumsCount / 30); i++) {
        paths.push({ pageNumber: String(i), locale, category: tag.tagName });
      }
    }
  }
  return paths;
}

export async function generateMetadata({ params }: ParamsProps<CategoryAlbumsParam>): Promise<Metadata> {
  const { locale, category, pageNumber } = await params;
  const intl = await getTranslations({ locale, namespace: "LayoutMetadata" });

  const title = `${category} | ${intl("title")}`;
  const description = `${category} | ${intl("description")}`;
  return {
    title,
    description,
    keywords: `${category},${pageNumber},${intl("keywords")}`,
    openGraph: {
      title,
      description
    }
  };
}

async function CategoryAlbums({ pageNumber, locale, category }: Readonly<CategoryAlbumsParam>): Promise<JSX.Element> {
  const decodedCategory = decodeURIComponent(category);
  const searchParams = new URLSearchParams();
  searchParams.set(PAGE_PARAM, pageNumber);
  searchParams.set(SIZE_PARAM, String(DEFAULT_PAGE_SIZE));
  searchParams.set(TAGS_PARAM, decodedCategory);
  const res = await getAlbumsListServerSide(searchParams, locale);
  const { totalCount, albumsList } = res.data;

  if (Number(pageNumber) > 1 && !albumsList.length) {
    notFound();
  }

  return (
    <AlbumsListPage
      albums={albumsList}
      totalCount={totalCount}
      pageNumber={Number(pageNumber)}
      pageSize={DEFAULT_PAGE_SIZE}
      category={decodedCategory}
    />
  );
}

export default async function Page({ params }: Readonly<ParamsProps<CategoryAlbumsParam>>): Promise<JSX.Element> {
  const { pageNumber, locale, category } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<AlbumsListLoading />}>
      <CategoryAlbums pageNumber={pageNumber} locale={locale} category={category} />
    </Suspense>
  );
}
