import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import blankProfile from "../assets/blank_profile.png";
import { Link } from "react-router-dom";

const Modal = ({ item, onClose }) => {
    const [activeTab, setActiveTab] = useState("biodata");

    const tabs = [
        { id: "biodata", label: "Biodata", content: <Biodata student={item} /> },
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
        { id: "warpes", label: "Warga Pesantren", content: <WarPes /> },
        { id: "progress", label: "Progress Report", content: <Progress /> },
    ];

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

                            {/* Tombol Close (Tetap di Atas) */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            {/* Header (Tidak Ikut Scroll) */}
                            <div className="pb-4">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Data Pengajar</Dialog.Title>
                            </div>

                            {/* Konten yang Bisa Di-scroll */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {/* <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-4">
                                    <img src={item.foto_profil || blankProfile} alt="Foto Profil" className="w-40 h-48 object-cover rounded" />
                                    <div>
                                        <p><strong>Nama:</strong> {item.nama}</p>
                                        <p><strong>NIUP:</strong> {item.niup}</p>
                                        <p><strong>NIK:</strong> {item.nik}</p>
                                        <p><strong>Lembaga:</strong> {item.lembaga}</p>
                                        <p><strong>Kota Asal:</strong> {item.kota_asal}</p>
                                    </div>
                                </div> */}

                                {/* Tab Navigasi */}
                                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
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




                                {/* Konten Tab */}
                                <div className="p-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
                            </div>

                            {/* Footer (Tidak Ikut Scroll) */}
                            <div className="mt-4 pt-4 text-right space-x-2">
                                <Link to="/formulir">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                                    >
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

export default Modal;

const Biodata = ({ student }) => (
    <div>
        <h1 className="text-xl font-bold">Biodata</h1>
        <p>Nama: {student.nama}</p>
        <p>NIUP: {student.niup}</p>
        <p>NIK: {student.nik}</p>
        <p>Lembaga: {student.lembaga}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
        <p>Kota Asal: {student.kota_asal}</p>
    </div>
);
const Keluarga = () => <h1 className="text-xl font-bold">Data Keluarga</h1>;
const Santri = () => <h1 className="text-xl font-bold">Informasi Santri</h1>;
const WaliAsuh = () => <h1 className="text-xl font-bold">Wali Asuh</h1>;
const Pendidikan = () => <h1 className="text-xl font-bold">Pendidikan</h1>;
const Pengajar = () => <h1 className="text-xl font-bold">Pengajar</h1>;
const Karyawan = () => <h1 className="text-xl font-bold">Karyawan</h1>;
const Pengurus = () => <h1 className="text-xl font-bold">Pengurus</h1>;
const Khadam = () => <h1 className="text-xl font-bold">Khadam</h1>;
const Berkas = () => <h1 className="text-xl font-bold">Berkas</h1>;
const WarPes = () => <h1 className="text-xl font-bold">Warga Pesantren</h1>;
const Progress = () => <h1 className="text-xl font-bold">Progress Report Peserta Didik</h1>;
const DomisiliSantri = () => <h1 className="text-xl font-bold">Domisili Santri</h1>;
