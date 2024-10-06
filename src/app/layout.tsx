import type { Metadata } from "next";
import "./globals.scss";
import { Header } from "../widgets/Header/ui/Header";

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
      <body>
        <div className="rootContent">
          <Header />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
