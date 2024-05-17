import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { session_id } = req.body;
  console.log("retrieveData");
  try {
    const response = await prisma.users.findFirst({
      where: {
        session_id: session_id,
      },
    });
    if (!response) {
      res.status(500).json({ error: "Invalid session id" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
