"use client"

import { useMemo } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faArrowRight,
    faUsers,
    faUserGraduate,
    faUserTie,
    faUserShield,
    faClock,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { Link, Navigate } from "react-router-dom"
import useFetchSantri from "../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Santri"
import useFetchKhadam from "../hooks/hooks_menu_data_pokok/Khadam"
import useFetchAlumni from "../hooks/hooks_menu_data_pokok/Alumni"
import useFetchWaliAsuh from "../hooks/hooks_menu_kewaliasuhan/WaliAsuh"
import useFetchPerizinan from "../hooks/hook_menu_kepesantrenan/Perizinan"
import { hasAccess } from "../utils/hasAccess"

const Dashboard = () => {
    const filtersPerizinanDMI = useMemo(() => ({ status: "sudah berada diluar pondok" }), [])
    const filtersPerizinanTBK = useMemo(() => ({ status: "telat(belum kembali)" }), [])
    const { loadingSantri, totalDataSantri } = useFetchSantri()
    const { loadingKhadam, totalDataKhadam } = useFetchKhadam()
    const { loadingAlumni, totalDataAlumni } = useFetchAlumni()
    const { loadingWaliAsuh, totalDataWaliAsuh } = useFetchWaliAsuh()
    const { loading: loadingPerizinanDMI, totalData: totalDataPerizinanDMI } = useFetchPerizinan(filtersPerizinanDMI)
    const { loading: loadingPerizinanTBK, totalData: totalDataPerizinanTBK } = useFetchPerizinan(filtersPerizinanTBK)

    const LoadingSpinner = () => {
        return (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
        )
    }

    const stats = [
        {
            label: "Total Santri",
            value: loadingSantri ? <LoadingSpinner /> : totalDataSantri,
            gradient: "from-emerald-400 to-emerald-600",
            icon: faUsers,
            link: "/santri",
            description: "Jumlah santri aktif",
        },
        {
            label: "Total Wali Asuh",
            value: loadingWaliAsuh ? <LoadingSpinner /> : totalDataWaliAsuh,
            gradient: "from-blue-400 to-blue-600",
            icon: faUserShield,
            link: "/wali-asuh",
            description: "Wali asuh terdaftar",
        },
        {
            label: "Total Khadam",
            value: loadingKhadam ? <LoadingSpinner /> : totalDataKhadam,
            gradient: "from-purple-400 to-purple-600",
            icon: faUserTie,
            link: "/khadam",
            description: "Khadam aktif",
        },
        {
            label: "Total Alumni",
            value: loadingAlumni ? <LoadingSpinner /> : totalDataAlumni,
            gradient: "from-indigo-400 to-indigo-600",
            icon: faUserGraduate,
            link: "/alumni",
            description: "Alumni terdaftar",
        },
        {
            label: "Dalam Masa Izin",
            value: loadingPerizinanDMI ? <LoadingSpinner /> : totalDataPerizinanDMI,
            gradient: "from-amber-400 to-orange-500",
            icon: faClock,
            link: "/perizinan?status=sudah%20berada%20diluar%20pondok",
            description: "Santri sedang izin",
        },
        {
            label: "Telat Belum Kembali",
            value: loadingPerizinanTBK ? <LoadingSpinner /> : totalDataPerizinanTBK,
            gradient: "from-red-400 to-red-600",
            icon: faExclamationTriangle,
            link: "/perizinan?status=telat(belum%20kembali)",
            description: "Perlu perhatian khusus",
        },
    ]

    if (!hasAccess("dashboard")) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                    <p className="text-gray-600 text-lg">Selamat datang di sistem manajemen pesantren</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Welcome Card */}
                {/* <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ringkasan Data Pesantren</h2>
                            <p className="text-gray-600">Pantau statistik dan data penting pesantren Anda</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20"
                        >
                            {/* Gradient Background */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                            ></div>

                            {/* Card Content */}
                            <div className="relative p-6">
                                {/* Icon and Value */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                                    >
                                        <FontAwesomeIcon icon={stat.icon} className="text-xl text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                                    </div>
                                </div>

                                {/* Label and Description */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</h3>
                                    <p className="text-sm text-gray-500">{stat.description}</p>
                                </div>

                                {/* Action Button */}
                                <Link
                                    to={stat.link}
                                    className={`w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r ${stat.gradient} text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] group-hover:shadow-xl`}
                                >
                                    <span>Lihat Detail</span>
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full"></div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions Section */}
                {/* <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/formulir"
              className="flex items-center p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div>
                <div className="font-medium">Tambah Data</div>
                <div className="text-sm opacity-90">Formulir baru</div>
              </div>
            </Link>

            <Link
              to="/laporan"
              className="flex items-center p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
              <div>
                <div className="font-medium">Laporan</div>
                <div className="text-sm opacity-90">Data & statistik</div>
              </div>
            </Link>

            <Link
              to="/pengaturan"
              className="flex items-center p-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUserTie} />
              </div>
              <div>
                <div className="font-medium">Pengaturan</div>
                <div className="text-sm opacity-90">Konfigurasi sistem</div>
              </div>
            </Link>
          </div>
        </div> */}
            </div>
        </div>
    )
}

export default Dashboard
