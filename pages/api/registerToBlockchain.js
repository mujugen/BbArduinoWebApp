import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("registerToBlockchain");
    try {
      const {
        email,
        address,
        city,
        province,
        postal_code,
        ssn,
        job,
        monthly_income,
        id_number,
        id_scan,
      } = req.body;

      // Import the ethers library provided by Hardhat
      const { ethers } = require("hardhat");

      // Import the contract artifact
      const Storage = await ethers.getContractFactory("Storage");

      // Deploy the contract
      const storage = await Storage.deploy();

      // Wait for the deployment to be mined
      await storage.deployed();

      console.log("Storage contract deployed to:", storage.address);

      const [deployer] = await ethers.getSigners();

      // Replace with your deployed contract address
      const storage2 = Storage.attach(storage.address);

      // Set data
      let tx = await storage2.setData(
        btoa(
          JSON.stringify({
            email,
            address,
            city,
            province,
            postal_code,
            ssn,
            job,
            monthly_income,
            id_number,
            id_scan,
          })
        )
      );
      await tx.wait();

      // Get data
      const data = await storage2.getData();
      console.log("Data retrieved:", data);

      const response = await prisma.users.update({
        where: {
          email: email,
        },
        data: {
          blockchain_address: storage.address,
        },
      });

      res.status(201).json(response);
    } catch (error) {
      console.error("Error uploading to blockchain:", error);
      res.status(500).json({ error: "Failed to upload to blockchain" });
    }
  } else {
    res.status(405).end(); // Method not allowed for non-POST requests
  }
}
