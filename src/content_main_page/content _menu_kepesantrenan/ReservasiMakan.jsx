import React, { useState, useEffect } from "react";
import axios from "axios";


const ReservasiMakan = () => {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("https://your-api-endpoint.com/api/reservasi-makan");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const filteredData = data.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Reservasi Makan</h1>
                <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                        <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
                            Export
                        </button>
                        <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
                            Statistik
                        </button>
                        <button className="border border-blue-500 text-white bg-blue-500 px-4 py-1 rounded-md hover:bg-blue-600 cursor-pointer">
                            Rekapan
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4 p-4 border rounded">
                    <p className="font-bold">27 Nov 2024</p>
                    <hr className="border-t border-gray-300 my-4" />
                    <p>PAGI</p>
                </div>

                <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Wilayah</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Jurusan</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Pilih Jenis Kelamin</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Blok</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kelas</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Status</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kamar</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Rombel</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Lembaga</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>25</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <input className="border border-gray-300 rounded p-2 w-full sm:w-auto" placeholder="Cari Santri..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">No</th>
                            <th className="border p-2">NIS</th>
                            <th className="border p-2">Nama</th>
                            <th className="border p-2">Kamar</th>
                            <th className="border p-2">Blok</th>
                            <th className="border p-2">Wilayah</th>
                            <th className="border p-2">Angkatan</th>
                            <th className="border p-2">Lembaga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={item.nis} className="text-center">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{item.nis}</td>
                                <td className="border p-2">{item.nama}</td>
                                <td className="border p-2">{item.kamar}</td>
                                <td className="border p-2">{item.blok}</td>
                                <td className="border p-2">{item.wilayah}</td>
                                <td className="border p-2">{item.angkatan}</td>
                                <td className="border p-2">{item.lembaga}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ReservasiMakan;