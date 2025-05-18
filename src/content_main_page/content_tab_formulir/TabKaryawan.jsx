// const TabKaryawan = () => {
//     return (
//         <>
//         <h1 className="text-xl font-bold">Karyawan</h1>
//         <hr className="border-t border-gray-300 my-4" />
//         <h2 className="text-lg font-semibold mt-1">Kepala Sekolah</h2>
//         <p className="text-gray-600 text-sm mt-1"> di TPA Arrahmah, Sejak 1 Okt 2022 Sampai Sekarang</p>
//         </>
//     )
// };

// export default TabKaryawan;

import { useState } from "react";

const TabKaryawan = () => {
  const [riwayatKaryawan, setRiwayatKaryawan] = useState([
    {
      id: 1,
      jabatan_kontrak: "tetap",
      keterangan_jabatan: "Guru Mata Pelajaran",
      tanggal_masuk: "2020-07-16",
      tanggal_keluar: "2022-07-10",
      status: "aktif",
      golongan_jabatan_id: 2,
      lembaga_id: 43,
    },
    {
      id: 2,
      jabatan_kontrak: "kontrak",
      keterangan_jabatan: "Kepala Sekolah",
      tanggal_masuk: "2022-10-01",
      tanggal_keluar: null,
      status: "nonaktif",
      golongan_jabatan_id: 1,
      lembaga_id: 42,
    },
  ]);

  const [editData, setEditData] = useState(null);
  const [pindahData, setPindahData] = useState(null);
  const [keluarData, setKeluarData] = useState(null);
  const [tambahData, setTambahData] = useState(null);


  const golonganJabatanOptions = [
    { id: 1, nama: "Golongan I" },
    { id: 2, nama: "Golongan II" },
    { id: 3, nama: "Golongan III" },
  ];

  const lembagaOptions = [
    { id: 42, nama: "UNUJA" },
    { id: 43, nama: "Yayasan XYZ" },
  ];

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(tanggal).toLocaleDateString("id-ID", options);
  };

  const resetAllForms = () => {
  setEditData(null);
  setPindahData(null);
  setKeluarData(null);
  setTambahData(null);
  };

  const handleEdit = (id) => {
  resetAllForms();
  const selected = riwayatKaryawan.find((item) => item.id === id);
  setEditData({ ...selected });
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => setEditData(null);
  const handleCancelPindah = () => setPindahData(null);
  const handleCancelKeluar = () => setKeluarData(null);

  const handleSave = () => {
    setRiwayatKaryawan((prev) =>
      prev.map((item) => (item.id === editData.id ? { ...editData } : item))
    );
    setEditData(null);
  };

  const handlePindah = (id) => {
  resetAllForms();
  const old = riwayatKaryawan.find((item) => item.id === id);
  setPindahData({
      id: old.id,
      pegawai_id: 999, // dummy id, adjust as needed
      jabatan: old.jabatan_kontrak,
      keterangan_jabatan: old.keterangan_jabatan,
      golongan_jabatan_id: old.golongan_jabatan_id,
      lembaga_id: old.lembaga_id,
      tanggal_mulai: "",
    });
  };

const handleKeluar = (id) => {
  resetAllForms();
  const old = riwayatKaryawan.find((item) => item.id === id);
  setKeluarData({
      id: old.id,
      tanggal_selesai: "",
    });
  };

  const handleSavePindah = () => {
    alert("Karyawan dipindah: " + JSON.stringify(pindahData));
    setPindahData(null);
  };

  const handleSaveKeluar = () => {
    alert("Karyawan keluar: " + JSON.stringify(keluarData));
    setKeluarData(null);
  };

  return (
    <div className="bloc" id="Karyawan">
      <h1 className="text-xl font-bold">Karyawan</h1>
      <div className="mt-5"></div>
        <div className="flex justify-end mt-4">
            <button
            onClick={() => {
                resetAllForms();
                setTambahData({
                pegawai_id: 999,
                jabatan: "",
                keterangan_jabatan: "",
                golongan_jabatan_id: golonganJabatanOptions[0]?.id || 1,
                lembaga_id: lembagaOptions[0]?.id || 42,
                tanggal_mulai: "",
                });
            }}
            className="w-10 h-10 text-white bg-blue-600 rounded-full text-xl hover:bg-blue-700 flex items-center justify-center shadow-md"
            title="Tambah Karyawan"
            >
            +
            </button>
        </div>
      <div id="karyawanList" className="space-y-2">
        {riwayatKaryawan.map((item) => (
          <div
            key={item.id}
            className="relative bg-white shadow-md rounded-lg p-4 transition hover:bg-gray-50"
            onClick={() => handleEdit(item.id)}
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePindah(item.id);
                }}
                className="text-blue-500 hover:text-blue-700"
                title="Pindah Karyawan"
              >
                🔄
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleKeluar(item.id);
                }}
                className="text-red-500 hover:text-red-700"
                title="Keluarkan Karyawan"
              >
                ❌
              </button>
            </div>
            <h5 className="text-lg font-bold">{item.keterangan_jabatan}</h5>
            <p className="text-sm text-gray-700 capitalize">
              Jenis Jabatan: {item.jabatan_kontrak}
            </p>
            <p className="text-sm text-gray-700 capitalize">
              Status: {item.status}
            </p>
            <p className="text-gray-600">
              Sejak {formatTanggal(item.tanggal_masuk)} Sampai{" "}
              {item.tanggal_keluar
                ? formatTanggal(item.tanggal_keluar)
                : "Sekarang"}
            </p>
          </div>
        ))}
      </div>

      {/* Form Edit */}
      {editData && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Edit Riwayat Karyawan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Golongan Jabatan</label>
              <select
                name="golongan_jabatan_id"
                value={editData.golongan_jabatan_id}
                onChange={(e) => handleInputChange(e, setEditData)}
                className="w-full p-2 border rounded"
              >
                {golonganJabatanOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm">Lembaga</label>
              <select
                name="lembaga_id"
                value={editData.lembaga_id}
                onChange={(e) => handleInputChange(e, setEditData)}
                className="w-full p-2 border rounded"
              >
                {lembagaOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm">Jenis Jabatan</label>
              <input
                name="jabatan_kontrak"
                value={editData.jabatan_kontrak}
                onChange={(e) => handleInputChange(e, setEditData)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm">Keterangan</label>
              <input
                name="keterangan_jabatan"
                value={editData.keterangan_jabatan}
                onChange={(e) => handleInputChange(e, setEditData)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm">Tanggal Masuk</label>
              <input
                type="date"
                name="tanggal_masuk"
                value={editData.tanggal_masuk}
                onChange={(e) => handleInputChange(e, setEditData)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm">Tanggal Keluar</label>
              <input
                type="date"
                name="tanggal_keluar"
                value={editData.tanggal_keluar || ""}
                onChange={(e) => handleInputChange(e, setEditData)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm">Status</label>
              <select
                name="status"
                value={editData.status}
                onChange={(e) => handleInputChange(e, setEditData)}
                className="w-full p-2 border rounded"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Form Pindah */}
      {pindahData && (
        <div className="mt-6 bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Form Pindah Karyawan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Lembaga Baru</label>
              <select
                name="lembaga_id"
                value={pindahData.lembaga_id}
                onChange={(e) => handleInputChange(e, setPindahData)}
                className="w-full p-2 border rounded"
              >
                {lembagaOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm">Golongan Baru</label>
              <select
                name="golongan_jabatan_id"
                value={pindahData.golongan_jabatan_id}
                onChange={(e) => handleInputChange(e, setPindahData)}
                className="w-full p-2 border rounded"
              >
                {golonganJabatanOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm">Jabatan</label>
              <input
                name="jabatan"
                value={pindahData.jabatan}
                onChange={(e) => handleInputChange(e, setPindahData)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm">Keterangan Jabatan</label>
              <input
                name="keterangan_jabatan"
                value={pindahData.keterangan_jabatan}
                onChange={(e) => handleInputChange(e, setPindahData)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm">Tanggal Mulai</label>
              <input
                type="date"
                name="tanggal_mulai"
                value={pindahData.tanggal_mulai}
                onChange={(e) => handleInputChange(e, setPindahData)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSavePindah}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan Pindah
            </button>
            <button
              onClick={handleCancelPindah}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Form Keluar */}
      {keluarData && (
        <div className="mt-6 bg-red-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Form Keluar Karyawan</h2>
          <div>
            <label className="block text-sm">Tanggal Keluar</label>
            <input
              type="date"
              name="tanggal_selesai"
              value={keluarData.tanggal_selesai}
              onChange={(e) => handleInputChange(e, setKeluarData)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveKeluar}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Simpan Keluar
            </button>
            <button
              onClick={handleCancelKeluar}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}
      {tambahData && (
  <div className="mt-6 bg-green-100 p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-3">Form Tambah Karyawan</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm">Lembaga</label>
        <select
          name="lembaga_id"
          value={tambahData.lembaga_id}
          onChange={(e) => handleInputChange(e, setTambahData)}
          className="w-full p-2 border rounded"
        >
          {lembagaOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.nama}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Golongan Jabatan</label>
        <select
          name="golongan_jabatan_id"
          value={tambahData.golongan_jabatan_id}
          onChange={(e) => handleInputChange(e, setTambahData)}
          className="w-full p-2 border rounded"
        >
          {golonganJabatanOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.nama}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Jabatan</label>
        <input
          name="jabatan"
          value={tambahData.jabatan}
          onChange={(e) => handleInputChange(e, setTambahData)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Keterangan Jabatan</label>
        <input
          name="keterangan_jabatan"
          value={tambahData.keterangan_jabatan}
          onChange={(e) => handleInputChange(e, setTambahData)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Tanggal Mulai</label>
        <input
          type="date"
          name="tanggal_mulai"
          value={tambahData.tanggal_mulai}
          onChange={(e) => handleInputChange(e, setTambahData)}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <button
        onClick={() => {
          alert("Tambah karyawan: " + JSON.stringify(tambahData));
          setTambahData(null);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Simpan
      </button>
      <button
        onClick={() => setTambahData(null)}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        Batal
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default TabKaryawan;