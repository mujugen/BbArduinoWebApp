import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log("update");
  const { email, column, value } = req.body;
  console.log(email);
  console.log(column);
  console.log(value);
  try {
    const dbresponse = await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        [column]: parseInt(value),
      },
    });
    if (!dbresponse) {
      console.log("error");
      res.status(500).json({ error: "DB Error" });
    }

    console.log(dbresponse);
    console.log("success");

    res.status(200).json({
      data: "Successfully updated",
      message: dbresponse,
    });
  } catch (error) {
    console.log("error");
    res.status(500).json({ error: "Failed" });
  }
}
