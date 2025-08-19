"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faUsers,
  faUserGraduate,
  faUserTie,
  faUserShield,
  faClock,
  faExclamationTriangle,
  faChartLine,
  faRotateRight, // Added refresh icon
} from "@fortawesome/free-solid-svg-icons"
import { Link, Navigate } from "react-router-dom"
import { hasAccess } from "../utils/hasAccess"
import { API_BASE_URL } from "../hooks/config"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  const refreshData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}dashboard`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("Gagal fetch dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    )
  }

  const stats = [
    // Students Category - Blue theme
    {
      label: "Peserta Didik",
      value: loading ? <LoadingSpinner /> : data?.peserta_didik || 267,
      color: "blue",
      icon: faUsers,
      link: "/peserta-didik",
      description: "Total peserta didik aktif",
      category: "students",
    },
    {
      label: "Santri",
      value: loading ? <LoadingSpinner /> : data?.santri || 170,
      color: "blue",
      icon: faUsers,
      link: "/santri",
      description: "Santri yang sedang mondok",
      category: "students",
    },
    {
      label: "Pelajar",
      value: loading ? <LoadingSpinner /> : data?.pelajar || 177,
      color: "blue",
      icon: faUserGraduate,
      link: "/pelajar",
      description: "Pelajar terdaftar",
      category: "students",
    },
    {
      label: "Alumni",
      value: loading ? <LoadingSpinner /> : data?.alumni || 68,
      color: "blue",
      icon: faUserGraduate,
      link: "/alumni",
      description: "Alumni terdaftar",
      category: "students",
    },

    // Staff Category - Emerald theme
    {
      label: "Pegawai",
      value: loading ? <LoadingSpinner /> : data?.pegawai || 92,
      color: "emerald",
      icon: faUserTie,
      link: "/pegawai",
      description: "Total pegawai aktif",
      category: "staff",
    },
    {
      label: "Pengajar",
      value: loading ? <LoadingSpinner /> : data?.pengajar || 50,
      color: "emerald",
      icon: faUserTie,
      link: "/pengajar",
      description: "Tenaga pengajar",
      category: "staff",
    },
    {
      label: "Pengurus",
      value: loading ? <LoadingSpinner /> : data?.pengurus || 50,
      color: "emerald",
      icon: faUserShield,
      link: "/pengurus",
      description: "Pengurus pesantren",
      category: "staff",
    },
    {
      label: "Wali Kelas",
      value: loading ? <LoadingSpinner /> : data?.wali_kelas || 50,
      color: "emerald",
      icon: faUserShield,
      link: "/wali-kelas",
      description: "Wali kelas aktif",
      category: "staff",
    },
    {
      label: "Karyawan",
      value: loading ? <LoadingSpinner /> : data?.karyawan || 50,
      color: "emerald",
      icon: faUserTie,
      link: "/karyawan",
      description: "Karyawan operasional",
      category: "staff",
    },
    {
      label: "Khadam",
      value: loading ? <LoadingSpinner /> : data?.khadam || 22,
      color: "emerald",
      icon: faUserTie,
      link: "/khadam",
      description: "Khadam pesantren",
      category: "staff",
    },

    // Guardians Category - Amber theme
    {
      label: "Wali Asuh",
      value: loading ? <LoadingSpinner /> : data?.wali_asuh || 11,
      color: "amber",
      icon: faUserShield,
      link: "/wali-asuh",
      description: "Wali asuh terdaftar",
      category: "guardians",
    },
    {
      label: "Orang Tua",
      value: loading ? <LoadingSpinner /> : data?.orang_tua || 534,
      color: "amber",
      icon: faUsers,
      link: "/orang-tua",
      description: "Data orang tua santri",
      category: "guardians",
    },
    {
      label: "Wali",
      value: loading ? <LoadingSpinner /> : data?.wali || 267,
      color: "amber",
      icon: faUserShield,
      link: "/wali",
      description: "Wali murid terdaftar",
      category: "guardians",
    },

    // Alerts Category - Red theme
    {
      label: "Dalam Masa Izin",
      value: loading ? <LoadingSpinner /> : data?.dalam_masa_izin || 5,
      color: "orange",
      icon: faClock,
      link: "/perizinan?status=sudah%20berada%20diluar%20pondok",
      description: "Santri sedang izin keluar",
      category: "alerts",
    },
    {
      label: "Telat Belum Kembali",
      value: loading ? <LoadingSpinner /> : data?.telat_belum_kembali || 0,
      color: "red",
      icon: faExclamationTriangle,
      link: "/perizinan?status=telat(belum%20kembali)",
      description: "Memerlukan tindak lanjut",
      category: "alerts",
    },
  ]

  const groupedStats = {
    students: stats.filter((stat) => stat.category === "students"),
    staff: stats.filter((stat) => stat.category === "staff"),
    guardians: stats.filter((stat) => stat.category === "guardians"),
    alerts: stats.filter((stat) => stat.category === "alerts"),
  }

  const categoryConfig = {
    students: {
      title: "Data Siswa",
      icon: faUsers,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconBg: "bg-blue-100",
    },
    staff: {
      title: "Data Staff",
      icon: faUserTie,
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    guardians: {
      title: "Data Wali",
      icon: faUserShield,
      color: "amber",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      iconBg: "bg-amber-100",
    },
    alerts: {
      title: "Status & Peringatan",
      icon: faExclamationTriangle,
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconBg: "bg-red-100",
    },
  }

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-500",
        hover: "hover:bg-blue-600",
        text: "text-blue-600",
        border: "border-blue-200",
        accent: "bg-blue-500",
      },
      emerald: {
        bg: "bg-emerald-500",
        hover: "hover:bg-emerald-600",
        text: "text-emerald-600",
        border: "border-emerald-200",
        accent: "bg-emerald-500",
      },
      amber: {
        bg: "bg-amber-500",
        hover: "hover:bg-amber-600",
        text: "text-amber-600",
        border: "border-amber-200",
        accent: "bg-amber-500",
      },
      orange: {
        bg: "bg-orange-500",
        hover: "hover:bg-orange-600",
        text: "text-orange-600",
        border: "border-orange-200",
        accent: "bg-orange-500",
      },
      red: {
        bg: "bg-red-500",
        hover: "hover:bg-red-600",
        text: "text-red-600",
        border: "border-red-200",
        accent: "bg-red-500",
      },
    }
    return colorMap[color] || colorMap.blue
  }

  if (!hasAccess("dashboard")) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <div className="flex-1 pl-6 pt-6 pb-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faChartLine} className="text-2xl text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-xl text-slate-600 mt-2">Sistem Manajemen Pesantren</p>
              </div>
            </div>
            {/* <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                Pantau dan kelola seluruh data pesantren dalam satu platform terpadu
                </p> */}
          </div>

          <div className="flex flex-col items-end gap-4">
            <button
              onClick={refreshData}
              disabled={loading}
              className="group flex items-center gap-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon
                icon={faRotateRight}
                className={`text-sm transition-transform duration-300 ${loading ? "animate-spin" : "group-hover:rotate-180"}`}
              />
              <span className="font-semibold">{loading ? "Memuat..." : "Refresh Data"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {Object.entries(groupedStats).map(([category, categoryStats]) => {
          const config = categoryConfig[category]
          return (
            <div key={category} className="space-y-8">
              <div className={`${config.bgColor} rounded-2xl p-5 border border-gray-100`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${config.iconBg} rounded-lg flex items-center justify-center`}>
                      <FontAwesomeIcon icon={config.icon} className={`text-sm ${config.textColor}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{config.title}</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{categoryStats.length} kategori</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {categoryStats.map((stat, index) => {
                  const colors = getColorClasses(stat.color)
                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center shadow-sm`}
                          >
                            <FontAwesomeIcon icon={stat.icon} className="text-xl text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                            <div className={`w-8 h-1 ${colors.accent} rounded-full ml-auto`}></div>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{stat.label}</h3>
                          <p className="text-slate-500 leading-relaxed">{stat.description}</p>
                        </div>

                        <Link
                          to={stat.link}
                          className="group/btn w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-2xl font-semibold transition-all duration-200 border border-slate-100 hover:border-slate-200"
                        >
                          <span>Lihat Detail</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="transition-transform duration-200 group-hover/btn:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
