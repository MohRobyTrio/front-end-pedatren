// const WarPres = () => {
//     return (
//         <h1 className="text-xl font-bold">Warga Pesantren</h1>
//     )
// };

// export default WarPres;

import { useEffect, useState } from "react";

const SantriDetail = () => {
  const [santri, setSantri] = useState(null);

// Ini API
//   useEffect(() => {
//     fetch("https://api.example.com/santri") // Ganti dengan endpoint API backend Anda
//       .then((response) => response.json())
//       .then((data) => setSantri(data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

  return (
    <div className="bblock">
      <h1 className="text-xl font-bold">Warga Pesantren</h1>
      <hr className="border-t border-gray-300 my-4" />
        {santri ? (
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="niup" className="block text-sm font-medium text-gray-700">
                  NIUP
                </label>
                <input
                  type="text"
                  id="niup"
                  name="niup"
                  value={santri.niup}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <legend className="block text-sm font-medium text-gray-700">Aktif</legend>
                <div className="flex items-center space-x-4 mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="true"
                      checked={santri.aktif === true}
                      disabled
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Ya</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="false"
                      checked={santri.aktif === false}
                      disabled
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Tidak</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <p className="text-gray-500">Memuat data...</p>
        )}
    </div>
  );
};

export default SantriDetail;
