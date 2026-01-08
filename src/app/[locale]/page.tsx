import { redirect } from "../navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props): Promise<void> {
  const { locale } = await params;
  redirect({ href: "/main/1", locale });
}
