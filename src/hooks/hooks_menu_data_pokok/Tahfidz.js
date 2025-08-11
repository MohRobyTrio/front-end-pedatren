"use client"

import { useState, useEffect } from "react"

const useFetchTahfidz = (filters) => {
  const [tahfidzData, setTahfidzData] = useState([])
  const [loadingTahfidz, setLoadingTahfidz] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [limit, setLimit] = useState(10)
  const [totalDataTahfidz, setTotalDataTahfidz] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data untuk demo
  const mockData = [
    {
      id: 1,
      nis: "097556282828838",
      nama_siswa: "Ari Surahman",
      kelas: "2 ULA",
      unit: "PONDOKPA",
      tanggal: "2025-08-11",
      hafalan_baru: "5",
      keterangan: "Al-Fatihah ayat 1-7",
      murojaah: "Al-Baqarah ayat 1-10",
      murojaah_hafalan_baru: "Al-Fatihah ayat 1-5",
      tanggal_update: "2025-08-11",
      status: "Aktif",
    },
    {
      id: 2,
      nis: "1717",
      nama_siswa: "Erwanto E. Yusuf",
      kelas: "2 ULA",
      unit: "PONDOKPA",
      tanggal: "2025-08-10",
      hafalan_baru: "3",
      keterangan: "Al-Baqarah ayat 1-5",
      murojaah: "Al-Fatihah lengkap",
      murojaah_hafalan_baru: "Al-Fatihah ayat 6-7",
      tanggal_update: "2025-08-10",
      status: "Aktif",
    },
    {
      id: 3,
      nis: "34534543",
      nama_siswa: "Udin",
      kelas: "2 ULA",
      unit: "PONDOKPA",
      tanggal: "2025-08-09",
      hafalan_baru: "7",
      keterangan: "An-Nas lengkap",
      murojaah: "Al-Falaq lengkap",
      murojaah_hafalan_baru: "Al-Ikhlas lengkap",
      tanggal_update: "2025-08-09",
      status: "Aktif",
    },
  ]

  const fetchData = async () => {
    setLoadingTahfidz(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filter data based on search term and filters
      let filteredData = mockData

      if (searchTerm) {
        filteredData = filteredData.filter(
          (item) =>
            item.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nis.includes(searchTerm) ||
            item.kelas.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply other filters
      if (filters.jenisKelamin) {
        // Mock filter implementation
      }
      if (filters.status) {
        filteredData = filteredData.filter((item) => item.status.toLowerCase() === filters.status.toLowerCase())
      }

      // Pagination
      const startIndex = (currentPage - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filteredData.slice(startIndex, endIndex)

      setTahfidzData(paginatedData)
      setTotalDataTahfidz(filteredData.length)
      setTotalPages(Math.ceil(filteredData.length / limit))
    } catch (err) {
      setError("Gagal memuat data tahfidz")
      setTahfidzData([])
    } finally {
      setLoadingTahfidz(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchTerm, filters, currentPage, limit])

  return {
    tahfidzData,
    loadingTahfidz,
    searchTerm,
    setSearchTerm,
    error,
    limit,
    setLimit,
    totalDataTahfidz,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchData,
  }
}

export default useFetchTahfidz
