const TabDomisiliSantri = () => {
  return (
      <div className="">
         <h1 className="text-xl font-bold">Domisili Santri</h1>
         <div className="mt-5"></div>
          {/* <div className="bg-white rounded-lg p-6"> */}
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="wilayah">
                          Wilayah
                      </label>
                      <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" id="wilayah">
                          <option>Wilayah Syekh Jumadil Kubro (01)</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="blok">
                          Blok
                      </label>
                      <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" id="blok">
                          <option>Daerah Ibnu Arabi (E)</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="kamar">
                          Kamar
                      </label>
                      <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" id="kamar">
                          <option>E.9</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="nomor-induk-santri">
                          Nomor Induk Santri
                      </label>
                      <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" id="nomor-induk-santri" type="text" defaultValue="2002712450" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="waktu-mulai">
                          Waktu Mulai
                      </label>
                      <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" id="waktu-mulai" type="text" defaultValue="08/25/2020 09:33:47 AM" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700" htmlFor="waktu-akhir">
                          Waktu Akhir
                      </label>
                      <input className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" id="waktu-akhir" type="text" defaultValue="11/20/2020 09:03 PM" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700"></label>
                    <button type="button" className="mt-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none">
                        Batal
                    </button>
                </div>
              </form>
              
          {/* </div> */}
      </div>
  );
}

export default TabDomisiliSantri;
