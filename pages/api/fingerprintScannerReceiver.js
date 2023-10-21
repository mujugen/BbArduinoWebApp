import { parse } from "querystring";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let bodyData = "";
    req.on("data", (chunk) => {
      bodyData += chunk;
    });
    req.on("end", () => {
      const rawData = Buffer.from(bodyData, "binary");
      fs.writeFile("rawImageData.bin", rawData, "binary", (err) => {
        if (err) {
          console.error("Error saving raw image data:", err);
          res.status(500).send("Error saving raw image data");
        } else {
          console.log("Raw image data saved as rawImageData.bin");
          res.status(200).send("Raw image data received and saved");
        }
      });
    });
  } else {
    res.status(405).send("Method not allowed");
  }
}
