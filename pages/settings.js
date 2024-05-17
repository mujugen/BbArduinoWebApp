/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/navbar";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [file, setUploadedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [buttonState, setButtonState] = useState("Edit");
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
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchData();
  }, []);

  function toggleEdit() {
    setButtonState((prevText) => (prevText === "Edit" ? "Save" : "Edit"));
  }

  async function saveEdit() {
    const addressValue = document.getElementById("address_field").value;
    const cityValue = document.getElementById("city_field").value;
    const provinceValue = document.getElementById("province_field").value;
    const postal_codeValue = document.getElementById("postal_code_field").value;
    const ssnValue = document.getElementById("ssn_field").value;
    const jobValue = document.getElementById("job_field").value;
    const monthly_incomeValue = document.getElementById(
      "monthly_income_field"
    ).value;
    const id_numberValue = document.getElementById("id_number_field").value;
    const id_scanInput = document.getElementById("id_scan_field");
    let id_scanFile = null;
    if (file) {
      id_scanFile = file;
    } else {
      id_scanFile = id_scanInput.files[0];
    }
    let id_scanValue = "";
    if (id_scanFile) {
      var reader = new FileReader();
      reader.readAsDataURL(id_scanFile);
      reader.onload = function () {
        id_scanValue = reader.result;
        console.log("Address:", addressValue);
        console.log("City:", cityValue);
        console.log("Province:", provinceValue);
        console.log("Postal Code:", postal_codeValue);
        console.log("SSN:", ssnValue);
        console.log("Job:", jobValue);
        console.log("Monthly Income:", monthly_incomeValue);
        console.log("ID Number:", id_numberValue);
        console.log("ID Scan:", id_scanValue);
        console.log("Trying to save to blockchain");
        saveToBlockchain(
          addressValue,
          cityValue,
          provinceValue,
          postal_codeValue,
          ssnValue,
          jobValue,
          monthly_incomeValue,
          id_numberValue,
          id_scanValue
        );
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    } else {
      console.log("ID Scan: No file selected");
    }
  }
  async function saveToBlockchain(
    addressValue,
    cityValue,
    provinceValue,
    postal_codeValue,
    ssnValue,
    jobValue,
    monthly_incomeValue,
    id_numberValue,
    id_scanValue
  ) {
    // save to blockchain
    try {
      const response = await fetch("/api/registerToBlockchain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          address: addressValue,
          city: cityValue,
          province: provinceValue,
          postal_code: postal_codeValue,
          ssn: ssnValue,
          job: jobValue,
          monthly_income: monthly_incomeValue,
          id_number: id_numberValue,
          id_scan: id_scanValue,
        }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const responseData = await response.json();
      console.log(responseData);
      setButtonState("Edit");
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function enrollRequest() {
    console.log("enrollRequest");
    try {
      const response = await fetch("/api/arduino/enrollAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const responseData = await response.json();
      console.log(responseData);

      // refresh data
      const response2 = await fetch("http://localhost:3000/api/db/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const temp_data = await response2.json();
      setData(temp_data.response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function retrieveData() {
    console.log(data);
    try {
      const response = await fetch("/api/retrieveFromBlockchain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          blockchain_address: data.blockchain_address,
        }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      let responseData = await response.json();
      console.log(JSON.parse(atob(responseData)));
      responseData = JSON.parse(atob(responseData));

      // The fields for the document
      const addressElement = document.getElementById("address_field");
      const cityElement = document.getElementById("city_field");
      const provinceElement = document.getElementById("province_field");
      const postal_codeElement = document.getElementById("postal_code_field");
      const ssnElement = document.getElementById("ssn_field");
      const jobElement = document.getElementById("job_field");
      const monthly_incomeElement = document.getElementById(
        "monthly_income_field"
      );
      const id_numberElement = document.getElementById("id_number_field");

      addressElement.value = responseData.address;
      cityElement.value = responseData.city;
      provinceElement.value = responseData.province;
      postal_codeElement.value = responseData.postal_code;
      ssnElement.value = responseData.ssn;
      jobElement.value = responseData.job;
      monthly_incomeElement.value = responseData.monthly_income;
      id_numberElement.value = responseData.id_number;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-200 flex flex-col">
      <Navbar data={data} active="default" />
      <div className="flex w-full h-full justify-center p-10 space-x-10">
        <div className="w-full max-w-2xl">
          <div
            className="bg-white p-8 rounded-lg  w-full mb-10 flex flex-col"
            style={{
              background: "linear-gradient(to bottom, white 40%, #111827 40%)",
            }}
          >
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
              <h3 className="text-2xl font-bold my-5 text-white">
                {data?.first_name
                  ? `${data.first_name} ${data.last_name}`
                  : " "}
              </h3>
            </div>
          </div>
          <h3 className="text-2xl font-semibold my-5">Basic Information</h3>
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col">
            <h4 className="text-gray-600 mb-3 mt-3">Email</h4>
            <h3 className="text-lg mb-3"> {data?.email ? data.email : "-"}</h3>
            <h4 className="text-gray-600 mb-3 mt-3">Birth date</h4>
            <h3 className="text-lg mb-3">
              {" "}
              {data?.birthday ? data.birthday.split("T")[0] : "-"}
            </h3>
            <h4 className="text-gray-600 mb-3 mt-3">User ID</h4>
            <h3 className="text-lg mb-3"> {data?.id ? data.id : "-"}</h3>
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <h3 className="text-2xl font-semibold my-5">Full Information</h3>
          <div className="bg-white p-8 rounded-lg  w-full mb-5 flex flex-col">
            <h4 className="text-gray-600 mb-3 mt-3">Fingerprint</h4>
            <div className="flex">
              <h3
                className={
                  data?.fingerprint
                    ? "text-lg mb-3 text-green-400"
                    : "text-lg mb-3 text-gray-400"
                }
              >
                {data?.fingerprint ? "Registered" : "Unregistered"}
              </h3>
              <button
                className={
                  buttonState == "Edit"
                    ? "ml-auto  w-1/4 bg-gray-300  text-white rounded-lg p-2"
                    : "ml-auto w-1/4 bg-blue-500 hover:bg-blue-600 focus:outline-none  text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                }
                disabled={buttonState == "Edit" ? true : false}
                onClick={enrollRequest}
              >
                Register
              </button>
            </div>
            <h4 className="text-gray-600 mb-3 mt-3">Address</h4>
            <input
              disabled={buttonState == "Edit" ? true : false}
              type="text"
              id="address_field"
              placeholder="Enter your address"
              className="mt-1 p-2 w-full border rounded-md"
            />
            <div className="flex justify-between">
              <div>
                <h4 className="text-gray-600 mb-3 mt-3">City</h4>
                <input
                  disabled={buttonState == "Edit" ? true : false}
                  type="text"
                  id="city_field"
                  placeholder="Enter your city"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <h4 className="text-gray-600 mb-3 mt-3">Province</h4>
                <input
                  disabled={buttonState == "Edit" ? true : false}
                  type="text"
                  id="province_field"
                  placeholder="Enter your province"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <h4 className="text-gray-600 mb-3 mt-3">Postal Code</h4>
                <input
                  disabled={buttonState == "Edit" ? true : false}
                  type="text"
                  id="postal_code_field"
                  placeholder="Ex: 1234"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <h4 className="text-gray-600 mb-3 mt-3">SSN</h4>
                <input
                  disabled={buttonState == "Edit" ? true : false}
                  type="text"
                  id="ssn_field"
                  placeholder="Ex: 1234"
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>
            <h4 className="text-gray-600 mb-3 mt-3">Job</h4>
            <input
              disabled={buttonState == "Edit" ? true : false}
              type="text"
              id="job_field"
              placeholder="Ex. Accountant"
              className="mt-1 p-2 w-full border rounded-md"
            />
            <h4 className="text-gray-600 mb-3 mt-3">Monthly Income</h4>
            <input
              disabled={buttonState == "Edit" ? true : false}
              type="text"
              id="monthly_income_field"
              placeholder="Ex. P50,000"
              className="mt-1 p-2 w-full border rounded-md"
            />
            <h4 className="text-gray-600 mb-3 mt-3">ID Number</h4>
            <input
              disabled={buttonState == "Edit" ? true : false}
              type="text"
              id="id_number_field"
              placeholder="ID Number"
              className="mt-1 p-2 w-full border rounded-md"
            />

            <h4 className="text-gray-600 mb-3 mt-3">ID Scan</h4>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="id_scan_field"
                className={
                  file || fileUploaded
                    ? "flex flex-col items-center justify-center w-full h-40 border-2 border-green-600 border-dashed rounded-lg cursor-pointer bg-green-100 dark:hover:bg-green-800 dark:bg-white-700 hover:bg-green-600 dark:border-green-600 dark:hover:border-green-600 dark:hover:bg-green-600 transition-all"
                    : "flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-white-700 hover:bg-gray-300 dark:border-gray-300 dark:hover:border-gray-300 dark:hover:bg-gray-300 transition-all"
                }
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  setUploadedFile(file);
                }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
                <input
                  id="id_scan_field"
                  type="file"
                  className="hidden"
                  disabled={buttonState == "Edit" ? true : false}
                  onChange={() => {
                    setFileUploaded(true);
                  }}
                />
              </label>
            </div>
            <div className="w-full flex justify-center mt-5">
              {buttonState == "Edit" ? (
                <div className="w-full flex justify-center space-x-5">
                  <button
                    disabled={data?.blockchain_address != null ? false : true}
                    onClick={() => {
                      if (data?.blockchain_address != null) {
                        retrieveData();
                      } else {
                        console.log("Not Registered");
                      }
                    }}
                    className={
                      data?.blockchain_address != null
                        ? "w-1/4 bg-yellow-500 hover:bg-yellow-600 focus:outline-none  text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                        : "w-1/4 bg-gray-300  text-white rounded-lg p-2"
                    }
                  >
                    Retrieve Data
                  </button>
                  <button
                    onClick={toggleEdit}
                    className={
                      buttonState == "Edit"
                        ? "w-1/4 bg-blue-500 hover:bg-blue-600 focus:outline-none  text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                        : "w-1/4 bg-green-500 hover:bg-green-600 focus:outline-none  text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                    }
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="w-full flex justify-center space-x-5">
                  <button
                    onClick={saveEdit}
                    className="w-1/4 bg-green-500 hover:bg-green-600 focus:outline-none  text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                  >
                    Save
                  </button>
                  <button
                    onClick={toggleEdit}
                    className="w-1/4 bg-gray-500 hover:bg-gray-600 focus:outline-none  text-white rounded-lg p-2 transition-transform transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
