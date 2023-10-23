import React, { useState } from "react";

export default function Home() {
  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [currentUserId, setcurrentUserId] = useState(0);
  const [userFullname, setuserFullname] = useState("");
  const [userFingerprint, setuserFingerprint] = useState("");
  const [arduinoState, setarduinoState] = useState("Waiting");

  function createWebSocket() {
    const socket = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_ARDUINO_IP}:81/`
    );

    socket.addEventListener("open", (event) => {
      console.log("Connected to WS server");
    });

    socket.addEventListener("message", (event) => {
      console.log("Message from server: ", event.data);
      setarduinoState(event.data);
    });
  }

  async function enrollRequest() {
    createWebSocket();
    const emailInput = document.getElementById("email");
    const email = emailInput.value;

    console.log("enrollRequest");
    if (currentUserId == 0) {
      alert("Log in first");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/arduino/enrollAPI",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function verifyRequest() {
    createWebSocket();
    const emailInput = document.getElementById("email");
    const email = emailInput.value;

    setarduinoState("Sending request");
    console.log("verifyRequest");
    if (currentUserId == 0) {
      alert("Log in first");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/arduino/verifyAPI",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      console.log(data.data);
      setarduinoState(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function login() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Access the values of the input fields
    const email = emailInput.value;
    const password = passwordInput.value;

    // Log the values to the console
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await fetch("http://localhost:3000/api/db/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        alert("Wrong credentials");
        throw new Error("Something went wrong");
      }
      alert("Success");
      const data = await response.json();
      console.log(data);
      setcurrentUserId(data.response.id);
      setuserFullname(`${data.response.first_name} ${data.response.last_name}`);
      setuserFingerprint(data.response.fingerprint);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function register() {
    setShowRegisterForm(!showRegisterForm);
  }

  async function confirmRegister() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const birthdayInput = document.getElementById("birthday");

    if (!birthdayInput.value) {
      alert("Please enter your birthday");
      return;
    }
    // Access the values of the input fields
    const email = emailInput.value;
    const password = passwordInput.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const birthday = new Date(birthdayInput.value).toISOString().split("T")[0];

    // Create an object with the data you want to send
    const dataToSend = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
    };

    try {
      const response = await fetch("http://localhost:3000/api/db/register", {
        method: "POST", // This is a POST request
        headers: {
          "Content-Type": "application/json", // Specify that you are sending JSON data
        },
        body: JSON.stringify(dataToSend), // Convert the data to JSON and send it in the body
      });

      if (!response.ok) {
        alert("Something went wrong");
        throw new Error("Something went wrong");
      }
      alert("Success");
      const data = await response.json();
      console.log(data);
      setcurrentUserId(data.id);
      setShowRegisterForm(!showRegisterForm);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 mb-5 flex flex-col">
        {showRegisterForm ? (
          <>
            <div className="mb-4">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="userId"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password:
              </label>
              <input
                type="text"
                id="password"
                name="userId"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="flex flex-col w-full space-y-3 mt-4 items-center">
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                onClick={login}
              >
                Login
              </button>
              <button
                className="w-1/2 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                onClick={register}
              >
                Register
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="userId"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password:
              </label>
              <input
                type="text"
                id="password"
                name="userId"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Birthday:
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div className="flex flex-col w-full space-y-3 mt-4 items-center">
              <button
                className="w-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                onClick={confirmRegister}
              >
                Confirm
              </button>
              <button
                className="w-1/2 bg-gray-400 hover:bg-gray-800 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                onClick={register}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex flex-col justify-items-center text-center">
          <div className="mb-2">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current User:
            </label>
            <div id="userId" className="mt-1 p-2 w-full">
              {currentUserId}
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name:
            </label>
            <div id="userId" className="mt-1 p-2 w-full">
              {userFullname}
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fingerprint:
            </label>
            <div id="userId" className="mt-1 p-2 w-full overflow-hidden">
              {userFingerprint}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-indigo-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
            onClick={enrollRequest}
          >
            Enroll
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
            onClick={verifyRequest}
          >
            Verify
          </button>
        </div>
        <div className="flex flex-col justify-items-center text-center">
          <div className="mb-2 mt-4">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              State:
            </label>
            <div id="userId" className="mt-1 p-2 w-full">
              {arduinoState}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
