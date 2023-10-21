export default async function handler(req, res) {
  console.log("Received request");

  // Check if the request method is POST
  if (req.method === "POST") {
    // Log the received body in stringified JSON format
    console.log(JSON.stringify(req.body));

    // Respond with a success message
    res.status(200).json({ message: "Data received successfully" });
  } else {
    // Handle other methods or send an error response
    res.status(405).json({ message: "Method not allowed" });
  }
}
