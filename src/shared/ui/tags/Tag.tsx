"use client";
import React from "react";
import classes from "./Tag.module.scss";

interface Props {
  id: string;
  tagName: string;
  onClick?: (id: string) => void;
  className?: string;
}

export function Tag({ id, tagName, onClick, className }: Props) {
  return (
    <div className={`${classes.tagBlock} ${className}`} onClick={onClick?.bind(null, id)}>
      <span className={classes.tagBlock__label}>{tagName}</span>
    </div>
  );
}
