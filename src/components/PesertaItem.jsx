// import blankProfile from "../assets/blank_profile.png";

// const PesertaItem = ({ student }) => {
//     return (
//         // <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
//         //     <img
//         //         alt="Student Photo"
//         //         className="w-20 h-24 object-cover"
//         //         height={50}
//         //         src={student.foto_profil || blankProfile }
//         //         width={50}
//         //         loading="lazy"  
//         //         type="image/webp"
//         //     />
//         //     <div>
//         //         <h2 className="font-semibold">{student.nama || "-"}</h2>
//         //         <p className="text-gray-600">NIUP: {student.niup || "-"}</p>
//         //         <p className="text-gray-600">{student.lembaga || "-"}</p>
//         //     </div>
//         // </div>

//         <div key={student.id_pengajar} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
//             <img
//                 alt={student.nama || "-"}
//                 className="w-20 h-24 object-cover"
//                 src={student.foto_profil || blankProfile}
//                 width={50}
//                 height={50}
//             />
//             <div>
//                 <h2 className="font-semibold">{student.nama}</h2>
//                 <p className="text-gray-600">NIUP: {student.niup}</p>
//                 <p className="text-gray-600">{student.lembaga}</p>
//             </div>
//         </div>
//     );
// };

// export default PesertaItem;

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import blankProfile from "../assets/blank_profile.png";

const PesertaItem = ({ student }) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            {/* Kartu Peserta */}
            <div
                key={student.id_pengajar}
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
                onClick={() => setOpenModal(true)}
            >
                <img
                    alt={student.nama || "-"}
                    className="w-20 h-24 object-cover"
                    src={student.foto_profil || blankProfile}
                    width={50}
                    height={50}
                />
                <div>
                    <h2 className="font-semibold">{student.nama}</h2>
                    <p className="text-gray-600">NIUP: {student.niup}</p>
                    <p className="text-gray-600">{student.lembaga}</p>
                </div>
            </div>

            {/* Modal dengan Headless UI */}
            <Transition appear show={openModal} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setOpenModal(false)}>
                    {/* Overlay dengan transparansi */}
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

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="transition-transform duration-300 ease-out"
                            enterFrom="scale-95 opacity-0"
                            enterTo="scale-100 opacity-100"
                            leave="transition-transform duration-200 ease-in"
                            leaveFrom="scale-100 opacity-100"
                            leaveTo="scale-95 opacity-0"
                        >
                            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative z-50">
                                {/* Header */}
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    Data Pengajar
                                </Dialog.Title>

                                {/* Body */}
                                <div className="flex space-x-4 mt-4">
                                    <img
                                        src={student.foto_profil || blankProfile}
                                        alt="Foto Profil"
                                        className="w-32 h-40 object-cover rounded"
                                    />
                                    <div>
                                        <p><strong>Nama:</strong> {student.nama}</p>
                                        <p><strong>NIUP:</strong> {student.niup}</p>
                                        <p><strong>NIK:</strong> {student.nik}</p>
                                        <p><strong>Lembaga:</strong> {student.lembaga}</p>
                                        <p><strong>Kota Asal:</strong> {student.kota_asal}</p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={() => setOpenModal(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default PesertaItem;
