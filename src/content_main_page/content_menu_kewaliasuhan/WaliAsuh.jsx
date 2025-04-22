import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faFilter,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

const filters = [
  "Negara", "Wilayah", "Lembaga", "Jenis Kelamin", "Status", "Provinsi",
  "Blok", "Jurusan", "Kelas", "Angkatan", "Kabupaten", "Kamar",
  "Jenis Wali", "Rombel"
];

const sampleData = [
  {
    name: "Sayyidah Aulia Ul Haqqu",
    nis: "2020211072",
    angkatan: "2020 - Kab. Bondowoso",
    image: "https://via.placeholder.com/100x120?text=Foto",
  },
  {
    name: "Nadwatul Ulya",
    nis: "2120813412",
    angkatan: "2021 - Kab. Probolinggo",
    image: "https://via.placeholder.com/100x120?text=Foto",
  },
  // ...data lainnya
];

const WaliAsuh = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex-1 px-4 py-6 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Data Wali Asuh</h1>
        <nav className="text-sm text-gray-500 mt-1">Kewaliasuhan / Wali Asuh</nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filters.map((f) => (
            <select
              key={f}
              className="border border-gray-300 text-sm rounded-md px-2 py-1"
            >
              <option value="">{`Semua ${f}`}</option>
            </select>
          ))}

          <input
            type="text"
            placeholder="Smartcard"
            className="border border-gray-300 text-sm rounded-md px-2 py-1"
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border border-gray-300 text-sm rounded-md px-2 py-1"
          />
        </div>

        <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <select className="border border-gray-300 text-sm rounded-md px-2 py-1">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="text-sm text-gray-600">Total data: 552</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-2 top-2.5 text-gray-400"
              />
              <input
                type="text"
                className="pl-8 pr-2 py-1 text-sm border rounded-md"
                placeholder="Cari Wali Asuh ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded-md text-sm">
              <FontAwesomeIcon icon={faTh} />
            </button>
            <button className="bg-green-100 hover:bg-green-200 text-green-600 px-2 py-1 rounded-md text-sm">
              <FontAwesomeIcon icon={faFilter} />
            </button>
          </div>
        </div>
              {/* Kartu Data */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sampleData
          .filter(d =>
            d.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((d, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 text-sm">
                <h2 className="font-semibold">{d.name}</h2>
                <p>NIS: {d.nis}</p>
                <p>Angkatan: {d.angkatan}</p>
              </div>
            </div>
          ))}
      </div>
      </div>


    </div>
  );
};

export default WaliAsuh;
