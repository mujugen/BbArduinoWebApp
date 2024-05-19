/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/navbar";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  let counter = 0;

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
          getTransactions(userData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchData();
  }, []);

  function goToPage(page) {
    router.push(page);
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

  async function getTransactions(userData) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/db/getTransactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userData.id,
          }),
        }
      );
      const data = await response.json();
      console.log("getTransactions");
      console.log(data);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex flex-col">
      <Navbar data={data} active="home" />
      <div className="flex w-full h-full justify-center p-10 space-x-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white p-8 rounded-lg  w-full mb-10 flex flex-col">
            <h3 className="text-xl font-bold mb-5">Balance</h3>
            <h2 className="text-5xl font-semibold mb-8">
              {data?.balance ? `P${data.balance.toLocaleString()}` : "P0"}
            </h2>

            <Link
              href="/cash-in"
              className="text-center w-1/4 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105"
            >
              Cash In
            </Link>
          </div>
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col pb-10">
            <h3 className="text-xl font-bold mb-10">Transactions</h3>
            {transactions.length > 0 && data ? (
              transactions
                ?.slice(-4)
                .reverse()
                .map((transaction) => (
                  <>
                    <div className="bg-white p-1 rounded-lg w-full mb-5 pl-5  flex-row border-2 border-gray-300 flex">
                      <div className="h-16 w-16 my-3 flex rounded-2xl border-blue-500 border-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                          className="fill-blue-500 self-center m-2"
                        >
                          <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zM272 192H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16s7.2-16 16-16zM256 304c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16zM164 152v13.9c7.5 1.2 14.6 2.9 21.1 4.7c10.7 2.8 17 13.8 14.2 24.5s-13.8 17-24.5 14.2c-11-2.9-21.6-5-31.2-5.2c-7.9-.1-16 1.8-21.5 5c-4.8 2.8-6.2 5.6-6.2 9.3c0 1.8 .1 3.5 5.3 6.7c6.3 3.8 15.5 6.7 28.3 10.5l.7 .2c11.2 3.4 25.6 7.7 37.1 15c12.9 8.1 24.3 21.3 24.6 41.6c.3 20.9-10.5 36.1-24.8 45c-7.2 4.5-15.2 7.3-23.2 9V360c0 11-9 20-20 20s-20-9-20-20V345.4c-10.3-2.2-20-5.5-28.2-8.4l0 0 0 0c-2.1-.7-4.1-1.4-6.1-2.1c-10.5-3.5-16.1-14.8-12.6-25.3s14.8-16.1 25.3-12.6c2.5 .8 4.9 1.7 7.2 2.4c13.6 4.6 24 8.1 35.1 8.5c8.6 .3 16.5-1.6 21.4-4.7c4.1-2.5 6-5.5 5.9-10.5c0-2.9-.8-5-5.9-8.2c-6.3-4-15.4-6.9-28-10.7l-1.7-.5c-10.9-3.3-24.6-7.4-35.6-14c-12.7-7.7-24.6-20.5-24.7-40.7c-.1-21.1 11.8-35.7 25.8-43.9c6.9-4.1 14.5-6.8 22.2-8.5V152c0-11 9-20 20-20s20 9 20 20z" />
                        </svg>
                      </div>
                      <div className="ml-5 flex flex-col justify-center">
                        <h4 className="text-xl font-bold">
                          {data.id == transaction.transaction_sender
                            ? "Send"
                            : transaction.transaction_type == "Cash-In"
                            ? "Cash-In"
                            : "Receive"}
                        </h4>
                        <h6 className="text-md text-gray-600">
                          {data.id == transaction.transaction_sender
                            ? `${transaction.transaction_receiver_name}`
                            : `${transaction.transaction_sender_name}`}
                        </h6>
                      </div>
                      <div className="ml-auto justify-center flex flex-col pr-5 text-xl font-bold">
                        {data.id == transaction.transaction_sender ? (
                          <div className="text-red-500">
                            -P{transaction.transaction_amount}
                          </div>
                        ) : (
                          <div className="text-green-500">
                            +P{transaction.transaction_amount}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ))
            ) : (
              <h3 className="text-gray-500 text-center">No transactions</h3>
            )}
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col">
            <div className="flex space-x-5">
              <button
                className="text-xl font-bold w-1/2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-full p-4 transition-transform transform hover:scale-105"
                onClick={() => {
                  goToPage("send");
                }}
              >
                Send
              </button>
              <button className="text-xl font-bold w-1/2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-full p-4 transition-transform transform hover:scale-105">
                Request
              </button>
            </div>
            <h4 className="text-xl font-bold my-10">Contacts</h4>
            <div className="flex space-x-10 justify-center flex-row">
              {allUsers ? (
                allUsers?.slice(-5).map((user) => (
                  <div
                    id={user.id}
                    key={user.id}
                    className="flex flex-col items-center"
                  >
                    <button
                      type="button"
                      className="text-sm bg-blue-500 rounded-full w-fit"
                    >
                      <svg
                        className="w-16 h-16 fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -100 460 800"
                      >
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                      </svg>
                    </button>
                    <h4
                      className="text-center text-gray-500 mt-2"
                      style={{ maxWidth: "4rem" }}
                    >
                      {user.first_name} {user.last_name}
                    </h4>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
