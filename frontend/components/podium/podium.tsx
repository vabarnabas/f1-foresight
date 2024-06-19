import { Driver } from "@/types/driver.types";
import React from "react";

interface Props {
  podium: Driver[];
}

export default function Podium({ podium }: Props) {
  return (
    <div className="relative pt-24 flex justify-center items-end gap-x-2">
      <div
        style={{ background: podium[1]?.team.teamColor }}
        className="cursor-pointer relative h-40 md:h-52 w-40 text-center bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
      >
        2ND
        {podium[1] ? (
          <div className="absolute -top-10 w-full text-center inset-x-0">
            {podium[1].fullName.split(" ")[1].substring(0, 3)}
          </div>
        ) : null}
      </div>
      <div
        style={{ background: podium[0]?.team.teamColor }}
        className="cursor-pointer relative h-48 md:h-60 w-40 text-center bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
      >
        1ST
        {podium[0] ? (
          <div className="absolute -top-10 w-full text-center inset-x-0">
            {podium[0].fullName.split(" ")[1].substring(0, 3)}
          </div>
        ) : null}
      </div>
      <div
        style={{ background: podium[2]?.team.teamColor }}
        className="cursor-pointer relative h-32 text-center md:h-44 w-40 bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
      >
        3RD
        {podium[2] ? (
          <div className="absolute -top-10 w-full text-center inset-x-0">
            {podium[2].fullName.split(" ")[1].substring(0, 3)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
