import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log("enrollAPI");
  const { email } = req.body;
  console.log(email);
  res.status(200).json({
    data: "Success",
    message: "Success",
  });
  try {
    //const url = `http://${process.env.ARDUINO_IP}:80/api/enrollAPI`;

    //const response = await axios.get(url);

    //const data = response.data;

    const data = "test fingerprint";

    const dbresponse = await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        fingerprint: data,
      },
    });
    if (!dbresponse) {
      res.status(500).json({ error: "DB Error" });
    }

    console.log(dbresponse);

    res.status(200).json({
      data: "Successfully fetched data from Arduino",
      message: dbresponse,
    });
  } catch (error) {
    console.error("Error fetching data from Arduino:", error);
    res.status(500).json({ error: "Failed to fetch data from Arduino" });
  }
}
