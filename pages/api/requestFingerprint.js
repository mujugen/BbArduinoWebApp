import axios from "axios";

export default async function handler(req, res) {
  try {
    // Define the endpoint URL of the Arduino server
    const arduinoURL = "http://192.168.5.192:80/api/arduinoAPI1";

    // Make a GET request to the Arduino server
    // Adjust this to POST or another HTTP method if needed
    const response = await axios.get(arduinoURL);

    // If the request was successful, you can process the response here
    const data = response.data;
    console.log(data); // Logging the response data from the Arduino server

    // Send a response back to the client
    res
      .status(200)
      .json({ message: "Successfully fetched data from Arduino", data: data });
  } catch (error) {
    console.error("Error fetching data from Arduino:", error);
    res.status(500).json({ error: "Failed to fetch data from Arduino" });
  }
}
