import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password, firstName, lastName, birthday } = req.body;

      // Create a new user using Prisma
      const response = await prisma.users.create({
        data: {
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
          birthday: `${birthday}T00:00:00.000Z`,
          balance: 0,
        },
      });

      console.log("User created:", response);
      res.status(201).json(response); // Respond with the created user data
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    res.status(405).end(); // Method not allowed for non-POST requests
  }
}
