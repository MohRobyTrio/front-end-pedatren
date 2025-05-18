import { useState } from "react";

const TabSantri = () => {
    const [endDate, setEndDate] = useState("");

    return (
        <div className="block" id="santri">
            <h1 className="text-xl font-bold">Status Santri</h1>
            <div className="mt-5">
                {/* <div className="bg-white shadow-md rounded-lg p-6"> */}
                <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 inline-flex items-center space-x-4 shadow-md p-4 w-fit max-w-max rounded-lg">
                        <div>
                            <h5 className="text-lg font-bold">2020712450</h5>
                            <p className="text-gray-600 text-sm">Sejak 25 Agu 2020 Sampai Sekarang</p>
                        </div>
                        {/* <button type="button" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none">
                            Cetak Ikrar
                        </button> */}
                    </div>
                    <br />
                    <div>
                        <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                            Nomor Induk Santri
                        </label>
                        <input
                            type="text"
                            id="nis"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value="2020712450"
                            disabled
                        />
                    </div>

                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            Tanggal Akhir
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
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
        </div>
    );
};

export default TabSantri;
