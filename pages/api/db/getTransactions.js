import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.body;
  console.log("getTransactions");
  try {
    const response = await prisma.transactions.findMany({
      where: {
        OR: [
          {
            transaction_sender: `${id}`,
          },
          {
            transaction_receiver: `${id}`,
          },
        ],
      },
    });

    if (!response) {
      res.status(500).json({ error: "Invalid session id" });
    }
    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
