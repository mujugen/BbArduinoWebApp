import axios from "axios";

export default async function handler(req, res) {
  try {
    const url = "http://192.168.254.102:80/api/verifyAPI";

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
