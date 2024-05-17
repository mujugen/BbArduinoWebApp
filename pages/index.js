/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Page() {
  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [currentUserId, setcurrentUserId] = useState(0);
  const [userFullname, setuserFullname] = useState("");
  const [userFingerprint, setuserFingerprint] = useState("");
  const [modalToggle, setModalToggle] = useState(false);
  const [modalTopText, setModalTopText] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  let counter = 0;

  useEffect(() => {
    async function fetchData() {
      if (counter === 0) {
        let session_id = localStorage.getItem("session_id");
        console.log(session_id);
        counter += 1;
        try {
          const response = await fetch(
            "http://localhost:3000/api/db/retrieveData",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ session_id }),
            }
          );
          if (!response.ok) {
            return;
          }
          const userData = await response.json();
          console.log(userData);
          router.push("/home");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchData();
  }, []);

  function createWebSocket() {
    const socket = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_ARDUINO_IP}:81/`
    );

    socket.addEventListener("open", (event) => {
      console.log("Connected to WS server");
    });

    socket.addEventListener("message", (event) => {
      console.log("Message from server: ", event.data);
      setStatus(event.data);
    });
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
      const session_id = await response.json();
      console.log(session_id);
      localStorage.setItem("session_id", session_id);
      router.push("/home");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  async function fingerprintLogin() {
    createWebSocket();
    setModalToggle(true);
    const emailInput = document.getElementById("email");
    const email = emailInput.value;
    console.log(email);
    if (email == "") {
      setModalTopText("Please enter your email");
    } else {
      setModalTopText("Please put your thumb on the scanner");
    }

    setStatus("Sending request");
    console.log("verifyRequest");
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
      setStatus(data.data);
      if (data.data == "Fingerprint match") {
        setModalTopText("Fingerprint match");
        setStatus("Success");
        await sleep(500);
        // Log the values to the console
        console.log("Email:", email);
        console.log("Password:", password);

        try {
          const response = await fetch(
            "http://localhost:3000/api/db/fingerprintLogin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );
          if (!response.ok) {
            alert("Wrong credentials");
            throw new Error("Something went wrong");
          }
          const session_id = await response.json();
          console.log(session_id);
          localStorage.setItem("session_id", session_id);
          router.push("/home");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setModalTopText("Fingerprint not matched, please try again");
        await sleep(1000);
        setModalToggle(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus("Failed, please retry");
      await sleep(1000);
      setModalToggle(false);
      return;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex flex-col">
      <div className="flex bg-white p-8 w-1/2 h-full fixed items-center justify-center">
        <div className="bg-white p-8 rounded-lg  w-3/5 mb-5 flex flex-col max-w-xl">
          {showRegisterForm ? (
            <>
              <div className="mb-4">
                <div className="mb-10">
                  <h1 className="ibm-plex-serif-medium text-2xl mb-9 font-semibold font-blue">
                    Sentria
                  </h1>
                  <h2 className="text-4xl font-semibold mb-3">Sign In</h2>
                  <h3>Please enter your details</h3>
                </div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="userId"
                  placeholder="Enter your email"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="userId"
                  placeholder="Enter your password"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div className="flex flex-col w-full space-y-3 mt-4 items-center">
                <button
                  className="w-full bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                  onClick={login}
                >
                  Sign in
                </button>
                <button
                  className="w-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                  onClick={fingerprintLogin}
                >
                  Sign in with Fingerprint
                </button>
                <div className="inline-block">
                  <h3 className="inline">Don't have an account?</h3>
                  <button
                    className="font-semibold rounded-lg p-2 transition-transform transform hover:scale-105"
                    onClick={register}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex space-x-10">
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
                      placeholder="Enter your first name"
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
                      placeholder="Enter your last name"
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                </div>
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
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
      </div>
      <div
        id="fingerprint-modal"
        tabIndex={-1}
        className={`fixed top-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-400 bg-opacity-50 transition-opacity duration-300 ${
          modalToggle ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="relative w-full max-w-lg max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-white-700 pb-10">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4  rounded-t">
              <button
                type="button"
                className="text-white-400 bg-transparent hover:bg-white-200 hover:text-white-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-white-600 dark:hover:text-white"
                data-modal-hide="medium-modal"
                onClick={() => {
                  setModalToggle(false);
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-10 md:p-5 space-y-2">
              <h4 className="text-2xl text-center font-semibold leading-relaxed text-gray-800 px-8">
                {modalTopText}
              </h4>
              <h5 className="text-lg text-center  leading-relaxed text-gray-500 px-8 pt-10">
                Status:
              </h5>
              <h3 className="text-lg text-center font-semibold leading-relaxed text-gray-800 px-8">
                {status ? status : "Waiting"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
