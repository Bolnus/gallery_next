import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.scss";
import { Header } from "../../FSD/widgets/Header/ui/Header";
import { ReactQueryProvider } from "../../FSD/app/lib/reactQuery/ReactQueryProvider";
import { SearchProvider } from "../../FSD/app/lib/context/searchContext";
import { BaseProvider } from "../../FSD/app/lib/baseProviders/baseProvider";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "../../FSD/app/lib/context/authContext";
import { routing } from "../request";
import { LocaleProps, ParamsProps } from "../../FSD/shared/lib/common/galleryTypes";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

interface LocaleParam {
  locale: string;
}

export function generateStaticParams(): LocaleParam[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ParamsProps<LocaleProps>): Promise<Metadata> {
  const { locale } = await params;
  const intl = await getTranslations({ locale, namespace: "LayoutMetadata" });

  return {
    title: intl("title"),
    description: intl("description"),
    keywords: intl("keywords"),
    openGraph: {
      title: intl("title"),
      description: intl("description")
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      notranslate: false
    }
  };
}

export default async function RootLayout({ children, params }: Readonly<Props>): Promise<JSX.Element> {
  const { locale } = await params;
  const supportedLocales: readonly string[] = routing.locales;
  if (!supportedLocales.includes(locale.toLowerCase())) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1.0, user-scalable=no "
        />
        <meta name="google-site-verification" content="4NwmTDdTYLuwiPV81bYu44vFv6GjMzgT3ASLwyQ7Sf4" />
        <meta name="yandex-verification" content="f07ce128a9d74a97" />
      </head>
      <body>
        <ReactQueryProvider>
          <SearchProvider>
            <NextIntlClientProvider>
              <BaseProvider>
                <AuthProvider>
                  <div className="rootContent">
                    <Header />
                    <main className="main">{children}</main>
                  </div>
                </AuthProvider>
              </BaseProvider>
            </NextIntlClientProvider>
          </SearchProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
