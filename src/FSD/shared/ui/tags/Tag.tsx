"use client";
import React from "react";
import classes from "./Tag.module.scss";
import { DefinedTag } from "../../lib/common/galleryTypes";

interface Props extends DefinedTag {
  onClick?: (id: string) => void;
  className?: string;
}

export function mapTags(tag: DefinedTag): JSX.Element {
  return <Tag {...tag} key={tag.id} />;
}

export function Tag({ id, tagName, onClick, className }: Props) {
  return (
    <div className={`${classes.tagBlock} ${className}`} onClick={() => onClick?.(id)}>
      <span className={classes.tagBlock__label}>{tagName}</span>
    </div>
  );
}
