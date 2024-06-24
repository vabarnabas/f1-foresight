"use client";
import PodiumCard from "@/components/podium/podium-card";
import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { useParams } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function SpecificPrediction() {
  const { id } = useParams();
  const { getToken } = useAuth();

  const { data: predictionData, isValidating: predictionIsValidating } = useSWR(
    `/predictions/podium/${id}`,
    async (url) => {
      const token = await getToken();

      const { data } = await httpClient.get(url, { token: token! });
      return data;
    },
    { ...SWROptions }
  );

  if (predictionIsValidating)
    return (
      <div className="flex justify-center items-center flex-grow">
        Loading...
      </div>
    );

  return (
    <div>
      <div className="flex gap-x-6 justify-between items-center">
        <p className="group text-3xl font-bold flex items-center gap-x-3">
          <Link href="/">
            <FaArrowLeft className="text-2xl hover:-translate-x-1 transition-all ease-in-out duration-150" />
          </Link>
          Prediction
        </p>
        <div className="w-full flex justify-end gap-x-2 items-center">
          <Image
            src={predictionData.user.imageUrl}
            alt={predictionData.user.userName}
            width={22}
            height={22}
            className="rounded-full aspect-square h-max"
            objectFit="cover"
          />
          <p className="">{predictionData.user.userName}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 mt-8">
        {predictionData ? (
          <div className="flex flex-col">
            <PodiumCard
              nonClickable
              id={id as string}
              customData={predictionData}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
