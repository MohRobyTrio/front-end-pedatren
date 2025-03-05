import React, { useState } from "react";

const Progress = () => {
    const [activeTab, setActiveTab] = useState("Afektif");

    return (
        <>
        <h1 className="text-xl font-bold">Catatan</h1>
        <hr className="border-t border-gray-300 my-4" />

        <div className="flex flex-col space-y-2">
        <button
          className={`p-2 text-blue-600 rounded ${
            activeTab === "Afektif" ? "bg-gray-200" : ""
          }`}
          onClick={() => setActiveTab("Afektif")}
        >
          Afektif
        </button>
        <button
          className={`p-2 text-blue-600 rounded ${
            activeTab === "Kognitif" ? "bg-gray-200" : ""
          }`}
          onClick={() => setActiveTab("Kognitif")}
        >
          Kognitif
        </button>
      </div>
        </>

    )
};

export default Progress;

