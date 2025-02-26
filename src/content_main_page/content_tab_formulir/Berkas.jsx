// const Berkas = () => {
//     return (
//         <h1 className="text-xl font-bold">Berkas</h1>
//     )
// };

// export default Berkas;

import { useEffect, useState } from "react";

const BerkasSection = () => {
  const [files, setFiles] = useState([]);


//Ini API
//   useEffect(() => {
//     // Gantilah URL ini dengan endpoint API backend Anda
//     fetch("https://api.example.com/berkas")
//       .then((response) => response.json())
//       .then((data) => setFiles(data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

  return (
    <div id="berkas" className="block">
      <h1 className="text-xl font-bold">Berkas</h1>
      <p className="text-gray-500 text-sm italic mt-1">
        *Berkas berupa ekstensi gambar (JPG/PNG), yang memuat lembar scan KK,
        KTP, Ijazah, Sertifikat, dll
      </p>
      <hr className="border-t border-gray-300 my-4" />
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        {files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center gap-4 p-2 bg-white shadow rounded-md">
                <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm">{file.type}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada berkas yang tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default BerkasSection;
