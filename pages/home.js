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
    </div>
  );
}
