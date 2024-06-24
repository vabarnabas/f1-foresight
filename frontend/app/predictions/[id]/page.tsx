"use client";
import Marked from "marked-react";
import Callout from "@/components/callout/callout";
import PodiumCard from "@/components/podium/podium-card";
import { httpClient } from "@/lib/http-client";
import { SWROptions } from "@/lib/swr-const";
import { useParams } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { RiSparkling2Fill } from "react-icons/ri";
import useSWRMutation from "swr/mutation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { FaArrowLeft, FaShareAlt } from "react-icons/fa";
import Link from "next/link";
import { IoIosShareAlt } from "react-icons/io";

export default function SpecificPrediction() {
  const { id } = useParams();
  const { getToken } = useAuth();

  const { data: predictionData, isValidating: predictionIsValidating } = useSWR(
    `/predictions/${id}`,
    async (url) => {
      const token = await getToken();

      const { data } = await httpClient.get(url, { token: token! });
      return data;
    },
    { ...SWROptions }
  );

  const { trigger, data } = useSWRMutation(
    `/predictions/analyze/${id}`,
    async (url: string) => {
      const token = await getToken();

      const { data } = await httpClient.get(url, {
        token: token!,
      });
      return data;
    }
  );

  if (predictionIsValidating)
    return (
      <div className="flex justify-center items-center flex-grow">
        Loading...
      </div>
    );

  return (
    <div>
      <p className="text-3xl font-bold flex items-center gap-x-3">
        <Link href="/predictions">
          <FaArrowLeft className="text-2xl hover:-translate-x-1 transition-all ease-in-out duration-150" />
        </Link>
        My Prediction
        <Link
          href={`/predictions/share/${id}`}
          className="ml-auto font-normal px-4 py-2.5 rounded-md text-xs bg-white hover:bg-slate-200 text-f1-black flex items-center gap-x-1"
        >
          <IoIosShareAlt className="text-lg" />
          SHARE
        </Link>
      </p>
      <div className="flex flex-col gap-y-2 mt-8">
        {predictionData ? (
          <div className="flex flex-col">
            <PodiumCard
              nonClickable
              id={predictionData.id}
              raceId={predictionData.raceId}
              userId={predictionData.userId}
            />
            <Callout
              className="mt-2"
              color="bg-f1-black-lighter"
              title="Analyze Prediction"
              subTitle="Use our AI to analyze your prediction"
              icon={<RiSparkling2Fill className="text-4xl" />}
              button={
                <button
                  onClick={() => {
                    toast.promise(trigger(), {
                      loading: "Analyzing...",
                      success: "Analysis Complete",
                      error: (error) => {
                        if (error.message.includes("403")) {
                          return "Quota Limit Reached";
                        }
                        return "Something Went Wrong";
                      },
                    });
                  }}
                  className="px-4 py-2.5 rounded-md text-xs bg-white hover:bg-slate-200 text-f1-black flex items-center gap-x-1"
                >
                  <RiSparkling2Fill className="text-lg" />
                  ANALYZE
                </button>
              }
            />
          </div>
        ) : null}
        {data ? (
          <div className="mt-8">
            <p className="text-3xl font-bold">Analysis</p>
            <p className="mt-4">{data.analysis}</p>
            <p className="mt-8 text-3xl font-bold">Good Arguments</p>
            <p className="mt-4">{data.goodArguments}</p>
            <p className="mt-8 text-3xl font-bold">On The Other Hand</p>
            <p className="mt-4">{data.onTheOtherHand}</p>
            <p className="mt-8 text-3xl font-bold">Conclusion</p>
            <p className="mt-4">{data.conclusion}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
