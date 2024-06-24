import { httpClient } from "@/lib/http-client";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "F1 Foresight";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const { data } = await httpClient.get(`/predictions/podium/${params.id}`);

  const { podium, race } = data;

  const f1Font = fetch(new URL("/public/font/f1.ttf", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div tw="relative flex flex-col h-full w-full justify-end items-center bg-[#16161B] text-white py-2 px-8">
        <h1 tw="absolute text-lg -bottom-1 right-8">
          F1® Foresight <span tw="text-[#e92300]">24</span>
        </h1>
        <div tw="flex">
          <h2 tw="flex flex-col mb-64 text-left">
            <span tw="text-3xl">{race.name}</span>
            <span tw="mt-2 text-lg">{`${race.country} / ${race.city}`}</span>
          </h2>
        </div>
        {podium ? (
          <div tw="flex items-end">
            <div
              style={{ backgroundColor: podium[1].team.teamColor }}
              tw="relative h-52 w-48 bg-white flex mr-2 rounded-t-lg text-3xl p-4 justify-center"
            >
              2ND
              <p tw="absolute -top-20">
                {podium[1].fullName.split(" ")[1].substring(0, 3)}
              </p>
            </div>
            <div
              style={{ backgroundColor: podium[0].team.teamColor }}
              tw="relative h-64 w-48 bg-white flex mr-2 rounded-t-lg text-3xl p-4 justify-center"
            >
              1ST
              <p tw="absolute -top-20">
                {podium[0].fullName.split(" ")[1].substring(0, 3)}
              </p>
            </div>
            <div
              style={{ backgroundColor: podium[2].team.teamColor }}
              tw="relative h-48 w-48 bg-white flex rounded-t-lg text-3xl p-4 justify-center"
            >
              3RD
              <p tw="absolute -top-20">
                {podium[2].fullName.split(" ")[1].substring(0, 3)}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "F1 Font",
          data: await f1Font,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
