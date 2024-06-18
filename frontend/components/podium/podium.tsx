import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { Driver } from "@/types/driver.types";
import { Race } from "@/types/race.types";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import useSWR from "swr";

interface Props {
  raceId: string;
  userId: string;
}

export default function Podium({ raceId, userId }: Props) {
  const { getToken } = useAuth();
  const { data, isValidating } = useSWR<{ podium: Driver[]; race: Race }>(
    `/predictions/podium/race/${raceId}/user/${userId}`,
    async (url) => {
      const token = await getToken();
      const { data } = await httpClient.get(url, { token: token! });
      return data;
    },
    { ...SWROptions }
  );

  if (!data)
    return (
      <div className="bg-f1-black-lighter pt-6 px-6 rounded-lg h-80 animate-pulse"></div>
    );

  return (
    <div className="bg-f1-black-lighter pt-6 px-6 rounded-lg">
      {data.race ? (
        <div className="flex gap-x-6 justify-between items-center">
          <div className="flex gap-x-6 items-center rounded-lg cursor-pointer">
            <Image
              src={`/flags/${data.race.countryCode.toLowerCase()}.svg`}
              width={72}
              height={48}
              alt={data.race.countryCode}
              className="rounded-md h-max hidden md:block "
            />
            <div className="">
              <p className="font-bold text-lg">{data.race.name}</p>
              <p className="">{`${data.race.country} - ${data.race.city}`}</p>
            </div>
          </div>
        </div>
      ) : null}
      <div className="relative pt-24 flex justify-center items-end gap-x-2">
        <div
          style={{ background: data.podium[1]?.team.teamColor }}
          className="cursor-pointer relative h-40 md:h-52 w-40 text-center bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
        >
          2ND
          {data.podium[1] ? (
            <div className="absolute -top-10 w-full text-center inset-x-0">
              {data.podium[1].fullName.split(" ")[1].substring(0, 3)}
            </div>
          ) : null}
        </div>
        <div
          style={{ background: data.podium[0]?.team.teamColor }}
          className="cursor-pointer relative h-48 md:h-60 w-40 text-center bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
        >
          1ST
          {data.podium[0] ? (
            <div className="absolute -top-10 w-full text-center inset-x-0">
              {data.podium[0].fullName.split(" ")[1].substring(0, 3)}
            </div>
          ) : null}
        </div>
        <div
          style={{ background: data.podium[2]?.team.teamColor }}
          className="cursor-pointer relative h-32 text-center md:h-44 w-40 bg-f1-black-lighter rounded-t-lg p-4 text-2xl font-bold"
        >
          3RD
          {data.podium[2] ? (
            <div className="absolute -top-10 w-full text-center inset-x-0">
              {data.podium[2].fullName.split(" ")[1].substring(0, 3)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
