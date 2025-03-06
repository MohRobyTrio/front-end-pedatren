// const WaliAsuh = () => {
//     return (
//         <h1 className="text-xl font-bold">Wali Asuh</h1>
//     )
// };

// export default WaliAsuh;

import { useState, useEffect } from "react";

const TabWaliAsuh = () => {
  const [waliAsuhList, setWaliAsuhList] = useState([
    { id: 1, nomorInduk: "2020712450", mulai: "2021-01-29", akhir: "2022-05-17" },
    { id: 2, nomorInduk: "2020712450", mulai: "2022-12-02", akhir: "2023-05-29" },
    { id: 3, nomorInduk: "2020712450", mulai: "2023-06-04", akhir: "2024-05-15" },
    { id: 4, nomorInduk: "2020712450", mulai: "2024-11-16", akhir: "Sekarang" },
  ]);

  const [formData, setFormData] = useState({
    nomorInduk: "2020712450",
    mulai: "",
    akhir: "",
  });


  //   Menggunakan API
//   useEffect(() => {
//     fetch("https://api.example.com/wali-asuh") // Ganti dengan URL API backend Anda
//       .then((response) => response.json())
//       .then((data) => setWaliAsuhList(data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);


  const resetForm = () => {
    setFormData({ nomorInduk: "2020712450", mulai: "", akhir: "" });
  };


  return (
    <div className="bloc" id="WaliAsuh">
      <h1 className="text-xl font-bold">Wali Asuh</h1>
      <div className="mt-5"></div>

      <div id="waliAsuhList" className="space-y-2">
        {waliAsuhList.map((wali) => (
          <div key={wali.id} className="bg-white shadow-md rounded-lg p-4">
            <h5 className="text-lg font-bold">{wali.nomorInduk}</h5>
            <p className="text-gray-600">Sejak {wali.mulai} Sampai {wali.akhir}</p>
          </div>
        ))}
      </div>
      <br />

      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Nomor Induk Santri</label>
          <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="2020712450">2020712450</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium">Waktu Mulai</label>
          <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>

        <div>
          <label className="block text-sm font-medium">Waktu Akhir</label>
          <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700"></label>
            <button type="button" className="mt-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none">
                Batal
            </button>
        </div>
      </form>
    </div>
  );
};

export default TabWaliAsuh;
