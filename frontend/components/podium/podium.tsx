import { Driver } from "@/types/driver.types";
import React from "react";

interface Props {
  podium: (Driver | null)[];
  handleChange?: (index: number, value: Driver | null) => void;
  isEditable?: boolean;
}

export default function Podium({ podium, isEditable, handleChange }: Props) {
  const safeHandleChange = (index: number, value: Driver | null) =>
    isEditable && handleChange && handleChange(index, value);

  console.log(podium);

  return (
    <div className="relative pt-24 flex justify-center items-end gap-x-2">
      <div
        onClick={() => safeHandleChange(1, null)}
        style={{ background: podium[1]?.team.teamColor }}
        className="cursor-pointer relative h-[8.5rem] md:h-[12.5rem] w-full md:w-40 text-center bg-f1-black-lighter rounded-t-lg p-4 text-xl md:text-2xl font-bold"
      >
        2ND
        {podium[1] ? (
          <div className="absolute -top-10 w-full text-center inset-x-0">
            {podium[1].shortName}
          </div>
        ) : null}
      </div>
      <div
        onClick={() => safeHandleChange(0, null)}
        style={{ background: podium[0]?.team.teamColor }}
        className="cursor-pointer relative h-40 md:h-60 w-full md:w-40 text-center bg-f1-black-lighter rounded-t-lg p-4 text-xl md:text-2xl font-bold"
      >
        1ST
        {podium[0] ? (
          <div className="absolute -top-10 w-full text-center inset-x-0">
            {podium[0].shortName}
          </div>
        ) : null}
      </div>
      <div
        onClick={() => safeHandleChange(2, null)}
        style={{ background: podium[2]?.team.teamColor }}
        className="cursor-pointer relative h-28 text-center md:h-44 w-full md:w-40 bg-f1-black-lighter rounded-t-lg p-4 text-xl md:text-2xl font-bold"
      >
        3RD
        {podium[2] ? (
          <div className="absolute -top-10 w-full text-center inset-x-0">
            {podium[2].shortName}
          </div>
        ) : null}
      </div>
    </div>
  );
}
