"use client"

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

function SimpleLayout({ children }) {
  return <div className="min-h-screen bg-gray-50 p-4">{children}</div>;
}

// Badge sederhana
function Badge({ children, color }) {
  const bgColor = color === "green" ? "bg-green-500" : color === "yellow" ? "bg-yellow-500" : "bg-gray-500";
  return <span className={`px-2 py-0.5 rounded-full text-white text-xs ${bgColor}`}>{children}</span>;
}

// Tabel sederhana
function SimpleTable({ data, columns }) {
  const [sortKey, setSortKey] = useState(null);
  const [asc, setAsc] = useState(true);

  const sortedData = [...data];
  if (sortKey) {
    sortedData.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return asc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return asc ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key) => {
    if (sortKey === key) setAsc(!asc);
    else { setSortKey(key); setAsc(true); }
  }

  return (
    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {columns.map(col => (
            <th key={col.key} className="p-2 text-left cursor-pointer" onClick={() => col.sortable && handleSort(col.key)}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map(row => (
          <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
            {columns.map(col => (
              <td key={col.key} className="p-2">
                {col.render ? col.render(row[col.key]) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Chart placeholder
function LineChart({ data }) {
  return (
    <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-gray-400">
      Chart Placeholder
    </div>
  );
}

export const HafalanPage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [statusFilter, setStatusFilter] = useState("semua");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const mockHafalanData = [
    { id:1,tanggal:"2025-01-15",surah:"Al-Baqarah",ayat:"1-10",status:"lulus",nilai:"A",catatan:"Hafalan lancar, tajwid baik" },
    { id:2,tanggal:"2025-01-12",surah:"Al-Fatihah",ayat:"1-7",status:"lulus",nilai:"A+",catatan:"Sangat baik" },
    { id:3,tanggal:"2025-01-10",surah:"An-Nas",ayat:"1-6",status:"mengulang",nilai:"B",catatan:"Perlu perbaikan tajwid" },
    { id:4,tanggal:"2025-01-08",surah:"Al-Falaq",ayat:"1-5",status:"lulus",nilai:"A",catatan:"Baik" },
    { id:5,tanggal:"2025-01-05",surah:"Al-Ikhlas",ayat:"1-4",status:"lulus",nilai:"A+",catatan:"Sempurna" },
  ];

  const mockProgressData = [
    { label: "Minggu 1", value: 20 },
    { label: "Minggu 2", value: 35 },
    { label: "Minggu 3", value: 45 },
    { label: "Minggu 4", value: 50 },
  ];

  useEffect(() => {
    const activeChild = sessionStorage.getItem("active_child");
    if (activeChild) setSelectedChild(JSON.parse(activeChild));
  }, []);

  const columns = [
    { key: "tanggal", label: "Tanggal", sortable: true },
    { key: "surah", label: "Surah", sortable: true },
    { key: "ayat", label: "Ayat" },
    { key: "status", label: "Status", sortable: true, render: val => <Badge color={val==="lulus"?"green":"yellow"}>{val==="lulus"?"Lulus":"Mengulang"}</Badge> },
    { key: "nilai", label: "Nilai", sortable: true, render: val => <span className={`font-semibold ${val==="A+"?"text-green-700":val==="A"?"text-green-500":"text-yellow-600"}`}>{val}</span> },
    { key: "catatan", label: "Catatan", render: val => <span className="text-sm text-gray-600">{val}</span> },
  ];

  const filteredData = mockHafalanData.filter(item => {
    const statusMatch = statusFilter==="semua"||item.status===statusFilter;
    const dateMatch = (!dateRange.start||item.tanggal>=dateRange.start)&&(!dateRange.end||item.tanggal<=dateRange.end);
    return statusMatch && dateMatch;
  });

  const stats = {
    total: mockHafalanData.length,
    lulus: mockHafalanData.filter(i=>i.status==="lulus").length,
    mengulang: mockHafalanData.filter(i=>i.status==="mengulang").length,
    rataRata: "A",
  };

  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center"><BookOpen className="mr-3 h-6 w-6 text-emerald-600"/>Hafalan Al-Qur'an</h1>
          <p className="text-gray-600 mt-1">Progress hafalan {selectedChild?.name||"santri"}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 bg-white rounded-lg border border-emerald-100 shadow">
            <p className="text-sm font-medium text-emerald-600">Total Hafalan</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.total}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-green-100 shadow">
            <p className="text-sm font-medium text-green-600">Lulus</p>
            <p className="text-2xl font-bold text-green-700">{stats.lulus}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-yellow-100 shadow">
            <p className="text-sm font-medium text-yellow-600">Mengulang</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.mengulang}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-blue-100 shadow">
            <p className="text-sm font-medium text-blue-600">Rata-rata Nilai</p>
            <p className="text-2xl font-bold text-blue-700">{stats.rataRata}</p>
          </div>
        </div>

        <LineChart data={mockProgressData}/>

        <div className="bg-white p-4 rounded-lg border shadow space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="date" className="border p-2 rounded" onChange={e=>setDateRange(prev=>({...prev,start:e.target.value}))} value={dateRange.start}/>
            <input type="date" className="border p-2 rounded" onChange={e=>setDateRange(prev=>({...prev,end:e.target.value}))} value={dateRange.end}/>
            <select className="border p-2 rounded" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="semua">Semua Status</option>
              <option value="lulus">Lulus</option>
              <option value="mengulang">Mengulang</option>
            </select>
          </div>
          <SimpleTable data={filteredData} columns={columns}/>
        </div>
      </div>
    </SimpleLayout>
  );
}
