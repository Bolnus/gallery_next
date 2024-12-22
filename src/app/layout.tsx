import type { Metadata } from "next";
import "./globals.scss";
import { Header } from "../FSD/widgets/Header/ui/Header";
import { ReactQueryProvider } from "../FSD/app/lib/reactQuery/ReactQueryProvider";
import { SearchProvider } from "../FSD/app/lib/context/searchContext";

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
        <ReactQueryProvider>
          <SearchProvider>
            <div className="rootContent">
              <Header />
              <main className="main">{children}</main>
            </div>
          </SearchProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

global?.window && window.addEventListener("resize", function () {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});
