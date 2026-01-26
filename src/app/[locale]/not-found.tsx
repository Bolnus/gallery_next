import { Link } from "../navigation";

export default function NotFound(): JSX.Element {
  return (
    <div className="notFoundPage">
      <h1 className="notFoundPage__header">404: Not found</h1>
      <p className="notFoundPage__text">
        Back to{" "}
        <Link href="/" className="textLink">
          main
        </Link>
      </p>
    </div>
  );
}
