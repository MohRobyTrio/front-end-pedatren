import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useDropdownPengajar from "../hooks/hook_dropdown/DropdownPengajar";

export const ModalSelectPengajar = ({ isOpen, onClose, onPengajarSelected }) => {
    const [search, setSearch] = useState("");

    const {
         menuPengajar
        } = useDropdownPengajar();

    const menuPengajarFilter = menuPengajar.filter((s) =>
        s.nama?.toLowerCase().includes(search.toLowerCase())
        // s.niup?.toString().includes(search)
    );

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="transition-transform duration-300"
                            enterFrom="scale-95 opacity-0"
                            enterTo="scale-100 opacity-100"
                            leave="transition-transform duration-200"
                            leaveFrom="scale-100 opacity-100"
                            leaveTo="scale-95 opacity-0"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                                <Dialog.Title className="text-lg font-medium text-gray-900 mb-4 text-center">
                                    Pilih Pengajar
                                </Dialog.Title>

                                <input
                                    type="text"
                                    placeholder="Cari nama atau NIUP..."
                                    className="w-full p-2 border rounded mb-4"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded">
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="bg-gray-100 sticky top-0">
                                                <tr>
                                                    <th className="p-2">NIUP</th>
                                                    <th className="p-2">Nama</th>
                                                    <th className="p-2">Umur</th>
                                                    <th className="p-2">Pangkalan Lembaga</th>
                                                    <th className="p-2">Golongan</th>
                                                    <th className="p-2">Pendidikan Terakhir</th>
                                                </tr>
                                            </thead>
                                        <tbody>
                                            {menuPengajarFilter
                                                .filter(s => s.id !== null)
                                                .map((s, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-blue-50 cursor-pointer"
                                                        onClick={() => {
                                                            onPengajarSelected(s);
                                                            onClose();
                                                        }}
                                                    >
                                                        <td className="p-2">{s.niup}</td>
                                                        <td className="p-2">{s.nama}</td>
                                                        <td className="p-2">{s.umur}</td>
                                                        <td className="p-2">{s.lembaga}</td>
                                                        <td className="p-2">{s.golongan}</td>
                                                        <td className="p-2">{s.pendidikan_terakhir}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                        </table>
                                    </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
