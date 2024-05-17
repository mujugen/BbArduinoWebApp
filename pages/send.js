/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/navbar";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [cashInValue, setCashInValue] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedSendUser, setSelectedSendUser] = useState(null);
  const [modalToggle, setModalToggle] = useState(false);
  const [modalTopText, setModalTopText] = useState("Success");
  let counter = 0;
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  useEffect(() => {
    async function fetchData() {
      if (counter === 0) {
        let session_id = localStorage.getItem("session_id");
        if (session_id == null) {
          router.push("/");
        }
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
            router.push("/");
          }
          const userData = await response.json();
          console.log(userData);
          setData(userData);
          getUsers(userData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchData();
  }, []);

  const handleRadioClick = (id, value) => {
    const amountFieldElement = document.getElementById("amountField");
    if (selectedRadio === id) {
      setSelectedRadio(null);
      amountFieldElement.value = "";
    } else {
      setSelectedRadio(id);
      amountFieldElement.value = value;
    }
  };

  async function send() {
    console.log(selectedSendUser);
    const amountFieldElement = document.getElementById("amountField");
    setCashInValue(amountFieldElement.value);
    console.log(amountFieldElement.value);
    if (selectedSendUser == null) {
      alert("Select a receiver");
      return;
    }
    if (amountFieldElement != "" || amountFieldElement != null) {
      if (data.balance < amountFieldElement.value) {
        alert("Not enough balance");
        return;
      }
      const sender_id = `${data.id}`;
      const receiver_id = `${selectedSendUser}`;
      const amount = amountFieldElement.value;

      try {
        const response = await fetch("http://localhost:3000/api/db/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id,
            receiver_id,
            amount,
          }),
        });
        setModalToggle(true);
        await sleep(1000);
        router.push("/home");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      alert("Enter an amount");
    }
  }

  async function getUsers(userData) {
    const data = userData;
    try {
      const response = await fetch("http://localhost:3000/api/db/getUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const users = await response.json();
      console.log(users);
      setAllUsers(users);

      // remove current user from users
      const index = users.findIndex((obj) => obj.id == data.id);

      if (index !== -1) {
        users.splice(index, 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-200 flex flex-col">
      <Navbar data={data} active="send" />
      <div className="flex w-full h-full justify-center p-10 space-x-10">
        <div className="w-full max-w-2xl">
          <h3 className="text-3xl font-semibold mb-5">Send Money</h3>
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col">
            <h3 className="text-2xl font-bold mb-10">
              Balance:{" "}
              {data?.balance ? `P${data.balance.toLocaleString()}` : "P0"}
            </h3>
            <h3 className="text-xl font-semibold mb-3">Receiver</h3>
            <form className="w-full">
              <select
                id="sendUser"
                className="appearance-none w-full text-gray-700 border py-4 pl-10 pr-4 border-gray-300 bg-white hover:bg-white-800 font-medium rounded-lg text-lg"
                value={selectedSendUser || ""}
                onChange={(event) => {
                  const value =
                    event.target.value === "" ? null : event.target.value;
                  setSelectedSendUser(value);
                }}
              >
                <option value="">Select a user</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </form>
            <div className="w-1/2 self-center mt-10">
              <h3 className="text-gray-600 text-xl font-semibold mt-5 text-center">
                Amount
              </h3>
              <div className="flex mt-10 w-full justify-center">
                <h3 className="self-center text-4xl w-fit inline ">P</h3>
                <input
                  type="number"
                  id="amountField"
                  placeholder="Amount"
                  className="inline w-3/4 text-center text-black focus:ring-transparent focus-visible:outline-none text-4xl"
                  min="0"
                />
              </div>
            </div>
            <div className="mt-20 px-20">
              <ul className="grid w-full gap-6 md:grid-cols-4 px-10">
                <li className="block font-semibold content-center justify-center">
                  <input
                    type="radio"
                    id="hosting-big-1"
                    name="hosting-plan"
                    className="hidden peer"
                    onClick={() => handleRadioClick("hosting-big-1", 500)}
                    checked={selectedRadio == "hosting-big-1"}
                    onChange={() => {
                      return;
                    }}
                  />
                  <label
                    htmlFor="hosting-big-1"
                    className="block font-semibold content-center justify-between text-gray-500 bg-white border border-gray-300 rounded-xl cursor-pointer w-20 h-20 text-center"
                  >
                    P500
                  </label>
                </li>
                <li className="block font-semibold content-center justify-center">
                  <input
                    type="radio"
                    id="hosting-big-2"
                    name="hosting-plan"
                    className="hidden peer"
                    onClick={() => handleRadioClick("hosting-big-2", 1000)}
                    checked={selectedRadio == "hosting-big-2"}
                    onChange={() => {
                      return;
                    }}
                  />
                  <label
                    htmlFor="hosting-big-2"
                    className="block font-semibold content-center justify-between text-gray-500 bg-white border border-gray-300 rounded-xl cursor-pointer w-20 h-20 text-center"
                  >
                    P1000
                  </label>
                </li>
                <li className="block font-semibold content-center justify-center">
                  <input
                    type="radio"
                    id="hosting-big-3"
                    name="hosting-plan"
                    className="hidden peer"
                    onClick={() => handleRadioClick("hosting-big-3", 2000)}
                    checked={selectedRadio == "hosting-big-3"}
                    onChange={() => {
                      return;
                    }}
                  />
                  <label
                    htmlFor="hosting-big-3"
                    className="block font-semibold content-center justify-between text-gray-500 bg-white border border-gray-300 rounded-xl cursor-pointer w-20 h-20 text-center"
                  >
                    P2000
                  </label>
                </li>
                <li className="block font-semibold content-center justify-center">
                  <input
                    type="radio"
                    id="hosting-big-4"
                    name="hosting-plan"
                    className="hidden peer"
                    onClick={() => handleRadioClick("hosting-big-4", 5000)}
                    checked={selectedRadio == "hosting-big-4"}
                    onChange={() => {
                      return;
                    }}
                  />
                  <label
                    htmlFor="hosting-big-4"
                    className="block font-semibold content-center justify-between text-gray-500 bg-white border border-gray-300 rounded-xl cursor-pointer w-20 h-20 text-center"
                  >
                    P5000
                  </label>
                </li>
                {/* Repeat similar structure for other radio inputs */}
              </ul>
            </div>

            <button
              className="self-center mt-10 text-xl font-bold w-1/2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-full p-4 transition-transform transform hover:scale-105"
              onClick={send}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div
        id="fingerprint-modal"
        tabIndex={-1}
        className={`fixed top-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-400 bg-opacity-50 transition-opacity duration-300 ${
          modalToggle ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="relative w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-white-700 p-20">
            {/* Modal body */}
            <div>
              <h4 className="text-2xl text-center font-semibold leading-relaxed text-gray-800 px-8">
                {modalTopText}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
