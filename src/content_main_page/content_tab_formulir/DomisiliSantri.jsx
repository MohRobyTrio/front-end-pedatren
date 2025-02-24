const DomisiliSantri = () => {
    return (
        <>
        <h2 className="text-xl font-bold mb-4">Domisili Santri</h2>
            <div className="mb-4">{/* Domisili Santri Details */}</div>
            <div>
              <h2 className="text-xl font-bold mb-4">Wilayah</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700" htmlFor="wilayah">
                    Wilayah
                  </label>
                  <select className="w-full mt-1 p-2 border rounded" id="wilayah">
                    <option>Wilayah Syekh Jumadil Kubro (01)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700" htmlFor="blok">
                    Blok
                  </label>
                  <select className="w-full mt-1 p-2 border rounded" id="blok">
                    <option>Daerah Ibnu Arabi (E)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700" htmlFor="kamar">
                    Kamar
                  </label>
                  <select className="w-full mt-1 p-2 border rounded" id="kamar">
                    <option>E.9</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-gray-700"
                    htmlFor="nomor-induk-santri"
                  >
                    Nomor Induk Santri
                  </label>
                  <input
                    className="w-full mt-1 p-2 border rounded"
                    id="nomor-induk-santri"
                    type="text"
                    defaultValue="2002712450"
                  />
                </div>
                <div>
                  <label className="block text-gray-700" htmlFor="waktu-mulai">
                    Waktu Mulai
                  </label>
                  <input
                    className="w-full mt-1 p-2 border rounded"
                    id="waktu-mulai"
                    type="text"
                    defaultValue="08/25/2020 09:33:47 AM"
                  />
                </div>
                <div>
                  <label className="block text-gray-700" htmlFor="waktu-akhir">
                    Waktu Akhir
                  </label>
                  <input
                    className="w-full mt-1 p-2 border rounded"
                    id="waktu-akhir"
                    type="text"
                    defaultValue="11/20/2020 09:03 PM"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Batal
                </button>
              </div>
            </div>
          </>
    )
}

export default DomisiliSantri;