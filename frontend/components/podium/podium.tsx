import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { Driver } from "@/types/driver.types";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import useSWR from "swr";

interface Props {
  raceId: string;
  userId: string;
}

export default function Podium({ raceId, userId }: Props) {
  const { getToken } = useAuth();
  const { data: podium, isValidating } = useSWR<Driver[]>(
    `/predictions/podium/race/${raceId}/user/${userId}`,
    async (url) => {
      const token = await getToken();
      const { data } = await httpClient.get(url, { token: token! });
      return data;
    },
    { ...SWROptions }
  );

  if (!podium) return null;

  return (
    <div className="relative pt-24 flex justify-center items-end gap-x-2">
      <div
        style={{ background: podium[1]?.team.teamColor }}
        className="cursor-pointer relative h-52 w-40 bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
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
        className="cursor-pointer relative h-60 w-40 bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
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
        className="cursor-pointer relative h-44 w-40 bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
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
