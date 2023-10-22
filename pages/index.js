export default function Home() {
  async function enrollRequest() {
    console.log("enrollRequest");
    try {
      const response = await fetch("http://localhost:3000/api/enrollAPI");
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
      const response = await fetch("http://localhost:3000/api/verifyAPI");
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
      const response = await fetch("http://localhost:3000/api/deleteAPI");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="mb-4">
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            User ID:
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            className="mt-1 p-2 w-full border rounded-md"
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
          ></textarea>
        </div>
      </div>
    </div>
  );
}
