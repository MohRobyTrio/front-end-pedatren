import { useState, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import blankProfile from "../assets/blank_profile.png";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import DetailBiodata from "../../content_modal/detail/DetailBiodata";
import DetailKeluarga from "../../content_modal/detail/DetailKeluarga";
import DetailPendidikan from "../../content_modal/detail/DetailPendidikan";
import DetailStatusSantri from "../../content_modal/detail/DetailStatusSantri";
import DetailDomisili from "../../content_modal/detail/DetailDomisili";
import DetailKunjunganMahrom from "../../content_modal/detail/DetailKunjunganMahrom";
import DetailCatatanProgress from "../../content_modal/detail/DetailCatatanProgress";
import DetailKhadam from "../../content_modal/detail/DetailKhadam";
import DetailPengurus from "../../content_modal/detail/DetailPengurus";
import DetailKaryawan from "../../content_modal/detail/DetailKaryawan";
import DetailWaliKelas from "../../content_modal/detail/DetailWaliKelas";
import DetailPengajar from "../../content_modal/detail/DetailPengajar";
import DetailWaliAsuh from "../../content_modal/detail/DetailWaliAsuh";
import DetailBerkas from "../../content_modal/detail/DetailBerkas";
import DetailPemohonIzin from "../../content_modal/detail/DetailPemohonIzin";
import DetailPengantar from "../../content_modal/detail/DetailPengantar";
import DetailPelanggaran from "../../content_modal/detail/DetailPelanggaran";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import DetailRekapTahfidz from "../../content_modal/detail/DetailRekapTahfidz";
import DetailSetoranTahfidz from "../../content_modal/detail/DetailSetoranTahfidz";
import DetailNadhoman from "../../content_modal/detail/DetailNadhoman";
import DetailRekapNadhoman from "../../content_modal/detail/DetailRekapNadhoman";
import { FaEdit } from "react-icons/fa";

// Placeholder untuk tab lainnya
const WarPes = () => <h1 className="text-xl font-bold">Warga Pesantren</h1>;

const ModalDetail = ({ title, menu, item, onClose }) => {
    // const [activeTab, setActiveTab] = useState("biodata");
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const menuToKondisi = {
        // tabsKondisi1
        8: "kondisi1",
        9: "kondisi1",
        10: "kondisi1",
        11: "kondisi1",
        21: "kondisi1",

        // tabsKondisi3
        6: "kondisi3",
        7: "kondisi3",
    };

    const getKondisiByMenu = (menu) => menuToKondisi[menu] || "kondisi2";


    // console.log(menu);
    const handleEditClick = (biodataId, kondisi) => {
        navigate(`/formulir/${biodataId}/biodata`, {
            state: { kondisiTabFormulir: kondisi }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                let endpoint = '';

                if (menu === 1) endpoint = `data-pokok/pesertadidik/${item.biodata_id}`;
                else if (menu === 2) endpoint = `data-pokok/santri/${item.biodata_id}`;
                else if (menu === 3) endpoint = `data-pokok/santri-nondomisili/${item.biodata_id}`;
                else if (menu === 4) endpoint = `data-pokok/pelajar/${item.biodata_id}`;
                else if (menu === 5) endpoint = `data-pokok/pesertadidik-bersaudara/${item.biodata_id}`;
                else if (menu === 6) endpoint = `data-pokok/orangtua/${item.biodata_id}`;
                else if (menu === 7) endpoint = `data-pokok/wali/${item.biodata_id}`;
                else if (menu === 8) endpoint = `data-pokok/pengajar/${item.biodata_id}`;
                else if (menu === 9) endpoint = `data-pokok/pengurus/${item.biodata_id}`;
                else if (menu === 10) endpoint = `data-pokok/karyawan/${item.biodata_id}`;
                else if (menu === 11) endpoint = `data-pokok/walikelas/${item.id}`;
                else if (menu === 12) endpoint = `data-pokok/khadam/${item.biodata_id}`;
                else if (menu === 13) endpoint = `data-pokok/alumni/${item.biodata_id}`;

                else if (menu === 14) endpoint = `data-pokok/waliasuh/${item.biodata_id}`;
                else if (menu === 16) endpoint = `data-pokok/anakasuh/${item.biodata_id}`;

                else if (menu === 17) endpoint = `data-pokok/perizinan/${item.id}`;
                else if (menu === 18) endpoint = `data-pokok/pelanggaran/${item.id}`;
                else if (menu === 19) endpoint = `data-pokok/catatan-afektif/${item}`;
                else if (menu === 20) endpoint = `data-pokok/catatan-kognitif/${item}`;

                else if (menu === 21) endpoint = `data-pokok/pegawai/${item.biodata_id}`;
                else if (menu === 22) endpoint = `data-pokok/anakpegawai/${item.biodata_id}`;

                else if (menu === 23) endpoint = `data-pokok/pengunjung/${item.id}`;
                else if (menu === 24) endpoint = `tahfidz/${item.santri_id}`;
                else if (menu === 25) endpoint = `nadhoman/${item.santri_id}`;

                if (!endpoint) throw new Error('Menu tidak valid');
                const token = sessionStorage.getItem("token") || getCookie("token");
                const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.status == 401 && !window.sessionExpiredShown) {
                    window.sessionExpiredShown = true;
                    await Swal.fire({
                        title: "Sesi Berakhir",
                        text: "Sesi anda telah berakhir, silakan login kembali.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                    clearAuthData();
                    navigate("/login");
                    return;
                }
                const json = await res.json();
                if (!res.ok || json.status === false) {
                    throw new Error(json.message || 'Gagal mengambil data');
                }

                console.log(endpoint);
                console.log(json.data);



                setData(json.data);

                // if (menu === 12) console.log(item.id_khadam);
                // if (menu === 13) console.log(item.biodata_id);

                // console.log(item.biodata_id);
                // console.log(item.id);
                console.log(menu);
            } catch (err) {
                console.error(err);
                // setError(err.message || `Gagal memuat data.`);
                setError(`Gagal memuat data.`);
            } finally {
                setLoading(false);
            }
        };

        if (item?.biodata_id || item?.id_khadam || item?.id || item?.santri_id || item?.Biodata_uuid || item) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item, item.biodata_id, item.id, item.id_khadam, item.santri_id, item.Biodata_uuid, menu]);

    const isOnlyError = data && Object.keys(data).length === 1 && data.error;

    const tabs = useMemo(() => {
        if (isOnlyError) return [];

        return [

            data?.Biodata && {
                id: "biodata",
                label: "Biodata",
                content: <DetailBiodata biodata={data.Biodata} />
            },
            data?.Keluarga?.length > 0 && {
                id: "keluarga",
                label: "Keluarga",
                content: <DetailKeluarga keluarga={data.Keluarga} />
            },
            (data?.Status_Santri?.Santri?.length > 0 || data?.Status_Santri?.Kewaliasuhan?.length > 0 || data?.Status_Santri?.Info_Perizinan?.length > 0) && {
                id: "Status Santri",
                label: "Status Santri",
                content: <DetailStatusSantri statusSantri={data.Status_Santri} />
            },
            data?.Domisili?.length > 0 && {
                id: "domisili",
                label: "Domisili",
                content: <DetailDomisili domisili={data.Domisili} />
            },
            data?.Pendidikan?.length > 0 && {
                id: "pendidikan",
                label: "Pendidikan",
                content: <DetailPendidikan pendidikan={data.Pendidikan} />
            },
            data?.Wali_Asuh?.length > 0 && {
                id: "waliasuh",
                label: "Wali Asuh",
                content: <DetailWaliAsuh waliAsuh={data.Wali_Asuh} />
            },
            data?.Karyawan?.length > 0 && {
                id: "karyawan",
                label: "Karyawan",
                content: <DetailKaryawan karyawan={data.Karyawan} />
            },
            data?.Pengajar && (
                (Array.isArray(data.Pengajar.Pangkalan) && data.Pengajar.Pangkalan.length > 0) ||
                (Array.isArray(data.Pengajar.Mata_Pelajaran) && data.Pengajar.Mata_Pelajaran.length > 0)
            ) && {
                id: "pengajar",
                label: "Pengajar",
                content: <DetailPengajar pengajar={data.Pengajar} />
            },
            data?.Pengurus?.length > 0 && {
                id: "pengurus",
                label: "Pengurus",
                content: <DetailPengurus pengurus={data.Pengurus} />
            },
            data?.Wali_Kelas?.length > 0 && {
                id: "wali_kelas",
                label: "Wali Kelas",
                content: <DetailWaliKelas waliKelas={data.Wali_Kelas} />
            },
            data?.WargaPesantren?.length > 0 && {
                id: "warpes",
                label: "Warga Pesantren",
                content: <WarPes />
            },
            data?.Catatan_Progress
            && (
                (
                    Array.isArray(data.Catatan_Progress.Afektif)
                        ? data.Catatan_Progress.Afektif.length > 0
                        : Object.keys(data.Catatan_Progress.Afektif || {}).length > 0
                ) ||
                (
                    Array.isArray(data.Catatan_Progress.Kognitif)
                        ? data.Catatan_Progress.Kognitif.length > 0
                        : Object.keys(data.Catatan_Progress.Kognitif || {}).length > 0
                )
            )
            &&
            {
                id: "progress",
                label: "Catatan Progress",
                content: <DetailCatatanProgress catatanProgress={data.Catatan_Progress} />
            },
            data?.Kunjungan_Mahrom?.length > 0 && {
                id: "kunjungan_mahrom",
                label: "Kunjungan Mahrom",
                content: <DetailKunjunganMahrom kunjunganMahrom={data.Kunjungan_Mahrom} />
            },
            data?.Khadam?.length > 0 && {
                id: "khadam",
                label: "Khadam",
                content: <DetailKhadam khadam={data.Khadam} />
            },
            data?.["Pemohon Izin"] && Object.keys(data?.["Pemohon Izin"]).length > 0 && {
                id: "pemohon_izin",
                label: "Pemohon Izin",
                content: <DetailPemohonIzin pemohonIzin={data?.["Pemohon Izin"]} />
            },
            data?.pelanggaran && Object.keys(data?.pelanggaran).length > 0 && {
                id: "pelanggaran",
                label: "Pelanggaran",
                content: <DetailPelanggaran pelanggaran={data.pelanggaran} />
            },
            data?.Pengantar && Object.keys(data?.Pengantar).length > 0 && {
                id: "pengantar",
                label: "Pengantar",
                content: <DetailPengantar pengantar={data.Pengantar} />
            },
            ((menu === 17 || menu === 18) || (data?.Berkas?.length > 0)) && {
                id: "berkas",
                label: "Berkas",
                content: <DetailBerkas berkas={data?.Berkas || []} menu={menu} id={item.id} close={onClose} />
            },
            data?.tahfidz && Object.keys(data?.tahfidz).length > 0 && {
                id: "tahfidz",
                label: "Tahfidz",
                content: <DetailSetoranTahfidz setoranTahfidz={data?.tahfidz} />
            },
            data?.rekap_tahfidz && Object.keys(data?.rekap_tahfidz).length > 0 && {
                id: "rekap_tahfidz",
                label: "Rekap Tahfidz",
                content: <DetailRekapTahfidz rekapTahfidz={data?.rekap_tahfidz} />
            },
            data?.nadhoman && Object.keys(data?.nadhoman).length > 0 && {
                id: "nadhoman",
                label: "Nadhoman",
                content: <DetailNadhoman nadhoman={data?.nadhoman} />
            },
            data?.rekap_nadhoman && Object.keys(data?.rekap_nadhoman).length > 0 && {
                id: "rekap_nadhoman",
                label: "Rekap Nadhoman",
                content: <DetailRekapNadhoman rekapNadhoman={data?.rekap_nadhoman} />
            },
            data?.error && {
                id: "error",
                label: "Error",
                content: <div>{data?.error}</div>
            },
        ].filter(Boolean); // Hapus tab yang tidak punya data    
    }, [data, isOnlyError, item.id, menu, onClose]);

    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        if (tabs.length > 0) {
            setActiveTab(tabs[0].id);
        }
    }, [tabs]);

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full h-full relative max-h-[90vh] flex flex-col">
                            {/* Tombol Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            {/* Header */}
                            <div className="pb-4">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail {title}</Dialog.Title>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {loading && (
                                    <div className="flex justify-center items-center h-full">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" />
                                    </div>
                                )}
                                {error &&
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-red-500 font-semibold">
                                            {error}
                                        </div>
                                    </div>
                                }
                                {data && (
                                    isOnlyError ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center text-red-500 font-semibold">
                                                {data.error}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500">
                                                {tabs.map((tab) => (
                                                    <li key={tab.id}>
                                                        <button
                                                            onClick={() => setActiveTab(tab.id)}
                                                            className={`inline-block p-3 rounded-t-lg border-b-2 cursor-pointer ${activeTab === tab.id
                                                                ? "text-blue-600 border-blue-600 bg-gray-200"
                                                                : "border-transparent hover:text-gray-600 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            {tab.label}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="pt-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
                                        </>
                                    )
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-4 flex justify-end space-x-2">
                                {/* set id route */}
                                {menu !== 23 && menu !== 17 && menu != 18 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const kondisi = getKondisiByMenu(menu);
                                            handleEditClick(item.biodata_id || item.id || item, kondisi);
                                            onClose();
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2"
                                    >
                                        {/* <FaEdit /> Edit */}
                                        Selengkapnya
                                    </button>
                                )}
                                {/* <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                                >
                                    Tutup
                                </button> */}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ModalDetail;
