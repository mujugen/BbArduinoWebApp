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
    const randomSessionId = makeid(10);
    await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        session_id: randomSessionId,
      },
    });
    res.status(200).json(randomSessionId );
    console.log(randomSessionId);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
