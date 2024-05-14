import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.body;
  console.log("verifyAPI");
  try {
    const url = `http://192.168.254.109:80/api/verifyAPI`;

    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(500).json({ error: "User not found" });
      return;
    }
    const buffer = user.fingerprint;

    const response = await axios.post(url, buffer, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    const data = response.data;
    console.log(data);

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error("Error fetching data from Arduino:", error);
    res.status(500).json({ error: "Failed to fetch data from Arduino" });
  }
}
