// // import blankProfile from "../assets/blank_profile.png";

// // const PesertaItem = ({ student }) => {
// //     return (
// //         // <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
// //         //     <img
// //         //         alt="Student Photo"
// //         //         className="w-20 h-24 object-cover"
// //         //         height={50}
// //         //         src={student.foto_profil || blankProfile }
// //         //         width={50}
// //         //         loading="lazy"  
// //         //         type="image/webp"
// //         //     />
// //         //     <div>
// //         //         <h2 className="font-semibold">{student.nama || "-"}</h2>
// //         //         <p className="text-gray-600">NIUP: {student.niup || "-"}</p>
// //         //         <p className="text-gray-600">{student.lembaga || "-"}</p>
// //         //     </div>
// //         // </div>

// //         <div key={student.id_pengajar} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
// //             <img
// //                 alt={student.nama || "-"}
// //                 className="w-20 h-24 object-cover"
// //                 src={student.foto_profil || blankProfile}
// //                 width={50}
// //                 height={50}
// //             />
// //             <div>
// //                 <h2 className="font-semibold">{student.nama}</h2>
// //                 <p className="text-gray-600">NIUP: {student.niup}</p>
// //                 <p className="text-gray-600">{student.lembaga}</p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default PesertaItem;

// import { useState, Fragment } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import blankProfile from "../assets/blank_profile.png";

// const PesertaItem = ({ student }) => {
//     const [openModal, setOpenModal] = useState(false);

//     return (
//         <>
//             {/* Kartu Peserta */}
//             <div
//                 key={student.id_pengajar}
//                 className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
//                 onClick={() => setOpenModal(true)}
//             >
//                 <img
//                     alt={student.nama || "-"}
//                     className="w-20 h-24 object-cover"
//                     src={student.foto_profil || blankProfile}
//                     width={50}
//                     height={50}
//                 />
//                 <div>
//                     <h2 className="font-semibold">{student.nama}</h2>
//                     <p className="text-gray-600">NIUP: {student.niup}</p>
//                     <p className="text-gray-600">{student.lembaga}</p>
//                 </div>
//             </div>

//             {/* Modal dengan Headless UI */}
//             <Transition appear show={openModal} as={Fragment}>
//                 <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setOpenModal(false)}>
//                     {/* Overlay dengan transparansi */}
//                     <Transition.Child
//                         as={Fragment}
//                         enter="transition-opacity duration-300"
//                         enterFrom="opacity-0"
//                         enterTo="opacity-100"
//                         leave="transition-opacity duration-200"
//                         leaveFrom="opacity-100"
//                         leaveTo="opacity-0"
//                     >
//                         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//                     </Transition.Child>

//                     {/* Modal Content */}
//                     <div className="fixed inset-0 flex items-center justify-center p-4">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="transition-transform duration-300 ease-out"
//                             enterFrom="scale-95 opacity-0"
//                             enterTo="scale-100 opacity-100"
//                             leave="transition-transform duration-200 ease-in"
//                             leaveFrom="scale-100 opacity-100"
//                             leaveTo="scale-95 opacity-0"
//                         >
//                             <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative z-50">
//                                 {/* Header */}
//                                 <Dialog.Title className="text-lg font-semibold text-gray-900">
//                                     Data Pengajar
//                                 </Dialog.Title>

//                                 {/* Body */}
//                                 <div className="flex space-x-4 mt-4">
//                                     <img
//                                         src={student.foto_profil || blankProfile}
//                                         alt="Foto Profil"
//                                         className="w-32 h-40 object-cover rounded"
//                                     />
//                                     <div>
//                                         <p><strong>Nama:</strong> {student.nama}</p>
//                                         <p><strong>NIUP:</strong> {student.niup}</p>
//                                         <p><strong>NIK:</strong> {student.nik}</p>
//                                         <p><strong>Lembaga:</strong> {student.lembaga}</p>
//                                         <p><strong>Kota Asal:</strong> {student.kota_asal}</p>
//                                     </div>
//                                 </div>

//                                 {/* Footer */}
//                                 <div className="mt-4 text-right">
//                                     <button
//                                         onClick={() => setOpenModal(false)}
//                                         className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//                                     >
//                                         Tutup
//                                     </button>
//                                 </div>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </Dialog>
//             </Transition>
//         </>
//     );
// };

// export default PesertaItem;

// import { useState, Fragment } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import blankProfile from "../assets/blank_profile.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

// const PesertaItem = ({ student }) => {
//     const [openModal, setOpenModal] = useState(false);
//     const [activeTab, setActiveTab] = useState("biodata");

//     const tabs = [
//         { id: "biodata", label: "Biodata", content: <Biodata student={student} /> },
//         { id: "keluarga", label: "Keluarga", content: <Keluarga /> },
//         { id: "santri", label: "Santri", content: <Santri /> },
//         { id: "domisili", label: "Domisili Santri", content: <DomisiliSantri /> },
//         { id: "waliasuh", label: "Wali Asuh", content: <WaliAsuh /> },
//         { id: "pendidikan", label: "Pendidikan", content: <Pendidikan /> },
//         { id: "pengajar", label: "Pengajar", content: <Pengajar /> },
//         { id: "karyawan", label: "Karyawan", content: <Karyawan /> },
//         { id: "pengurus", label: "Pengurus", content: <Pengurus /> },
//         { id: "khadam", label: "Khadam", content: <Khadam /> },
//         { id: "berkas", label: "Berkas", content: <Berkas /> },
//         { id: "warpes", label: "Warga Pesantren", content: <WarPes /> },
//         { id: "progress", label: "Progress Report", content: <Progress /> },
//     ];

