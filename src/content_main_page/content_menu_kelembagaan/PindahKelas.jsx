import React, { useState } from "react";

const PindahKelas = () => {
  const [unitAsal, setUnitAsal] = useState("SMA");
  const [kelasAsal, setKelasAsal] = useState("XI 2");
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [unitTujuan, setUnitTujuan] = useState("");
  const [kelasTujuan, setKelasTujuan] = useState("");

  const dataSiswa = [
    { id: 1, nis: "0817", nama: "FAUZAN NUR AFIFUDIN", kelas: "XI 2" },
    { id: 2, nis: "0843", nama: "AHMAD ALFARABY SUGIARTO", kelas: "XI 2" },
    { id: 3, nis: "0848", nama: "ARTIKA PUTRI YULIASARI", kelas: "XI 2" },
  ];

  const handleSelectSiswa = (id) => {
    setSelectedSiswa((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!unitTujuan || !kelasTujuan) {
      alert("Silakan pilih unit dan kelas tujuan.");
      return;
    }

    // Simulasi submit
    alert(
      `Memindahkan siswa ID: ${selectedSiswa.join(
        ", "
      )} ke ${unitTujuan} - ${kelasTujuan}`
    );

    // Reset
    setSelectedSiswa([]);
    setUnitTujuan("");
    setKelasTujuan("");
  };

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT SIDE - FILTER + TABLE */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Daftar Siswa</h2>

        {/* FILTER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select className="border border-gray-300 px-4 py-2 rounded">
            <option value="">-- Pilih Lembaga --</option>
          </select>
          <select className="border border-gray-300 px-4 py-2 rounded">
            <option value="">-- Pilih Jurusan --</option>
          </select>
          <select className="border border-gray-300 px-4 py-2 rounded">
            <option value="">-- Pilih Kelas --</option>
          </select>
          <select className="border border-gray-300 px-4 py-2 rounded">
            <option value="">-- Pilih Rombel --</option>
          </select>
        </div>

        {/* TABLE */}
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 border-b text-center w-10">
                <input type="checkbox" />
              </th>
              <th className="px-3 py-2 border-b text-center w-10">No</th>
              <th className="px-3 py-2 border-b">NIS</th>
              <th className="px-3 py-2 border-b">Nama</th>
              <th className="px-3 py-2 border-b">Kelas</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {[ // Dummy data
              { nis: '0817', nama: 'FAUZAN NUR AFIFUDIN', kelas: 'XI 2' },
              { nis: '0843', nama: 'AHMAD ALFARABY SUGIARTO', kelas: 'XI 2' },
              { nis: '0848', nama: 'ARTIKA PUTRI YULIASARI', kelas: 'XI 2' }
            ].map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 text-center">
                <td className="px-3 py-2 border-b">
                  <input type="checkbox" />
                </td>
                <td className="px-3 py-2 border-b">{index + 1}</td>
                <td className="px-3 py-2 border-b">{item.nis}</td>
                <td className="px-3 py-2 border-b text-left">{item.nama}</td>
                <td className="px-3 py-2 border-b">{item.kelas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT SIDE - FORM TUJUAN */}
      <div className="w-[350px] bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pindahkan ke</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Lembaga Tujuan</label>
            <select className="border border-gray-300 w-full px-4 py-2 rounded">
              <option value="">-- Pilih Lembaga --</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Jurusan Tujuan</label>
            <select className="border border-gray-300 w-full px-4 py-2 rounded">
              <option value="">-- Pilih Jurusan --</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Kelas Tujuan</label>
            <select className="border border-gray-300 w-full px-4 py-2 rounded">
              <option value="">-- Pilih Kelas --</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Rombel Tujuan</label>
            <select className="border border-gray-300 w-full px-4 py-2 rounded">
              <option value="">-- Pilih Rombel --</option>
            </select>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-200">
          Proses Pindah
        </button>
      </div>
    </div>
  );
};

export default PindahKelas;
