/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/navbar";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (router.query.data) {
      setData(JSON.parse(atob(router.query.data)));
      console.log(JSON.parse(atob(router.query.data)));
    }
  }, [router.query.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex flex-col">
      <Navbar data={data} />
      <div className="flex w-full h-full justify-center p-10 space-x-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white p-8 rounded-lg  w-full mb-10 flex flex-col">
            <h3 className="text-xl font-bold mb-5">Balance</h3>
            <h2 className="text-5xl font-semibold mb-8">
              {data?.balance ? data.balance : "P0.00"}
            </h2>
            <button className="w-1/4 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-lg p-2 transition-transform transform hover:scale-105">
              Cash In
            </button>
          </div>
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col pb-10">
            <h3 className="text-xl font-bold mb-10">Transactions</h3>
            {true ? (
              <>
                <div className="bg-white p-8 rounded-lg w-full mb-5 flex flex-col border-2 border-gray-300"></div>
                <div className="bg-white p-8 rounded-lg w-full mb-5 flex flex-col border-2 border-gray-300"></div>
                <div className="bg-white p-8 rounded-lg w-full mb-5 flex flex-col border-2 border-gray-300"></div>
                <a href="#">
                  <h3 className="text-blue-600 font-bold">Show all</h3>
                </a>
              </>
            ) : (
              <h3 className="text-gray-500 text-center">No transactions</h3>
            )}
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col">
            <div className="flex space-x-5">
              <button className="text-xl font-bold w-1/2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-full p-4 transition-transform transform hover:scale-105">
                Send
              </button>
              <button className="text-xl font-bold w-1/2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-red-200 text-white rounded-full p-4 transition-transform transform hover:scale-105">
                Request
              </button>
            </div>
            <h4 className="text-xl font-bold my-10">Send again</h4>
            <div className="flex space-x-10 flex-row">
              <div className="flex flex-col items-center">
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
                  John Watson
                </h4>
              </div>
              <div className="flex flex-col items-center">
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
                  John Watson
                </h4>
              </div>
              <div className="flex flex-col items-center">
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
                  John Watson
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
