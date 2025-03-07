import { useState, useEffect } from "react";

const PresensiPegawai = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filterLembaga, setFilterLembaga] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [filterEntitas, setFilterEntitas] = useState("");

    useEffect(() => {
        fetch("https://api.example.com/presensi-pegawai")
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);


    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Presensi Pegawai</h1>
                <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                        <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
                            Rekap
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Lembaga</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Pilih Jenis Kelamin</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Entitas</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>25</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span>Total data 213</span>
                    <input
                        className="border border-gray-300 rounded p-2"
                        placeholder="Cari..."
                        type="text"
                    />
                </div>
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border p-2">Info</th>
                            <th className="border p-2">Presensi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} className="border">
                                    <td className="border p-2">{item.info}</td>
                                    <td className="border p-2">{item.presensi}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center p-4">Total data 0</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                    <button className="border p-2">Previous</button>
                    <button className="border p-2">Next</button>
                </div>
            </div>
        </div>

    )
}

export default PresensiPegawai;