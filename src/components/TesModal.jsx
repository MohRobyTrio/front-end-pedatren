import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import blankProfile from "../assets/blank_profile.png";
import { Link } from "react-router-dom";
import axios from "axios";

// Subkomponen
const Biodata = ({ biodata }) => (
    <div>
        <h1 className="text-xl font-bold mb-4">Biodata</h1>
        <p><strong>Nama:</strong> {biodata.nama}</p>
        <p><strong>NIUP:</strong> {biodata.niup}</p>
        <p><strong>NIK/No. Paspor:</strong> {biodata.nik_nopassport}</p>
        <p><strong>Jenis Kelamin:</strong> {biodata.jenis_kelamin === "p" ? "Perempuan" : "Laki-laki"}</p>
        <p><strong>TTL:</strong> {biodata.tempat_tanggal_lahir}</p>
        <p><strong>Anak Ke:</strong> {biodata.anak_ke}</p>
        <p><strong>Umur:</strong> {biodata.umur}</p>
        <p><strong>Alamat:</strong> {biodata.kecamatan}, {biodata.kabupaten}, {biodata.provinsi}</p>
        <p><strong>Warganegara:</strong> {biodata.warganegara}</p>
    </div>
);

const Keluarga = ({ keluarga }) => (
    <div>
        <h1 className="text-xl font-bold mb-4">Data Keluarga</h1>
        {keluarga.map((item, index) => (
            <div key={index} className="mb-2">
                <p><strong>Nama:</strong> {item.nama}</p>
                <p><strong>NIK:</strong> {item.nik}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Wali:</strong> {item.wali ? "Ya" : "Tidak"}</p>
                <hr className="my-2" />
            </div>
        ))}
    </div>
);

// Placeholder untuk tab lainnya
const Santri = () => <h1 className="text-xl font-bold">Informasi Santri</h1>;
const WaliAsuh = () => <h1 className="text-xl font-bold">Wali Asuh</h1>;
const Pendidikan = () => <h1 className="text-xl font-bold">Pendidikan</h1>;
const Pengajar = () => <h1 className="text-xl font-bold">Pengajar</h1>;
const Karyawan = () => <h1 className="text-xl font-bold">Karyawan</h1>;
const Pengurus = () => <h1 className="text-xl font-bold">Pengurus</h1>;
const Khadam = () => <h1 className="text-xl font-bold">Khadam</h1>;
const Berkas = () => <h1 className="text-xl font-bold">Berkas</h1>;
const WarPes = () => <h1 className="text-xl font-bold">Warga Pesantren</h1>;
const Progress = () => <h1 className="text-xl font-bold">Progress Report</h1>;
const DomisiliSantri = () => <h1 className="text-xl font-bold">Domisili Santri</h1>;

const TesModal = ({ item, onClose }) => {
    const [activeTab, setActiveTab] = useState("biodata");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:8000/api/data-pokok/alumni/${item.id}`);
                setData(res.data.data);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data.");
            } finally {
                setLoading(false);
            }
        };

        if (item?.id) {
            fetchData();
        }
    }, [item?.id]);

    const tabs = [
        data?.Biodata && {
            id: "biodata",
            label: "Biodata",
            content: <Biodata biodata={data.Biodata} />
        },
        data?.Keluarga && {
            id: "keluarga",
            label: "Keluarga",
            content: <Keluarga keluarga={data.Keluarga} />
        },
        data?.Santri && {
            id: "santri",
            label: "Santri",
            content: <Santri />
        },
        data?.Domisili && {
            id: "domisili",
            label: "Domisili",
            content: <DomisiliSantri />
        },
        data?.WaliAsuh && {
            id: "waliasuh",
            label: "Wali Asuh",
            content: <WaliAsuh />
        },
        data?.Pendidikan && {
            id: "pendidikan",
            label: "Pendidikan",
            content: <Pendidikan />
        },
        data?.Pengajar && {
            id: "pengajar",
            label: "Pengajar",
            content: <Pengajar />
        },
        data?.Karyawan && {
            id: "karyawan",
            label: "Karyawan",
            content: <Karyawan />
        },
        data?.Pengurus && {
            id: "pengurus",
            label: "Pengurus",
            content: <Pengurus />
        },
        data?.Khadam && {
            id: "khadam",
            label: "Khadam",
            content: <Khadam />
        },
        data?.Berkas && {
            id: "berkas",
            label: "Berkas",
            content: <Berkas />
        },
        data?.WargaPesantren && {
            id: "warpes",
            label: "Warga Pesantren",
            content: <WarPes />
        },
        data?.Progress && {
            id: "progress",
            label: "Progress Report",
            content: <Progress />
        },
        data?.Kunjungan_Mahrom && {
            id: "Kunjungan Mahrom",
            label: "Kunjungan Mahrom",
            content: <Progress />
        },
        data?.Status_Santri && {
            id: "Status Santri",
            label: "Status Santri",
            content: <Progress />
        },
    ].filter(Boolean); // Hapus tab yang tidak punya data    

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
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full relative max-h-[90vh] flex flex-col">
                            {/* Tombol Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            {/* Header */}
                            <div className="pb-4">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail Alumni</Dialog.Title>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {loading && <p>Memuat data...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {data && (
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-4">
                                            <img src={data.Biodata?.foto_profil || blankProfile} alt="Foto Profil" className="w-40 h-48 object-cover rounded" />
                                            <div>
                                                <p><strong>Nama:</strong> {data.Biodata?.nama}</p>
                                                <p><strong>NIUP:</strong> {data.Biodata?.niup}</p>
                                                <p><strong>NIK:</strong> {data.Biodata?.nik_nopassport}</p>
                                                <p><strong>Kota Asal:</strong> {data.Biodata?.kabupaten}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 border-b pb-2 flex space-x-4 overflow-x-auto">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                                    onClick={() => setActiveTab(tab.id)}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-4 text-right space-x-2">
                                <Link to="/formulir">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                                        Buka di Formulir
                                    </button>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default TesModal;
