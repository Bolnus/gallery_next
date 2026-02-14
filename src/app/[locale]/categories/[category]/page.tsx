import { redirect } from "../../../navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string; category: string }>;
}

export default async function Category({ params }: Props): Promise<void> {
  const { locale, category } = await params;
  redirect({ href: category ? `/categories/${category}/1` : "/", locale });
}
