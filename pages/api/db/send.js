import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { sender_id, receiver_id, amount } = req.body;
  console.log(sender_id, receiver_id, amount);
  try {
    const sender = await prisma.users.findFirst({
      where: {
        id: parseInt(sender_id),
      },
    });
    const receiver = await prisma.users.findFirst({
      where: {
        id: parseInt(receiver_id),
      },
    });
    const receiverNewBalance = parseInt(receiver.balance) + parseInt(amount);
    // add balance to receiver
    await prisma.users.update({
      where: {
        id: parseInt(receiver_id),
      },
      data: {
        balance: receiverNewBalance,
      },
    });
    const senderNewBalance = parseInt(sender.balance) - parseInt(amount);
    // deduct balance from sender
    await prisma.users.update({
      where: {
        id: parseInt(sender_id),
      },
      data: {
        balance: senderNewBalance,
      },
    });
    // create transaction
    const response = await prisma.transactions.create({
      data: {
        transaction_sender: sender_id,
        transaction_receiver: receiver_id,
        transaction_type: "Send",
        transaction_amount: parseInt(amount),
        transaction_datetime: new Date(),
        transaction_receiver_name: `${receiver.first_name} ${receiver.last_name}`,
        transaction_sender_name: `${sender.first_name} ${sender.last_name}`,
      },
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
