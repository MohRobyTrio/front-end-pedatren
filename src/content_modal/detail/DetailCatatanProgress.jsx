import { useState } from "react";

const DetailCatatanProgress = ({ catatanProgress }) => {
    const tabs = [
        catatanProgress?.Afektif && Object.keys(catatanProgress?.Afektif)?.length > 0 && {
            id: "afektif",
            label: "Afektif",
            content: (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b">#</th>
                                <th className="px-4 py-2 border-b">Aspek</th>
                                <th className="px-4 py-2 border-b">Nilai</th>
                                <th className="px-4 py-2 border-b">Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">1</td>
                                <td className="px-4 py-2 border-b">Kebersihan</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Afektif?.kebersihan || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Afektif?.tindak_lanjut_kebersihan || "-"}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">2</td>
                                <td className="px-4 py-2 border-b">Kepedulian</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Afektif?.kepedulian || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Afektif?.tindak_lanjut_kepedulian || "-"}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">3</td>
                                <td className="px-4 py-2 border-b">Akhlak</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Afektif?.akhlak || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Afektif?.tindak_lanjut_akhlak || "-"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        },
        catatanProgress?.Kognitif && Object.keys(catatanProgress?.Kognitif)?.length > 0 && {
            id: "kognitif",
            label: "Kognitif",
            content: (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b">#</th>
                                <th className="px-4 py-2 border-b">Aspek</th>
                                <th className="px-4 py-2 border-b">Nilai</th>
                                <th className="px-4 py-2 border-b">Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">1</td>
                                <td className="px-4 py-2 border-b">Kebahasaan</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.kebahasaan || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.tindak_lanjut_kebahasaan || "-"}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">2</td>
                                <td className="px-4 py-2 border-b">Baca Kitab Kuning</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.baca_kitab_kuning || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.tindak_lanjut_baca_kitab_kuning || "-"}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">3</td>
                                <td className="px-4 py-2 border-b">Hafalan Tahfidz</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.hafalan_tahfidz || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.tindak_lanjut_hafalan_tahfidz || "-"}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">4</td>
                                <td className="px-4 py-2 border-b">Furudul Ainiyah</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.furudul_ainiyah || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.tindak_lanjut_furudul_ainiyah || "-"}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">5</td>
                                <td className="px-4 py-2 border-b">Tulis Al-Quran</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.tulis_alquran || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.tindak_lanjut_tulis_alquran || "-"}</td>
                            </tr>
                            <tr className="hover:bg-gray-50 text-left">
                                <td className="px-4 py-2 border-b">6</td>
                                <td className="px-4 py-2 border-b">Baca Al-Quran</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.baca_alquran || "-"}</td>
                                <td className="px-4 py-2 border-b">{catatanProgress?.Kognitif?.tindak_lanjut_baca_alquran || "-"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
    ].filter(Boolean);

    const [activeTab, setActiveTab] = useState(tabs[0]?.id || null);

    return (
        <div>
            {tabs.length > 0 && (
                <>
                    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500 mt-4">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`inline-block p-3 rounded-t-lg border-b-2 ${activeTab === tab.id
                                        ? "text-blue-600 border-blue-600 bg-gray-200"
                                        : "border-transparent hover:text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                        {tabs.find((tab) => tab.id === activeTab)?.content}
                    </div>
                </>
            )}
        </div>
    );
};

export default DetailCatatanProgress;
