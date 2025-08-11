"use client"

import { useState, useEffect, useCallback } from "react"

const useFetchNadhoman = (filters = {}) => {
  const [nadhomanData, setNadhomanData] = useState([])
  const [loadingNadhoman, setLoadingNadhoman] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [limit, setLimit] = useState(10)
  const [totalDataNadhoman, setTotalDataNadhoman] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data untuk demo
  const mockNadhomanData = [
    {
      id: 1,
      tanggal: "2024-08-11",
      nama_siswa: "Ari Surahman",
      nis: "097556282828838",
      kelas: "2 ULA",
      unit: "PONDOKPA",
      kitab: "Amsilati",
      hafalan_baru: "5",
      keterangan: "Bab 1 halaman 10-15",
    },
    {
      id: 2,
      tanggal: "2024-08-10",
      nama_siswa: "Erwanto E. Yusuf",
      nis: "1717",
      kelas: "2 ULA",
      unit: "PONDOKPA",
      kitab: "Jurumiyah Jawan",
      hafalan_baru: "3",
      keterangan: "Bab 2 halaman 20-25",
    },
    {
      id: 3,
      tanggal: "2024-08-09",
      nama_siswa: "Udin",
      nis: "34534543",
      kelas: "2 ULA",
      unit: "PONDOKPA",
      kitab: "Imrithi",
      hafalan_baru: "7",
      keterangan: "Bab 3 halaman 30-40",
    },
    {
      id: 4,
      tanggal: "2024-08-08",
      nama_siswa: "Syamsuri",
      nis: "123456",
      kelas: "KELAS 1",
      unit: "PONDOKPA",
      kitab: "Alfiyah Ibnu Malik Awwal",
      hafalan_baru: "4",
      keterangan: "Bab 1 halaman 5-10",
    },
  ]

  const fetchData = useCallback(async () => {
    setLoadingNadhoman(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filter data based on search term and filters
      let filteredData = mockNadhomanData

      if (searchTerm) {
        filteredData = filteredData.filter(
          (item) =>
            item.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nis.includes(searchTerm) ||
            item.kitab.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply other filters
      if (filters.jenisKelamin) {
        // Mock filter implementation
      }
      if (filters.status) {
        // Mock filter implementation
      }
      if (filters.kitab) {
        filteredData = filteredData.filter((item) => item.kitab.toLowerCase().includes(filters.kitab.toLowerCase()))
      }

      // Pagination
      const startIndex = (currentPage - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filteredData.slice(startIndex, endIndex)

      setNadhomanData(paginatedData)
      setTotalDataNadhoman(filteredData.length)
      setTotalPages(Math.ceil(filteredData.length / limit))
    } catch (err) {
      setError("Gagal memuat data nadhoman")
      console.error("Error fetching nadhoman data:", err)
    } finally {
      setLoadingNadhoman(false)
    }
  }, [searchTerm, filters, currentPage, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset to first page when search term or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  return {
    nadhomanData,
    loadingNadhoman,
    error,
    searchTerm,
    setSearchTerm,
    limit,
    setLimit,
    totalDataNadhoman,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchData,
  }
}

export default useFetchNadhoman
