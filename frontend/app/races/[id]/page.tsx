"use client";
import Podium from "@/components/podium/podium";
import { errorHandler } from "@/lib/error-handler";
import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { CreatePredictionDto } from "@/schemas/create-prediction.schema";
import { Driver } from "@/types/driver.types";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/nextjs";
import html2canvas from "html2canvas";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdSave } from "react-icons/io";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export default function RaceView() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [podium, setPodium] = useState<(Driver | null)[]>([]);

  const handlePlaceChange = (index: number, value: Driver | null) => {
    setPodium((prevPodium) => {
      const updatedPodium = { ...prevPodium };
      updatedPodium[index] !== value &&
        Object.keys(updatedPodium).forEach((place) => {
          if (updatedPodium[index] === value) {
            updatedPodium[index] = null;
          }
        });

      updatedPodium[index] === value
        ? (updatedPodium[index] = null)
        : (updatedPodium[index] = value);
      return updatedPodium;
    });
  };

  const { id } = useParams();
  const { data: driverData, isValidating: driverIsValidating } = useSWR(
    "/drivers",
    async (url) => {
      const { data } = await httpClient.get(url);
      return data as Driver[];
    },
    { ...SWROptions }
  );

  const { data: raceData, isValidating: raceIsValidating } = useSWR(
    `/races/${id}`,
    async (url) => {
      const { data } = await httpClient.get(url);
      return data;
    },
    { ...SWROptions }
  );

  const { data: predictionData, isValidating: predictionIsValidating } = useSWR(
    `predictions/podium/race/${id}/me`,
    async (url) => {
      const token = await getToken();
      const { data } = await httpClient.get(url, { token: token! });
      return data.podium;
    },
    { ...SWROptions }
  );

  console.log(predictionData);

  const { trigger, isMutating } = useSWRMutation(
    "/predictions",
    async (url: string) => {
      const token = await getToken();

      await httpClient.post(url, {
        body: {
          name: user!.username!,
          userId: user!.id,
          raceId: id as string,
          result: Object.values(podium).map((driver) => driver!.id),
        } satisfies CreatePredictionDto,
        token: token!,
      });
    }
  );

  useEffect(() => {
    if (!predictionIsValidating && predictionData) {
      setPodium(predictionData);
    }
  }, [predictionData, predictionIsValidating]);

  if (driverIsValidating || raceIsValidating || predictionIsValidating)
    return (
      <div className="flex flex-grow justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div>
      <div id="capture" ref={componentRef}>
        {raceData ? (
          <div className="flex gap-x-6 justify-between items-center">
            <div className="flex gap-x-6 items-center rounded-lg cursor-pointer">
              <Image
                src={`/flags/${raceData.countryCode.toLowerCase()}.svg`}
                width={72}
                height={48}
                alt={raceData.countryCode}
                className="rounded-md h-max hidden md:block "
              />
              <div className="">
                <p className="font-bold text-lg">{raceData.name}</p>
                <p className="">{`${raceData.country} - ${raceData.city}`}</p>
              </div>
            </div>
            <SignedIn>
              <button
                disabled={
                  isMutating ||
                  Object.values(podium).some((driver) => driver === null)
                }
                onClick={async () =>
                  toast.promise(trigger(), {
                    loading: "Saving...",
                    success: "Saved",
                    error: "Error",
                  })
                }
                className="h-max px-4 py-2.5 rounded-md text-xs disabled:cursor-not-allowed bg-white enabled:hover:bg-slate-200 disabled:opacity-80 text-f1-black flex items-center gap-x-1"
              >
                <IoMdSave className="text-lg" />
                SAVE
              </button>
            </SignedIn>
            <SignedOut>
              <p className="text-xs opacity-80">
                Sign In to Save Your Prediction
              </p>
            </SignedOut>
          </div>
        ) : null}
        <div className="relative pt-24 flex justify-center items-end gap-x-2">
          <Podium podium={podium} isEditable handleChange={handlePlaceChange} />
        </div>
        <div className="flex justify-center">
          <p className="opacity-60 text-xs mt-8 text-center md:w-1/2">
            Select a placement next to the desired driver to position them on
            the podium. To remove a driver from the podium, either click on the
            same placement again or directly click on the podium.
          </p>
        </div>
      </div>
      <div className="mt-8">
        {driverData ? (
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {driverData.map((driver) => (
              <div key={driver.id} className="flex gap-x-3 items-center">
                <div
                  style={{ background: driver.team.teamColor }}
                  className="w-1.5 h-10 py-2"
                />

                <div className="">
                  <p className="text-lg font-bold flex gap-x-2">
                    {driver.fullName}
                  </p>
                  <p className="text-sm opacity-80">{driver.team.name}</p>
                </div>
                <div className="ml-auto flex items-center gap-x-4 text-xl select-none">
                  <button
                    onClick={() => handlePlaceChange(0, driver)}
                    className="text-trophy-gold cursor-pointer"
                  >
                    P1
                  </button>
                  <button
                    onClick={() => handlePlaceChange(1, driver)}
                    className="text-trophy-silver cursor-pointer"
                  >
                    P2
                  </button>
                  <button
                    onClick={() => handlePlaceChange(2, driver)}
                    className="text-trophy-bronze cursor-pointer"
                  >
                    P3
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
