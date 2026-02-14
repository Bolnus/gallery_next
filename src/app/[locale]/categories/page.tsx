import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CategoriesPage } from "../../../FSD/pages/categories/CategoriesPage";
import { LocaleProps, ParamsProps } from "../../../FSD/shared/lib/common/galleryTypes";
import { getCategoriesServerSide } from "../../../FSD/shared/api/tags/tagsApiServerside";
import { notFound } from "next/navigation";

async function CategoriesWrapper({ locale }: Readonly<LocaleProps>): Promise<JSX.Element> {
  const { rc, data } = await getCategoriesServerSide(locale);
  if (!data || !data.length || rc > 300 || rc < 200) {
    notFound();
  }
  return <CategoriesPage categories={data} />;
}

export default async function Page({ params }: Readonly<ParamsProps<LocaleProps>>): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<CategoriesPage isFetching />}>
      <CategoriesWrapper locale={locale} />
    </Suspense>
  );
}
