import { useTranslations } from "next-intl";
import { Link } from "../navigation";

export default function NotFound(): JSX.Element {
  const intl = useTranslations("NotFound");
  return (
    <div className="notFoundPage">
      <h1 className="notFoundPage__header">{intl("title")}</h1>
      <p className="notFoundPage__text">
        {intl("description")}
        <Link href="/" className="textLink">
          {intl("mainRef")}
        </Link>
      </p>
    </div>
  );
}
