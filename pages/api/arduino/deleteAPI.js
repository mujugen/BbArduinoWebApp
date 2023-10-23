import axios from "axios";

export default async function handler(req, res) {
  try {
    const url = `http://${process.env.ARDUINO_IP}:80/api/deleteAPI`;

    const response = await axios.get(url);

    const data = response.data;
    console.log(data);
    res
      .status(200)
      .json({ message: "Successfully fetched data from Arduino", data: data });
  } catch (error) {
    console.error("Error fetching data from Arduino:", error);
    res.status(500).json({ error: "Failed to fetch data from Arduino" });
  }
}
