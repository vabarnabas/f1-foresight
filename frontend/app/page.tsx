"use client";
import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { Race } from "@/types/race.types";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FaUserShield } from "react-icons/fa";
import { RiSparkling2Fill } from "react-icons/ri";
import useSWR from "swr";

export default function Home() {
  const { data, isValidating } = useSWR(
    "/races/season/2024",
    async (url) => {
      const { data } = await httpClient.get(url);
      return data as Race[];
    },
    { ...SWROptions }
  );

  if (isValidating)
    return <div className="flex  justify-center items-center">Loading...</div>;

  if (!isValidating && !data) return <div className="">No data</div>;

  return (
    <div className="">
      <p className="text-3xl font-bold">Select Race</p>
      <div className="grid md:grid-cols-2 gap-y-6 gap-x-4 mt-6">
        {data
          ? data.map((race: Race) => (
              <Link key={race.id} href={`/races/${race.id}`}>
                <button className="text-left flex gap-x-6 items-center hover:bg-slate-100/10 px-4 py-2 rounded-lg cursor-pointer">
                  <Image
                    src={`/flags/${race.countryCode.toLowerCase()}.svg`}
                    width={72}
                    height={48}
                    alt={race.countryCode}
                    className="rounded-md h-max"
                    objectFit="fill"
                    priority
                  />
                  <div className="">
                    <p className="font-bold text-lg">{race.name}</p>
                    <p className="">{`${race.country} - ${race.city}`}</p>
                  </div>
                </button>
              </Link>
            ))
          : null}
      </div>
      <SignedOut>
        <div className="rounded-lg bg-f1-red py-4 px-4 mt-8 flex md:items-center justify-between flex-col md:flex-row gap-y-6">
          <div className="flex gap-x-4">
            <RiSparkling2Fill className="text-5xl" />
            <div className="">
              <p className="font-bold">Sign In to Gain Access to AI Features</p>
              <p className="text-sm mt-0.5">
                Sign In now to use AI data analyis on your predictions
              </p>
            </div>
          </div>
          <SignInButton>
            <button className="px-4 py-2.5 rounded-md text-xs bg-white hover:bg-slate-200 text-f1-black flex items-center gap-x-1">
              <FaUserShield className="text-lg" />
              SIGN IN
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
