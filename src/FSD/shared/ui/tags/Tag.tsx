"use client";
import React from "react";
import classes from "./Tag.module.scss";
import { DefinedTag } from "../../lib/common/galleryTypes";
import { Link } from "../../../../app/navigation";

interface Props extends DefinedTag {
  onClick?: (id: string) => void;
  className?: string;
  href?: string;
}

export function Tag({ id, tagName, onClick, className, href }: Readonly<Props>): JSX.Element {
  const tagContent = (
    <div className={`${classes.tagBlock} ${className}`} onClick={() => onClick?.(id)}>
      <span className={classes.tagBlock__label}>{tagName}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={`/search?tags=${tagName}`} className={classes.navLink}>
        {tagContent}
      </Link>
    );
  }
  return <div className={classes.navLink}>{tagContent}</div>;
}
