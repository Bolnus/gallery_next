import type { Metadata } from "next";
import "./globals.scss";
import { Header } from "../widgets/Header/ui/Header";
import { SearchNameProvider } from "../shared/lib/hooks/useSearchName";

export const metadata: Metadata = {
  title: "Gallery Next App",
  description: "Gallery"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1.0, user-scalable=no "
        />
      </head>
      <body>
        <SearchNameProvider>
          <div className="rootContent">
            <Header />
            <main className="main">{children}</main>
          </div>
        </SearchNameProvider>
      </body>
    </html>
  );
}
