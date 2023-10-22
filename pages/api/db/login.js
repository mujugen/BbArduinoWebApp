import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email, password } = req.body;
  console.log("login");
  try {
    const response = await prisma.users.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    if (!response) {
      res.status(500).json({ error: "Couldn't find user" });
    }
    res.status(200).json({ response });
    console.log(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
