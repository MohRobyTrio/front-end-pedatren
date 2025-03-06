// const Pendidikan = () => {
//     return (
//         <h1 className="text-xl font-bold">Pendidikan</h1>
//     )
// };

// export default Pendidikan;

import { useState, useEffect } from "react";

const TabPendidikan = () => {
  const [formData, setFormData] = useState({
    lembaga: "UNUJA",
    jurusan: "S1 Informatika (IF)",
    kelas: "",
    rombel: "",
    noInduk: "2021400289",
    tglMulai: "2020-09-13",
    tglAkhir: "",
  });

  const [kelasOptions, setKelasOptions] = useState([]);
  const [rombelOptions, setRombelOptions] = useState([]);

//   useEffect(() => {
//     // Fetch data from API
//     fetch("https://api.example.com/pendidikan")
//       .then((response) => response.json())
//       .then((data) => {
//         setKelasOptions(data.kelas);
//         setRombelOptions(data.rombel);
//       });
//   }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="block" id="Pendidikan">
      <h1 className="text-xl font-bold">Pendidikan</h1>
      <hr className="border-t border-gray-300 my-4" />
      {/* <div className="border p-4 rounded-lg shadow-md bg-white"> */}
        <h3 className="text-xl font-semibold">{formData.lembaga} - {formData.jurusan}</h3>
        <p className="text-gray-600">{formData.noInduk} . Sejak {formData.tglMulai} Sampai Sekarang</p>
        <br />
        <form className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Lembaga</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option>{formData.lembaga}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium">Jurusan</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option>{formData.jurusan}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Kelas</label>
              <select name="kelas" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}>
                <option value="">Pilih Kelas</option>
                {kelasOptions.map((kelas) => (
                  <option key={kelas} value={kelas}>{kelas}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Rombel</label>
              <select name="rombel" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}>
                <option value="">Pilih Rombel</option>
                {rombelOptions.map((rombel) => (
                  <option key={rombel} value={rombel}>{rombel}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">No. Induk</label>
              <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.noInduk} readOnly disabled />
            </div>
            
            <div>
              <label className="block text-sm font-medium">Tanggal Mulai</label>
              <input type="date" name="tglMulai" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.tglMulai} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium">Tanggal Akhir</label>
              <input type="date" name="tglAkhir" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.tglAkhir} onChange={handleChange} />
            </div>
          </div>

            <div>
                <label className="block text-sm font-medium text-gray-700"></label>
                <button type="button" className="mt-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none">
                    Batal
                </button>
            </div>
        </form>
      </div>
    // </div>
  );
};

export default TabPendidikan;
