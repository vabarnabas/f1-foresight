"use client";
import Podium from "@/components/podium/podium";
import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { Prediction } from "@/schemas/prediction.types";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import useSWR from "swr";

export default function Predictions() {
  const { getToken } = useAuth();
  const { data: predictions, isValidating: predictionsIsValidating } = useSWR<
    Prediction[]
  >(
    "/predictions/me",
    async (url) => {
      const token = await getToken();
      const { data } = await httpClient.get(url, { token: token! });
      return data;
    },
    { ...SWROptions }
  );

  if (predictionsIsValidating) return <div>Loading...</div>;

  return (
    <div className="">
      <p className="text-3xl font-bold">My Predictions</p>
      <div className="flex flex-col gap-y-4 mt-8">
        {predictions
          ? predictions.map((prediction) => (
              <Podium
                key={prediction.id}
                raceId={prediction.raceId}
                userId={prediction.userId}
              />
            ))
          : null}
      </div>
    </div>
  );
}
