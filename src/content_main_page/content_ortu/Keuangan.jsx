"use client"

import { useState, useEffect } from "react"
import { Wallet, ArrowUpRight, ArrowDownLeft, FileText, Download, CreditCard, Receipt } from "lucide-react"

export const KeuanganPage = () => {
  const [selectedChild, setSelectedChild] = useState(null)
  const [transactionFilter, setTransactionFilter] = useState("semua")
  const [transferFilter, setTransferFilter] = useState("semua")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [selectedTab, setSelectedTab] = useState("transaksi")

  // Mock data (sama seperti yang kamu punya)
  const mockSaldo = 250000
  const mockTransaksiData = [ /* ... */ ]
  const mockTransferData = [ /* ... */ ]
  const mockTagihanData = [ /* ... */ ]

  useEffect(() => {
    const activeChild = sessionStorage.getItem("active_child")
    if (activeChild) setSelectedChild(JSON.parse(activeChild))
  }, [])

  const formatRupiah = (value) => `Rp ${value.toLocaleString("id-ID")}`
  const formatTanggal = (date) => new Date(date).toLocaleDateString("id-ID")
  const formatTanggalWaktu = (date) => new Date(date).toLocaleString("id-ID")
  const getStatusColor = (status) =>
    status === "berhasil"
      ? "bg-emerald-100 text-emerald-800"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : status === "gagal"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800"

  const filteredTransactions = mockTransaksiData.filter((item) => {
    const typeMatch = transactionFilter === "semua" || item.jenis === transactionFilter
    const dateMatch = (!dateRange.start || item.tanggal >= dateRange.start) && (!dateRange.end || item.tanggal <= dateRange.end)
    return typeMatch && dateMatch
  })

  const filteredTransfers = mockTransferData.filter((item) => {
    const typeMatch = transferFilter === "semua" || item.jenis === transferFilter
    const dateMatch = (!dateRange.start || item.tanggal >= dateRange.start) && (!dateRange.end || item.tanggal <= dateRange.end)
    return typeMatch && dateMatch
  })

  const exportToCSV = (data, filename) => {
    if (!data.length) return
    const headers = Object.keys(data[0]).join(",")
    const csvContent = [headers, ...data.map((row) => Object.values(row).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const stats = {
    saldo: mockSaldo,
    totalPengeluaran: mockTransaksiData.filter((t) => t.nominal < 0).reduce((sum, t) => sum + Math.abs(t.nominal), 0),
    totalTopUp: mockTransaksiData.filter((t) => t.nominal > 0).reduce((sum, t) => sum + t.nominal, 0),
    tagihanAktif: mockTagihanData.filter((t) => t.status !== "lunas").length,
    totalTagihan: mockTagihanData.filter((t) => t.status !== "lunas").reduce((sum, t) => sum + t.sisa, 0),
  }

  return (
      <div className="space-y-6 p-4">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Wallet className="mr-3 h-6 w-6 text-purple-600" /> Keuangan
          </h1>
          <p className="text-gray-600 mt-1">Kelola keuangan {selectedChild?.name || "santri"}</p>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="border-purple-100 p-6 rounded-lg shadow-lg lg:col-span-2 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-purple-600">Saldo Dompet</p>
              <p className="text-3xl font-bold text-purple-700">{formatRupiah(stats.saldo)}</p>
              <p className="text-sm text-gray-600">Tersedia untuk digunakan</p>
            </div>
            <Wallet className="h-12 w-12 text-purple-600" />
          </div>
          <div className="border-red-100 p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-red-600">Pengeluaran</p>
              <p className="text-2xl font-bold text-red-700">{formatRupiah(stats.totalPengeluaran)}</p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-red-600" />
          </div>
          <div className="border-emerald-100 p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-emerald-600">Top Up</p>
              <p className="text-2xl font-bold text-emerald-700">{formatRupiah(stats.totalTopUp)}</p>
            </div>
            <ArrowDownLeft className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="border-orange-100 p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-orange-600">Tagihan Aktif</p>
              <p className="text-2xl font-bold text-orange-700">{stats.tagihanAktif}</p>
              <p className="text-xs text-gray-600">{formatRupiah(stats.totalTagihan)}</p>
            </div>
            <Receipt className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex space-x-4 border-b">
            {["transaksi", "transfer", "tagihan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 -mb-px font-medium ${
                  selectedTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {selectedTab === "transaksi" && (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)}>
                  <option value="semua">Semua Jenis</option>
                  <option value="pembelian">Pembelian</option>
                  <option value="top_up">Top Up</option>
                </select>
                <button onClick={() => exportToCSV(filteredTransactions, "transaksi")} className="px-3 py-1 bg-gray-100 rounded flex items-center gap-1">
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              </div>
              <table className="w-full border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Tanggal</th>
                    <th className="p-2 border">Deskripsi</th>
                    <th className="p-2 border">Jenis</th>
                    <th className="p-2 border">Nominal</th>
                    <th className="p-2 border">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{formatTanggalWaktu(t.tanggal)}</td>
                      <td className="p-2 border">{t.deskripsi}</td>
                      <td className={`p-2 border px-3 py-1 rounded ${t.jenis === "top_up" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                        {t.jenis === "top_up" ? "Top Up" : "Pembelian"}
                      </td>
                      <td className={`p-2 border font-semibold ${t.nominal > 0 ? "text-emerald-600" : "text-red-600"}`}>{t.nominal > 0 ? "+" : ""}{formatRupiah(t.nominal)}</td>
                      <td className="p-2 border font-medium">{formatRupiah(t.saldoAkhir)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* ...transfer dan tagihan bisa dibuat serupa dengan table + filter + CSV export */}
        </div>
      </div>
  )
}
