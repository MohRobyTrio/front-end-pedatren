"use client"

import { useState } from "react"
import {
  FaQuran,
  FaScroll,
  FaPray,
  FaPlus,
  FaList,
  FaBars,
  FaTimes,
  FaUser,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa"
// import { getRolesString } from "./utils/getRolesString"

const UstadzDashboard = () => {
  const [activeModule, setActiveModule] = useState("tahfidz")
  const [activeView, setActiveView] = useState("list") // list, add, edit
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)

  // User data
  const userName = localStorage.getItem("name") || sessionStorage.getItem("name") || "Ustadz"
//   const userRole = getRolesString()

  // Mock data for each module
  const [tahfidzData, setTahfidzData] = useState([
    {
      id: 1,
      student: "Ahmad Fauzi",
      nis: "2024001",
      date: "2024-12-08",
      surah: "Al-Fatihah",
      verses: "1-7",
      type: "baru",
      grade: "lancar",
      status: "tuntas",
    },
    {
      id: 2,
      student: "Fatimah Zahra",
      nis: "2024002",
      date: "2024-12-08",
      surah: "Al-Baqarah",
      verses: "1-5",
      type: "murojaah",
      grade: "cukup",
      status: "on_progress",
    },
  ])

  const [nadhomanData, setNadhomanData] = useState([
    {
      id: 1,
      student: "Muhammad Ali",
      nis: "2024003",
      date: "2024-12-08",
      kitab: "Amsilati",
      amount: "5 bait",
      notes: "Hafalan lancar",
    },
    {
      id: 2,
      student: "Khadijah",
      nis: "2024004",
      date: "2024-12-08",
      kitab: "Jurumiyah",
      amount: "3 bait",
      notes: "Perlu pengulangan",
    },
  ])

  const [presensiData, setPresensiData] = useState([
    {
      id: 1,
      student: "Ahmad Fauzi",
      nis: "2024001",
      date: "2024-12-08",
      time: "05:30",
      status: "Hadir",
      method: "Kartu",
    },
    {
      id: 2,
      student: "Fatimah Zahra",
      nis: "2024002",
      date: "2024-12-08",
      time: "05:35",
      status: "Hadir",
      method: "Manual",
    },
  ])

  const modules = [
    {
      id: "tahfidz",
      name: "Tahfidz",
      icon: FaQuran,
      color: "bg-green-500",
      data: tahfidzData,
      setData: setTahfidzData,
    },
    {
      id: "nadhoman",
      name: "Nadhoman",
      icon: FaScroll,
      color: "bg-amber-500",
      data: nadhomanData,
      setData: setNadhomanData,
    },
    {
      id: "presensi",
      name: "Presensi Sholat",
      icon: FaPray,
      color: "bg-blue-500",
      data: presensiData,
      setData: setPresensiData,
    },
  ]

  const currentModule = modules.find((m) => m.id === activeModule)
  const filteredData =
    currentModule?.data.filter(
      (item) => item.student.toLowerCase().includes(searchTerm.toLowerCase()) || item.nis.includes(searchTerm),
    ) || []

  const getStatusBadge = (status, type = "status") => {
    const badges = {
      status: {
        tuntas: "bg-green-100 text-green-800",
        on_progress: "bg-blue-100 text-blue-800",
        Hadir: "bg-green-100 text-green-800",
        Izin: "bg-yellow-100 text-yellow-800",
        Sakit: "bg-blue-100 text-blue-800",
        Alfa: "bg-red-100 text-red-800",
      },
      grade: {
        lancar: "bg-green-100 text-green-800",
        cukup: "bg-yellow-100 text-yellow-800",
        kurang: "bg-red-100 text-red-800",
      },
      type: {
        baru: "bg-blue-100 text-blue-800",
        murojaah: "bg-purple-100 text-purple-800",
        Manual: "bg-gray-100 text-gray-800",
        Kartu: "bg-indigo-100 text-indigo-800",
      },
    }

    return badges[type][status] || "bg-gray-100 text-gray-800"
  }

  const renderMobileCard = (item) => {
    if (activeModule === "tahfidz") {
      return (
        <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{item.student}</h3>
              <p className="text-sm text-gray-500">NIS: {item.nis}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                <FaEdit size={14} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                <FaTrash size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tanggal:</span>
              <span className="text-sm font-medium">{item.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Surah:</span>
              <span className="text-sm font-medium">{item.surah}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ayat:</span>
              <span className="text-sm font-medium">{item.verses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Jenis:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.type, "type")}`}>
                {item.type}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nilai:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.grade, "grade")}`}>
                {item.grade}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        </div>
      )
    }

    if (activeModule === "nadhoman") {
      return (
        <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{item.student}</h3>
              <p className="text-sm text-gray-500">NIS: {item.nis}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                <FaEdit size={14} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                <FaTrash size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tanggal:</span>
              <span className="text-sm font-medium">{item.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Kitab:</span>
              <span className="text-sm font-medium">{item.kitab}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Jumlah:</span>
              <span className="text-sm font-medium">{item.amount}</span>
            </div>
            <div className="mt-3">
              <span className="text-sm text-gray-600">Catatan:</span>
              <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{item.notes}</p>
            </div>
          </div>
        </div>
      )
    }

    if (activeModule === "presensi") {
      return (
        <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{item.student}</h3>
              <p className="text-sm text-gray-500">NIS: {item.nis}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                <FaEdit size={14} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                <FaTrash size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tanggal:</span>
              <span className="text-sm font-medium">{item.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Waktu:</span>
              <span className="text-sm font-medium">{item.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                {item.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Metode:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.method, "type")}`}>
                {item.method}
              </span>
            </div>
          </div>
        </div>
      )
    }
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setActiveView("edit")
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      currentModule.setData((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleAdd = () => {
    setSelectedItem(null)
    setActiveView("add")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <FaBars size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard Ustadz</h1>
              <p className="text-sm text-gray-500">{userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white" size={14} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="p-4 border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <button
                  key={module.id}
                  onClick={() => {
                    setActiveModule(module.id)
                    setActiveView("list")
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                    ${activeModule === module.id ? `${module.color} text-white` : "text-gray-700 hover:bg-gray-100"}
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{module.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {activeView === "list" && (
            <div className="p-4">
              {/* Module Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 ${currentModule?.color} rounded-lg`}>
                    {currentModule && <currentModule.icon className="text-white" size={24} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{currentModule?.name}</h2>
                    <p className="text-sm text-gray-500">Kelola data {currentModule?.name.toLowerCase()}</p>
                  </div>
                </div>

                {/* Search and Add Button */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Cari santri..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAdd}
                    className={`px-4 py-2 ${currentModule?.color} text-white rounded-lg flex items-center gap-2 font-medium`}
                  >
                    <FaPlus size={16} />
                    <span className="hidden sm:inline">Tambah</span>
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{currentModule?.data.length}</div>
                    <div className="text-sm text-gray-500">Total Data</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                      {currentModule?.data.filter((item) => item.status === "tuntas" || item.status === "Hadir").length}
                    </div>
                    <div className="text-sm text-gray-500">Selesai/Hadir</div>
                  </div>
                </div>
              </div>

              {/* Data List */}
              <div className="space-y-3">
                {filteredData.length > 0 ? (
                  filteredData.map(renderMobileCard)
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FaList size={48} />
                    </div>
                    <p className="text-gray-500">Tidak ada data ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeView === "add" || activeView === "edit") && (
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeView === "add" ? "Tambah" : "Edit"} {currentModule?.name}
                  </h3>
                  <button
                    onClick={() => setActiveView("list")}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Simple Form */}
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Santri</label>
                    <input
                      type="text"
                      defaultValue={selectedItem?.student || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan nama santri"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
                    <input
                      type="text"
                      defaultValue={selectedItem?.nis || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan NIS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                    <input
                      type="date"
                      defaultValue={selectedItem?.date || new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Module-specific fields */}
                  {activeModule === "tahfidz" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Surah</label>
                        <select
                          defaultValue={selectedItem?.surah || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih Surah</option>
                          <option value="Al-Fatihah">Al-Fatihah</option>
                          <option value="Al-Baqarah">Al-Baqarah</option>
                          <option value="Ali 'Imran">Ali 'Imran</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ayat</label>
                        <input
                          type="text"
                          defaultValue={selectedItem?.verses || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Contoh: 1-7"
                        />
                      </div>
                    </>
                  )}

                  {activeModule === "nadhoman" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kitab</label>
                        <select
                          defaultValue={selectedItem?.kitab || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih Kitab</option>
                          <option value="Amsilati">Amsilati</option>
                          <option value="Jurumiyah">Jurumiyah</option>
                          <option value="Imrithi">Imrithi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Hafalan</label>
                        <input
                          type="text"
                          defaultValue={selectedItem?.amount || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Contoh: 5 bait"
                        />
                      </div>
                    </>
                  )}

                  {activeModule === "presensi" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
                        <input
                          type="time"
                          defaultValue={selectedItem?.time || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          defaultValue={selectedItem?.status || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Pilih Status</option>
                          <option value="Hadir">Hadir</option>
                          <option value="Izin">Izin</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Alfa">Alfa</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className={`flex-1 py-2 ${currentModule?.color} text-white rounded-lg font-medium`}
                    >
                      {activeView === "add" ? "Tambah" : "Simpan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("list")}
                      className="flex-1 py-2 bg-gray-500 text-white rounded-lg font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UstadzDashboard
