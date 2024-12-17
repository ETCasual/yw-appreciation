/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import imageToBase64 from "image-to-base64";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const url = req.query.url as string;

    try {
      const base64Image = await imageToBase64(url);
      res.setHeader("Content-Type", `image/${url.split(".")[1]}`);
      res.setHeader(
        "Content-Length",
        Buffer.from(base64Image, "base64").length,
      );

      res.status(200).send(Buffer.from(base64Image, "base64"));
    } catch (err: unknown) {
      throw new Error(err as string);
    }
  }
}
