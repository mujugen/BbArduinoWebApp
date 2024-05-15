import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("retrieveFromBlockchain");
    try {
      const { email, blockchain_address } = req.body;

      // Import the ethers library provided by Hardhat
      const { ethers } = require("hardhat");

      // Import the contract artifact
      const Storage = await ethers.getContractFactory("Storage");

      const [deployer] = await ethers.getSigners();

      // Replace with your deployed contract address
      const storage = Storage.attach(blockchain_address);

      // Get data
      const data = await storage.getData();
      console.log("Data retrieved:", data);
      res.status(201).json(data);
    } catch (error) {
      console.error("Error uploading to blockchain:", error);
      res.status(500).json({ error: "Failed to upload to blockchain" });
    }
  } else {
    res.status(405).end(); // Method not allowed for non-POST requests
  }
}
