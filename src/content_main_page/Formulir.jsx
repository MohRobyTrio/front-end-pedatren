import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DomisiliSantri from "./content_tab_formulir/DomisiliSantri";
import Biodata from "./content_tab_formulir/Biodata";
import Keluarga from "./content_tab_formulir/Keluarga";
import Santri from "./content_tab_formulir/Santri";
import WaliAsuh from "./content_tab_formulir/WaliAsuh";
import Pendidikan from "./content_tab_formulir/Pendidikan";
import Pengajar from "./content_tab_formulir/Pengajar";
import Karyawan from "./content_tab_formulir/Karyawan";
import Pengurus from "./content_tab_formulir/Pengurus";
import Khadam from "./content_tab_formulir/Khadam";
import Berkas from "./content_tab_formulir/Berkas";
import WarPres from "./content_tab_formulir/WarPres";
import Progress from "./content_tab_formulir/Progress";

const Formulir = () => {
  const [activeTab, setActiveTab] = useState("biodata");

  const tabs = [
    { id: "biodata", label: "Biodata", content: <Biodata /> },
    { id: "keluarga", label: "Keluarga", content: <Keluarga /> },
    { id: "santri", label: "Santri", content: <Santri /> },
    { id: "domisili", label: "Domisili Santri", content: <DomisiliSantri /> },
    { id: "waliasuh", label: "Wali Asuh", content: <WaliAsuh /> },
    { id: "pendidikan", label: "Pendidikan", content: <Pendidikan /> },
    { id: "pengajar", label: "Pengajar", content: <Pengajar /> },
    { id: "karyawan", label: "Karyawan", content: <Karyawan /> },
    { id: "pengurus", label: "Pengurus", content: <Pengurus /> },
    { id: "khadam", label: "Khadam", content: <Khadam /> },
    { id: "berkas", label: "Berkas", content: <Berkas /> },
    { id: "warpes", label: "Warga Pesantren", content: <WarPres /> },
    { id: "progress", label: "Progress Report", content: <Progress /> },
  ];

  return (
        <div className="flex-1 pl-6 pt-6 pb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Formulir</h1>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap items-center mb-4">
              {tabs.map((tab, index) => (
                <span key={tab.id}>
                  <a
                    className={`cursor-pointer ${activeTab === tab.id ? "text-blue-500 font-bold" : "text-gray-500"
                      }`}
                    href={`#${tab.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab.id);
                    }}
                  >
                    {tab.label}
                  </a>
                  {index < tabs.length - 1 && <i className="fas fa-chevron-right mx-2 text-gray-400"></i>}
                </span>
              ))}
            </div>

            <div className="p-4">
              {tabs.map((tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>)}
            </div>
          </div>
        </div>
  );
};

export default Formulir;

