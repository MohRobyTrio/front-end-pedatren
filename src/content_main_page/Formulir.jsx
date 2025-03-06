import { Link, useLocation, Outlet } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DomisiliSantri from "./content_tab_formulir/TabDomisiliSantri";
import Biodata from "./content_tab_formulir/TabBiodata";
import Keluarga from "./content_tab_formulir/TabKeluarga";
import Santri from "./content_tab_formulir/TabSantri";
import WaliAsuh from "./content_tab_formulir/TabWaliAsuh";
import Pendidikan from "./content_tab_formulir/TabPendidikan";
import Pengajar from "./content_tab_formulir/TabPengajar";
import Karyawan from "./content_tab_formulir/TabKaryawan";
import Pengurus from "./content_tab_formulir/TabPengurus";
import Khadam from "./content_tab_formulir/TabKhadam";
import Berkas from "./content_tab_formulir/TabBerkas";
import WarPres from "./content_tab_formulir/TabWarPres";
import Progress from "./content_tab_formulir/TabProgress";

const Formulir = () => {

  const tabs = [
    { id: "biodata", label: "Biodata", link: "/formulir/biodata", content: <Biodata /> },
    { id: "keluarga", label: "Keluarga", link: "/formulir/keluarga", content: <Keluarga /> },
    { id: "santri", label: "Santri", link: "/formulir/santri", content: <Santri /> },
    { id: "domisili", label: "Domisili Santri", link: "/formulir/domisili-santri", content: <DomisiliSantri /> },
    { id: "waliasuh", label: "Wali Asuh", link: "/formulir/wali-asuh", content: <WaliAsuh /> },
    { id: "pendidikan", label: "Pendidikan", link: "/formulir/pendidikan", content: <Pendidikan /> },
    { id: "pengajar", label: "Pengajar", link: "/formulir/pengajar", content: <Pengajar /> },
    { id: "karyawan", label: "Karyawan", link: "/formulir/karyawan", content: <Karyawan /> },
    { id: "pengurus", label: "Pengurus", link: "/formulir/pengurus", content: <Pengurus /> },
    { id: "khadam", label: "Khadam", link: "/formulir/khadam", content: <Khadam /> },
    { id: "berkas", label: "Berkas", link: "/formulir/berkas", content: <Berkas /> },
    { id: "warpes", label: "Warga Pesantren", link: "/formulir/warga-pesantren", content: <WarPres /> },
    { id: "progress", label: "Progress Report", link: "/formulir/progress-report", content: <Progress /> },
  ];
  const location = useLocation();
  return (
    <div className="flex-1 pl-6 pt-6 pb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Formulir</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center mb-4">
          {tabs.map((tab, index) => (
            <span key={tab.id}>
              <Link to={tab.link}
                className={`cursor-pointer ${location.pathname === tab.link ? "text-blue-500 font-bold" : "text-gray-500"
                  }`}
              >
                {tab.label}
              </Link>
              {index < tabs.length - 1 && <i className="fas fa-chevron-right mx-2 text-gray-400"></i>}
            </span>
          ))}
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Formulir;

