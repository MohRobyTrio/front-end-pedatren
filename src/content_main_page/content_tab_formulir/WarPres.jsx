// const WarPres = () => {
//     return (
//         <h1 className="text-xl font-bold">Warga Pesantren</h1>
        
//     )
// };

// export default WarPres;

import React, { useState } from "react";

const WargaPesantrenForm = () => {
  const [niup, setNiup] = useState("12020511625");
  const [status, setStatus] = useState(1);

  return (
    <>
      <h1 className="text-xl font-bold">Warga Pesantren</h1>
      <hr className="border-t border-gray-300 my-4" />
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">NIUP</label>
        <input
          type="text"
          value={niup}
          onChange={(e) => setNiup(e.target.value)}
          className="mt-1 block p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Aktif</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="1"
              checked={status === 1}
              onChange={() => setStatus(1)}
              className="mr-2"
            />
            Ya
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="0"
              checked={status === 0}
              onChange={() => setStatus(0)}
              className="mr-2"
            />
            Tidak
          </label>
        </div>
      </div>
    </>
  );
};

export default WargaPesantrenForm;
