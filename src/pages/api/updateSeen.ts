/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: string }>,
) {
  if (req.method === "POST") {
    const { id } = JSON.parse(req.body as string);

    try {
      const card = await db.card.update({
        data: {
          seen: true,
        },
        where: {
          id: id,
        },
        select: {
          id: true,
        },
      });

      res.status(200).json({ id: card.id });
    } catch (err: unknown) {
      throw new Error(err as string);
    }
  }
}
