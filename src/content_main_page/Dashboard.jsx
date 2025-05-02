import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useFetchPeserta from "../hooks/hooks_menu_data_pokok/PesertaDidik";
import { Link } from "react-router-dom";
import useFetchPengajar from "../hooks/hooks_menu_data_pokok/Pengajar";
import useFetchSantri from "../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Santri";
import useFetchPelajar from "../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Pelajar";
import useFetchKhadam from "../hooks/hooks_menu_data_pokok/Khadam";
import useFetchAlumni from "../hooks/hooks_menu_data_pokok/Alumni";
import useFetchOrangtua from "../hooks/hooks_menu_data_pokok/Orangtua";

const Dashboard = () => {
    const { loadingPesertaDidik, totalDataPesertaDidik } = useFetchPeserta();
    const { loadingPengajar, totalDataPengajar } = useFetchPengajar();
    const { loadingSantri, totalDataSantri } = useFetchSantri();
    const { loadingPelajar, totalDataPelajar } = useFetchPelajar();
    const { loadingKhadam, totalDataKhadam } = useFetchKhadam();
    const { loadingAlumni, totalDataAlumni } = useFetchAlumni();
    const { loadingOrangtua, totalDataOrangtua } = useFetchOrangtua();

    const Load = () => {
        return (
            <div className="col-span-3 flex justify-left items-left p-1">
                <i className="fas fa-spinner fa-spin text-2xl text-white"></i>
            </div>
        )
    }

    const stats = [
        { label: "Total Peserta Didik", value: loadingPesertaDidik ? <Load /> : totalDataPesertaDidik, color: "bg-green-500", icon: "📝", link: "/peserta-didik" },
        { label: "Total Santri", value: loadingSantri ? <Load /> : totalDataSantri, color: "bg-yellow-500", icon: "👥", link: "/peserta-didik/santri" },
        { label: "Total Pelajar", value: loadingPelajar ? <Load /> : totalDataPelajar, color: "bg-red-500", icon: "📚", link: "/peserta-didik/pelajar" },
        { label: "Total Wali Asuh", value: 0, color: "bg-blue-500", icon: "📖", link: "/wali-asuh" },
        { label: "Total Pengajar", value: loadingPengajar ? <Load /> : totalDataPengajar, color: "bg-gray-500", icon: "👨‍🏫", link: "/pengajar" },
        { label: "Total Pengurus", value: 0, color: "bg-pink-500", icon: "✍️", link: "/pengurus" },
        { label: "Total Karyawan", value: 0, color: "bg-green-700", icon: "👨🏻‍💻", link: "/peserta-didik" },
        { label: "Total Pegawai", value: 0, color: "bg-yellow-700", icon: "👨‍💼", link: "/karyawan" },
        { label: "Total Khadam", value: loadingKhadam ? <Load /> : totalDataKhadam, color: "bg-red-700", icon: "👳", link: "/khadam" },
        { label: "Total Alumni", value: loadingAlumni ? <Load /> : totalDataAlumni, color: "bg-blue-700", icon: "🎓", link: "/alumni" },
        { label: "Total Orang Tua", value: loadingOrangtua ? <Load /> : totalDataOrangtua, color: "bg-purple-500", icon: "👨‍👨‍👦", link: "/orang-tua" },
        { label: "Total Wali", value: 0, color: "bg-indigo-500", icon: "🔢", link: "/wali" },
        { label: "Dalam Masa Izin", value: 0, color: "bg-orange-500", icon: "⏳", link: "/perizinan" },
        { label: "Telat Belum Kembali", value: 0, color: "bg-red-400", icon: "🚨", link: "/pelanggaran" },
    ];

    const [birthdays, setBirthdays] = useState([]);

    useEffect(() => {
        axios.get("")
            .then(response => {
                const today = new Date().toISOString().split("T")[0]; // Ambil tanggal hari ini (YYYY-MM-DD)
                const filteredData = response.data.filter(person => person.birthday === today);
                setBirthdays(filteredData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap items-center mb-4">
                    <div className="w-full min-h-screen">

                        {/* Kartu Statistik */}
                        <div className="grid grid-cols-1 [@media(min-width:714px)]:grid-cols-2 [@media(min-width:910px)]:grid-cols-3 grid-cols-custom gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className={`p-4 rounded-lg shadow-lg text-white ${stat.color}`}>
                                    <div className="text-4xl">{stat.icon}</div>
                                    <h2 className="text-lg font-semibold">{stat.value}</h2>
                                    <p>{stat.label}</p>
                                    {/* Tombol Selengkapnya dengan Ikon Panah */}
                                    <Link
                                        to={stat.link}
                                        // onClick={() => navigate(stat.link)}
                                        className="mt-3 flex justify-between items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition w-full cursor-pointer"
                                    >
                                        <span>Selengkapnya</span> <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <br />

                        {/* Tabel Ulang Tahun */}
                        <h2 className="text-2xl font-semibold mt-6">Ulang Tahun Hari Ini</h2>
                        {/* <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md"> */}
                            <table className="w-full border-collapse border border-gray-300 mt-2">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">#</th>
                                        <th className="border p-2">NIK</th>
                                        <th className="border p-2">Nama</th>
                                        <th className="border p-2">Jenis Kelamin</th>
                                        <th className="border p-2">Tanggal Lahir</th>
                                        <th className="border p-2">Alamat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {birthdays.length > 0 ? (
                                        birthdays.map((person, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="border p-2">{index + 1}</td>
                                                <td className="border p-2">{person.nik}</td>
                                                <td className="border p-2">{person.name}</td>
                                                <td className="border p-2">{person.gender}</td>
                                                <td className="border p-2">{person.birthday}</td>
                                                <td className="border p-2">{person.location}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="border p-2 text-center">Tidak ada yang ulang tahun hari ini</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default Dashboard;