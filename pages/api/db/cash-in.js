import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { bank_name, user_id, amount } = req.body;
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: parseInt(user_id),
      },
    });
    const userNewBalance = parseInt(user.balance) + parseInt(amount);
    // create transaction
    const response = await prisma.transactions.create({
      data: {
        transaction_sender: bank_name,
        transaction_receiver: `${user_id}`,
        transaction_type: "Cash-In",
        transaction_amount: parseInt(amount),
        transaction_datetime: new Date(),
        transaction_receiver_name: `${user.first_name} ${user.last_name}`,
        transaction_sender_name: bank_name,
      },
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
