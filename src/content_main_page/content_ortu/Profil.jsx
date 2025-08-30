"use client"

import { useState, useEffect } from "react"
import { User, MapPin, Phone, Mail, GraduationCap, Home } from "lucide-react"

export const ProfilPage = () => {
  const [selectedChild, setSelectedChild] = useState(null)

  const mockChildProfile = {
    id: 1,
    nama: "Muhammad Faiz Ahmad",
    nis: "2024001",
    kelas: "7A",
    kamar: "Baitul Hikmah 15",
    waliKelas: "Ustadz Ahmad Fauzi",
    tanggalLahir: "2010-05-15",
    tempatLahir: "Jakarta",
    alamat: "Jl. Merdeka No. 123, Jakarta Selatan",
    namaAyah: "Ahmad Wijaya",
    namaIbu: "Siti Fatimah",
    teleponOrtu: "081234567890",
    emailOrtu: "ahmad.wijaya@email.com",
    tanggalMasuk: "2024-07-15",
    status: "Aktif",
    photo: "/student-boy.png",
  }

  const mockPesantrenInfo = {
    nama: "Pondok Pesantren Al-Hikmah",
    alamat: "Jl. Pesantren Raya No. 456, Bogor, Jawa Barat",
    telepon: "(021) 8765-4321",
    email: "info@alhikmah.ac.id",
    website: "www.alhikmah.ac.id",
    kyai: "KH. Muhammad Abdullah",
    direktur: "Dr. Ahmad Syafi'i, M.Pd.I",
  }

  useEffect(() => {
    const activeChild = sessionStorage.getItem("active_child")
    if (activeChild) setSelectedChild(JSON.parse(activeChild))
  }, [])

  const formatTanggal = (dateString) =>
    new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long", day: "numeric" }).format(new Date(dateString))

  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  return (
      <div className="space-y-6 p-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="mr-3 h-6 w-6 text-blue-600" />
            Profil Santri
          </h1>
          <p className="text-gray-600 mt-1">Informasi lengkap {selectedChild?.name || "santri"}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow border p-6 text-center lg:col-span-1">
            <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-4xl font-semibold text-emerald-700">
              {mockChildProfile.photo ? (
                <img src={mockChildProfile.photo} alt={mockChildProfile.nama} className="w-full h-full object-cover" />
              ) : (
                mockChildProfile.nama.charAt(0)
              )}
            </div>
            <h2 className="text-xl font-medium">{mockChildProfile.nama}</h2>
            <div className="space-y-2 mt-2">
              <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-semibold">
                {mockChildProfile.status}
              </span>
              <p className="text-sm text-gray-600">NIS: {mockChildProfile.nis}</p>
              <p className="text-sm text-gray-600">Kelas: {mockChildProfile.kelas}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow border p-6 lg:col-span-2">
            <div className="flex items-center mb-4 text-lg font-medium">
              <User className="mr-2 h-5 w-5 text-blue-600" /> Informasi Pribadi
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <p className="text-gray-900 font-medium">{mockChildProfile.nama}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">NIS</label>
                <p className="text-gray-900">{mockChildProfile.nis}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tempat, Tanggal Lahir</label>
                <p className="text-gray-900">
                  {mockChildProfile.tempatLahir}, {formatTanggal(mockChildProfile.tanggalLahir)}
                </p>
                <p className="text-sm text-gray-600">Usia: {calculateAge(mockChildProfile.tanggalLahir)} tahun</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Kelas</label>
                <p className="text-gray-900">{mockChildProfile.kelas}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Kamar</label>
                <p className="text-gray-900">{mockChildProfile.kamar}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Wali Kelas</label>
                <p className="text-gray-900">{mockChildProfile.waliKelas}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Alamat</label>
                <p className="text-gray-900">{mockChildProfile.alamat}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tanggal Masuk</label>
                <p className="text-gray-900">{formatTanggal(mockChildProfile.tanggalMasuk)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {mockChildProfile.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center mb-4 text-lg font-medium">
            <Home className="mr-2 h-5 w-5 text-emerald-600" /> Informasi Orang Tua/Wali
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Ayah</label>
              <p className="text-gray-900 font-medium">{mockChildProfile.namaAyah}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Ibu</label>
              <p className="text-gray-900 font-medium">{mockChildProfile.namaIbu}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="mr-1 h-4 w-4" /> Nomor Telepon
              </label>
              <p className="text-gray-900">{mockChildProfile.teleponOrtu}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="mr-1 h-4 w-4" /> Email
              </label>
              <p className="text-gray-900">{mockChildProfile.emailOrtu}</p>
            </div>
          </div>
        </div>

        {/* Pesantren Information */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center mb-4 text-lg font-medium">
            <GraduationCap className="mr-2 h-5 w-5 text-purple-600" /> Informasi Pesantren
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Pesantren</label>
              <p className="text-gray-900 font-medium">{mockPesantrenInfo.nama}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Pimpinan</label>
              <p className="text-gray-900">{mockPesantrenInfo.kyai}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="mr-1 h-4 w-4" /> Alamat
              </label>
              <p className="text-gray-900">{mockPesantrenInfo.alamat}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="mr-1 h-4 w-4" /> Telepon
              </label>
              <p className="text-gray-900">{mockPesantrenInfo.telepon}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="mr-1 h-4 w-4" /> Email
              </label>
              <p className="text-gray-900">{mockPesantrenInfo.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Website</label>
              <p className="text-blue-600 hover:text-blue-800">
                <a href={`https://${mockPesantrenInfo.website}`} target="_blank" rel="noopener noreferrer">
                  {mockPesantrenInfo.website}
                </a>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Direktur</label>
              <p className="text-gray-900">{mockPesantrenInfo.direktur}</p>
            </div>
          </div>
        </div>
      </div>
  )
}
