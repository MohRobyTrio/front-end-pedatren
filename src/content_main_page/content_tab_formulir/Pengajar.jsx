// const Pengajar = () => {
//     return (
//         <h1 className="text-xl font-bold">Pengajar</h1>
//     )
// };

// export default Pengajar;

import { useEffect, useState } from "react";

const PengajarDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

// Ini API
  useEffect(() => {
    fetch("https://api.example.com/pangkalan-lembaga") // Ganti dengan URL API backend
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="">
        <h1 className="text-xl font-bold">Pangkalan Lembaga</h1>
        <hr className="border-t border-gray-300 my-4" />
        {loading ? (
          <p>Loading...</p>
        ) : data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((item) => (
              <li key={item.id} className="border-b pb-2">
                <h5 className="text-lg font-bold">{item.nama}</h5>
                <p className="text-gray-600">{item.alamat}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada data tersedia.</p>
        )}
    </div>
  );
};

export default PengajarDashboard;
