/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    card?:
      | {
          to: string;
          message: string;
          image: string | null;
        }[]
      | null;
    error?: string;
  }>,
) {
  if (req.method === "GET") {
    const phone = req.query.phone;

    try {
      await db.card
        .findMany({
          where: {
            to: phone as string,
          },
          select: {
            id: true,
            to: true,
            message: true,
            image: true,
            seen: true,
          },
        })
        .then((data) =>
          data
            ? res.status(200).json({ card: data })
            : res.status(404).json({ error: "No Card Found." }),
        );
    } catch (err: unknown) {
      throw new Error(err as string);
    }
  }
}
