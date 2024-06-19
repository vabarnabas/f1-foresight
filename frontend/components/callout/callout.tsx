import clsx from "clsx";
import React from "react";

interface Props {
  icon: React.ReactNode;
  color: "bg-f1-red" | "bg-f1-black" | "bg-f1-black-lighter";
  title: string;
  subTitle: string;
  button?: React.ReactNode;
  className?: string;
}

export default function Callout({
  icon,
  color,
  title,
  subTitle,
  button,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "rounded-lg py-4 px-4 flex md:items-center justify-between flex-col md:flex-row gap-y-6",
        color,
        className
      )}
    >
      <div className="flex gap-x-4 items-center">
        {icon}
        <div className="">
          <p className="font-bold">{title}</p>
          <p className="text-sm mt-0.5">{subTitle}</p>
        </div>
      </div>
      {button}
    </div>
  );
}
