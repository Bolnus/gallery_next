import type { Metadata } from "next";
import "./globals.scss";
import { Header } from "../FSD/widgets/Header/ui/Header";
import { ReactQueryProvider } from "../FSD/app/lib/reactQuery/ReactQueryProvider";
import { SearchProvider } from "../FSD/app/lib/context/searchContext";
import { BaseProvider } from "../FSD/app/lib/baseProviders/baseProvider";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: "Tasty Duo",
  description: "Recipes by a couple of russian chefs"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1.0, user-scalable=no "
        />
      </head>
      <body>
        <ReactQueryProvider>
          <SearchProvider>
            <BaseProvider>
              <NextIntlClientProvider>
                <div className="rootContent">
                  <Header />
                  <main className="main">{children}</main>
                </div>
              </NextIntlClientProvider>
            </BaseProvider>
          </SearchProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
