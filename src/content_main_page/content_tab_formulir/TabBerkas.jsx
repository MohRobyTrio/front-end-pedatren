import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";

const TabBerkas = () => {
  const [berkas, setBerkas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBerkas();
  }, []);

  const fetchBerkas = async () => {
    try {
      const response = await fetch(
        "https://0708-103-147-134-167.ngrok-free.app/api/v1/1/berkas",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.json();
      setBerkas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold">Berkas</h1>
      <p className="text-gray-500 text-sm italic mt-1">
        *Berkas berupa ekstensi gambar (JPG/PNG), yang memuat lembar scan KK, KTP, Ijazah, Sertifikat, dll
      </p>
      <hr className="border-t border-gray-300 my-4" />

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : berkas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {berkas.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 relative">
              <span className="absolute top-2 left-2 bg-purple-300 text-purple-800 px-2 py-1 text-xs font-bold rounded">
                Berkas
              </span>
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  download
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                  <FaDownload size={18} />
                </a>
              )}
              {item.fileUrl ? (
                <img
                  src={item.fileUrl}
                  alt={item.nama || "Berkas"}
                  className="w-full h-40 object-cover rounded mt-4"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-500">
                  Tidak ada gambar
                </div>
              )}
              <p className="text-sm text-gray-700 mt-2">{item.nama || "*tanpa deskripsi"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Tidak ada berkas tersedia</p>
      )}
    </>
  );
};

export default TabBerkas;
