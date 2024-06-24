import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { Driver } from "@/types/driver.types";
import { Race } from "@/types/race.types";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import Podium from "./podium";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BaseProps {
  id: string;
  noBackground?: boolean;
  nonClickable?: boolean;
}

interface WithRaceAndUser extends BaseProps {
  raceId: string;
  userId: string;
  customData?: never;
}

interface WithCustomData extends BaseProps {
  raceId?: never;
  userId?: never;
  customData: { podium: Driver[]; race: Race };
}

type Props = WithRaceAndUser | WithCustomData;

export default function PodiumCard({
  id,
  raceId,
  userId,
  customData,
  noBackground,
  nonClickable,
}: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { data: podiumData, isValidating: podiumIsValidating } = useSWR<{
    podium: Driver[];
    race: Race;
  }>(
    `/predictions/podium/race/${raceId}/user/${userId}`,
    async (url) => {
      const token = await getToken();
      const { data } = await httpClient.get(url, { token: token! });
      return data;
    },
    { ...SWROptions, isPaused: () => customData !== undefined }
  );

  const data = customData || podiumData;

  if (podiumIsValidating && !customData) {
    return (
      <div className="bg-f1-black-lighter pt-6 px-6 rounded-lg h-80 animate-pulse"></div>
    );
  }

  return (
    <Link
      aria-disabled={nonClickable}
      tabIndex={nonClickable ? -1 : undefined}
      href={`/predictions/${id}`}
      className={clsx(
        !noBackground && "bg-f1-black-lighter pt-6 px-6 rounded-lg",
        nonClickable && "pointer-events-none"
      )}
    >
      {data ? (
        <div className="flex gap-x-6 justify-between items-center">
          <div
            onClick={() => router.push(`/races/${data.race.id}`)}
            className="flex gap-x-6 items-center rounded-lg cursor-pointer"
          >
            <Image
              src={`/flags/${data.race.countryCode.toLowerCase()}.svg`}
              width={72}
              height={48}
              alt={data.race.countryCode}
              className="rounded-md h-max hidden md:block "
            />
            <div className="">
              <p className="font-bold text-lg">{data.race.name}</p>
              <p className="">{`${(customData || podiumData)!.race.country} - ${
                data.race.city
              }`}</p>
            </div>
          </div>
        </div>
      ) : null}
      {data && data.podium ? <Podium podium={data.podium} /> : null}
    </Link>
  );
}
