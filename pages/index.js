import React, { useState } from "react";

export default function Home() {
  const [showRegisterForm, setShowRegisterForm] = useState(true);

  async function enrollRequest() {
    console.log("enrollRequest");
    try {
      const response = await fetch(
        "http://localhost:3000/api/arduino/enrollAPI"
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
    console.log("verifyRequest");
    try {
      const response = await fetch(
        "http://localhost:3000/api/arduino/verifyAPI"
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
  async function deleteRequest() {
    console.log("deleteRequest");
    try {
      const response = await fetch(
        "http://localhost:3000/api/arduino/deleteAPI"
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

  async function login() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Access the values of the input fields
    const email = emailInput.value;
    const password = passwordInput.value;

    // Log the values to the console
    console.log("Email:", email);
    console.log("Password:", password);
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

    // Access the values of the input fields
    const email = emailInput.value;
    const password = passwordInput.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const birthday = birthdayInput.value;

    // Log the values to the console
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Birthday:", birthday);
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
        <div className="mb-4">
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current User:
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            className="mt-1 p-2 w-full border rounded-md"
            disabled
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
            onClick={enrollRequest}
          >
            Enroll Fingerprint
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
            onClick={verifyRequest}
          >
            Verify Fingerprint
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
            onClick={deleteRequest}
          >
            Delete Fingerprint
          </button>
        </div>

        <div className="mt-6">
          <label
            htmlFor="logs"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Logs:
          </label>
          <textarea
            id="logs"
            name="logs"
            rows="4"
            className="mt-1 p-2 w-full border rounded-md"
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  );
}
