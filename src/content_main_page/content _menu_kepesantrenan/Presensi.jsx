// const Presensi = () => {
//     return (
//         <div className="flex-1 pl-6 pt-6 pb-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold">Presensi</h1>
//             </div>
//         </div>
//     )
// }

// export default Presensi;

import { useEffect, useState } from "react";

const Presensi = () => {
  const [activities, setActivities] = useState([]);

// Ini API
  useEffect(() => {
    fetch("https://api.example.com/activities") // Ganti dengan URL API backend Anda
      .then((response) => response.json())
      .then((data) => setActivities(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex-1 pl-6 pt-6 pb-6">
      <h1 className="text-xl font-bold">Presensi Kegiatan</h1>
      <hr className="border-t border-gray-300 my-4" />
      <div className="bg-blue-100 p-3 rounded-md mt-2">
        Pilih Salah satu kegiatan untuk melanjutkan <b>Presensi</b>.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">{activity.name}</h2>
            <p className="text-sm font-bold">Hari</p>
            <p className="text-sm">{activity.days}</p>
            <p className="text-sm font-bold">Jam</p>
            <p className="text-sm">{activity.time}</p>
            <div className="mt-2 flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded">Presensi</button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded">Rekap</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presensi;