//     return (
//         <>
//             <div
//                 className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
//                 onClick={() => setOpenModal(true)}
//             >
//                 <img
//                     alt={student.nama || "-"}
//                     className="w-20 h-24 object-cover"
//                     src={student.foto_profil || blankProfile}
//                 />
//                 <div>
//                     <h2 className="font-semibold">{student.nama}</h2>
//                     <p className="text-gray-600">NIUP: {student.niup}</p>
//                     <p className="text-gray-600">{student.lembaga}</p>
//                 </div>
//             </div>

//             <Transition appear show={openModal} as={Fragment}>
//                 <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setOpenModal(false)}>
//                     <Transition.Child as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
//                         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//                     </Transition.Child>

//                     <div className="fixed inset-0 flex items-center justify-center p-4">
//                         <Transition.Child as={Fragment} enter="transition-transform duration-300 ease-out" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="transition-transform duration-200 ease-in" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
//                             <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full relative">
//                             <button
//                                     onClick={() => setOpenModal(false)}
//                                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                                 >
//                                     <FontAwesomeIcon icon={faTimes} className="text-xl" />
//                                 </button>
//                                 <Dialog.Title className="text-lg font-semibold text-gray-900">Data Pengajar</Dialog.Title>
                                
//                                 <div className="flex space-x-4 mt-4">
//                                     <img
//                                         src={student.foto_profil || blankProfile}
//                                         alt="Foto Profil"
//                                         className="w-40 h-48 object-cover rounded"
//                                     />
//                                     <div>
//                                         <p><strong>Nama:</strong> {student.nama}</p>
//                                         <p><strong>NIUP:</strong> {student.niup}</p>
//                                         <p><strong>NIK:</strong> {student.nik}</p>
//                                         <p><strong>Lembaga:</strong> {student.lembaga}</p>
//                                         <p><strong>Kota Asal:</strong> {student.kota_asal}</p>
//                                     </div>
//                                 </div>

//                                 <div className="mt-6 border-b pb-2 flex space-x-4 overflow-x-auto">
//                                     {tabs.map((tab) => (
//                                         <button
//                                             key={tab.id}
//                                             className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
//                                             onClick={() => setActiveTab(tab.id)}
//                                         >
//                                             {tab.label}
//                                         </button>
//                                     ))}
//                                 </div>

//                                 <div className="p-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>

//                                 <div className="mt-4 text-right">
//                                     <button onClick={() => setOpenModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Tutup</button>
//                                 </div>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </Dialog>
//             </Transition>
//         </>
//     );
// };

// export default PesertaItem;

// const Biodata = ({ student }) => (
//     <div>
//         <h1 className="text-xl font-bold">Biodata</h1>
//         <p>Nama: {student.nama}</p>
//         <p>NIUP: {student.niup}</p>
//         <p>NIK: {student.nik}</p>
//         <p>Lembaga: {student.lembaga}</p>
//         <p>Kota Asal: {student.kota_asal}</p>
//     </div>
// );
// const Keluarga = () => <h1 className="text-xl font-bold">Data Keluarga</h1>;
// const Santri = () => <h1 className="text-xl font-bold">Informasi Santri</h1>;
// const WaliAsuh = () => <h1 className="text-xl font-bold">Wali Asuh</h1>;
// const Pendidikan = () => <h1 className="text-xl font-bold">Pendidikan</h1>;
// const Pengajar = () => <h1 className="text-xl font-bold">Pengajar</h1>;
// const Karyawan = () => <h1 className="text-xl font-bold">Karyawan</h1>;
// const Pengurus = () => <h1 className="text-xl font-bold">Pengurus</h1>;
// const Khadam = () => <h1 className="text-xl font-bold">Khadam</h1>;
// const Berkas = () => <h1 className="text-xl font-bold">Berkas</h1>;
// const WarPes = () => <h1 className="text-xl font-bold">Warga Pesantren</h1>;
// const Progress = () => <h1 className="text-xl font-bold">Progress Report Peserta Didik</h1>;
// const DomisiliSantri = () => <h1 className="text-xl font-bold">Domisili Santri</h1>;

import { useState } from "react";
import blankProfile from "../assets/blank_profile.png";
import ModalPeserta from "./Modal";

const PesertaItem = ({ student }) => {
    const [openModal, setOpenModal] = useState(false);
    
    return (
        <>
            <div
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
                onClick={() => setOpenModal(true)}
            >
                <img
                    alt={student.nama || "-"}
                    className="w-20 h-24 object-cover"
                    src={student.foto_profil || blankProfile}
                />
                <div>
                    <h2 className="font-semibold">{student.nama}</h2>
                    <p className="text-gray-600">NIUP: {student.niup}</p>
                    <p className="text-gray-600">{student.lembaga}</p>
                </div>
            </div>

            {openModal && <ModalPeserta student={student} onClose={() => setOpenModal(false)} />}
        </>
    );
};

export default PesertaItem;