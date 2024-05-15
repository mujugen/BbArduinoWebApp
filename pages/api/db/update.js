import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log("update");
  const { email, column, value } = req.body;
  console.log(email);
  try {
    const dbresponse = await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        [column]: value,
      },
    });
    if (!dbresponse) {
      res.status(500).json({ error: "DB Error" });
    }

    console.log(dbresponse);

    res.status(200).json({
      data: "Successfully updated",
      message: dbresponse,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
}
