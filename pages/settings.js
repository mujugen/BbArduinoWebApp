/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/navbar";

export default function Settings() {
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
            <div className="flex justify-center flex-col items-center">
              <button
                type="button"
                className="text-sm bg-blue-500 rounded-full w-fit"
              >
                <svg
                  className="w-40 h-40 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -100 460 800"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </button>
              <h3 className="text-2xl font-bold my-5">
                {data?.first_name
                  ? `${data.first_name} ${data.last_name}`
                  : " "}
              </h3>
            </div>
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col"></div>
        </div>
      </div>
    </div>
  );
}
