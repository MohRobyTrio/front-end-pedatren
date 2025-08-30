"use client";

import { useState, useEffect } from "react";

function SimpleLayout({ children }) {
  return <div className="min-h-screen bg-gray-50 p-4">{children}</div>;
}

function Badge({ children, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-emerald-100 text-emerald-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${colors[color]}`}>{children}</span>;
}

export const AkademikPage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState("afektif");

  const mockAfektifData = {
    adab: 85,
    disiplin: 78,
    kebersihan: 92,
    kerjaSama: 88,
    catatan:
      "Santri menunjukkan perkembangan yang baik dalam hal adab dan akhlak. Perlu peningkatan dalam kedisiplinan waktu.",
  };

  const mockKognitifData = [
    { mataPelajaran: "Bahasa Arab", nilai: 85, semester: "Ganjil 2024/2025" },
    { mataPelajaran: "Fiqh", nilai: 90, semester: "Ganjil 2024/2025" },
    { mataPelajaran: "Tafsir", nilai: 82, semester: "Ganjil 2024/2025" },
    { mataPelajaran: "Hadits", nilai: 88, semester: "Ganjil 2024/2025" },
    { mataPelajaran: "Akidah Akhlak", nilai: 87, semester: "Ganjil 2024/2025" },
    { mataPelajaran: "Sejarah Islam", nilai: 79, semester: "Ganjil 2024/2025" },
  ];

  const mockCatatanUstadz = [
    { tanggal: "2025-01-15", ustadz: "Ustadz Ahmad Fauzi", mataPelajaran: "Fiqh", catatan: "Santri aktif dan paham materi." },
    { tanggal: "2025-01-10", ustadz: "Ustadz Muhammad Yusuf", mataPelajaran: "Bahasa Arab", catatan: "Perlu latihan lebih." },
    { tanggal: "2025-01-08", ustadz: "Ustadzah Fatimah", mataPelajaran: "Akidah Akhlak", catatan: "Akhlak baik." },
  ];

  useEffect(() => {
    const activeChild = sessionStorage.getItem("active_child");
    if (activeChild) setSelectedChild(JSON.parse(activeChild));
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return "green";
    if (score >= 80) return "blue";
    if (score >= 70) return "yellow";
    return "red";
  };

  const rataRataKognitif = Math.round(mockKognitifData.reduce((sum, i) => sum + i.nilai, 0) / mockKognitifData.length);
  const rataRataAfektif = Math.round((mockAfektifData.adab + mockAfektifData.disiplin + mockAfektifData.kebersihan + mockAfektifData.kerjaSama) / 4);

  const formatTanggal = (dateString) => {
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  };

  return (
    <SimpleLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🎓 Penilaian Akademik</h1>
          <p className="text-gray-600 mt-1">Penilaian afektif dan kognitif {selectedChild?.name || "santri"}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-white rounded-lg border shadow flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600">Rata-rata Kognitif</p>
              <p className={`text-3xl font-bold ${getScoreColor(rataRataKognitif)}`}>{rataRataKognitif}</p>
              <p className="text-sm text-gray-600">Nilai akademik</p>
            </div>
            <div className="text-blue-600 text-4xl">🧠</div>
          </div>

          <div className="p-4 bg-white rounded-lg border shadow flex justify-between items-center">
            <div>
              <p className="text-sm text-emerald-600">Rata-rata Afektif</p>
              <p className={`text-3xl font-bold ${getScoreColor(rataRataAfektif)}`}>{rataRataAfektif}</p>
              <p className="text-sm text-gray-600">Adab & Akhlak</p>
            </div>
            <div className="text-emerald-600 text-4xl">❤️</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-4">
          <div className="flex border-b">
            <button onClick={()=>setActiveTab("afektif")} className={`px-4 py-2 ${activeTab==="afektif"?"border-b-2 border-blue-600 font-bold":""}`}>Afektif</button>
            <button onClick={()=>setActiveTab("kognitif")} className={`px-4 py-2 ${activeTab==="kognitif"?"border-b-2 border-blue-600 font-bold":""}`}>Kognitif</button>
          </div>

          {activeTab==="afektif" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(mockAfektifData).filter(([k])=>k!=="catatan").map(([key,value],idx)=>(
                <div key={idx} className="bg-white p-4 rounded-lg border shadow text-center">
                  <p className="text-sm text-gray-600">{key.charAt(0).toUpperCase()+key.slice(1)}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</p>
                  <Badge color={getScoreBadge(value)}>
                    {value>=90?"Sangat Baik":value>=80?"Baik":value>=70?"Cukup":"Perlu Perbaikan"}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {activeTab==="kognitif" && (
            <div className="space-y-4">
              {mockKognitifData.map((item,idx)=>(
                <div key={idx} className="flex justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.mataPelajaran}</h3>
                    <p className="text-sm text-gray-600">{item.semester}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(item.nilai)}`}>{item.nilai}</p>
                    <Badge color={getScoreBadge(item.nilai)}>{item.nilai>=90?"A":item.nilai>=80?"B":item.nilai>=70?"C":"D"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teacher Notes */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">💬 Catatan Ustadz</h2>
          {mockCatatanUstadz.map((c,idx)=>(
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between mb-1">
                <div>
                  <p className="font-medium text-gray-900">{c.ustadz}</p>
                  <p className="text-sm text-blue-600">{c.mataPelajaran}</p>
                </div>
                <p className="text-sm text-gray-500">{formatTanggal(c.tanggal)}</p>
              </div>
              <p className="text-gray-700">{c.catatan}</p>
            </div>
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
}
