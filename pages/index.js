import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  function sendMessageToServer() {
    console.log("sendMessageToServer");

    // Define the API URL
    const apiUrl = "/api/fingerprintScannerReceiver"; // Correct API route

    // Define the POST request options
    const requestOptions = {
      method: "POST",
    };

    // Make the POST request to the API
    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Response from API:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function requestFingerprint() {
    console.log("requestFingerprint");

    // Define the API URL
    const apiUrl = "/api/requestFingerprint"; // Correct API route

    // Define the POST request options
    const requestOptions = {
      method: "POST",
    };

    // Make the POST request to the API
    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Response from API:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="flex">
      <button className="bg-red-900 p-3" onClick={sendMessageToServer}>
        SendTestMessage
      </button>
      <button className="bg-blue-900 p-3" onClick={requestFingerprint}>
        RequestFingerprint
      </button>
    </div>
  );
}
