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
  const { getToken } = auth();
  const token = await getToken();

  const { data: prediction } = await httpClient.get(
    `/predictions/${params.id}`,
    { token: token! }
  );

  console.log(prediction);

  // const { data: podium } = await httpClient.get(
  //   `/predictions/podium/race/${prediction.raceId}/user/${prediction.userId}`,
  //   { token: token! }
  // );

  const f1Font = fetch(
    new URL("/public/font/f1_black.woff2", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {JSON.stringify(prediction)}
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
