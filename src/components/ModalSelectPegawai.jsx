import { Dialog, Transition } from "@headlessui/react";
// --- MODIFIKASI: Tambahkan useMemo ---
import { Fragment, useState, useMemo } from "react";
import useDropdownPegawai from "../hooks/hook_dropdown/DropdownPegawai";
// --- BARU: Import ikon sorting ---
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export const ModalSelectPegawai = ({ isOpen, onClose, onPegawaiSelected }) => {
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

    const { menuPegawai } = useDropdownPegawai();

    const dataSource = menuPegawai || [];

    const menuPegawaiFilter = dataSource.filter((p) =>
        p.nama?.toLowerCase().includes(search.toLowerCase()) ||
        p.nik_or_passport?.toString().includes(search)
    );

    const handleSort = (key) => {
        setSortConfig(currentConfig => {
            if (currentConfig.key !== key) {
                return { key: key, direction: 'asc' };
            }
            if (currentConfig.direction === 'asc') {
                return { key: key, direction: 'desc' }; 
            }
            if (currentConfig.direction === 'desc') {
                return { key: key, direction: 'default' }; 
            }
            return { key: key, direction: 'asc' };
        });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <FaSort className="inline-block ml-1 h-3 w-3 text-gray-400" />;
        }
        if (sortConfig.direction === 'asc') {
            return <FaSortUp className="inline-block ml-1 h-3 w-3 text-blue-600" />;
        }
        if (sortConfig.direction === 'desc') {
            return <FaSortDown className="inline-block ml-1 h-3 w-3 text-blue-600" />;
        }
        return <FaSort className="inline-block ml-1 h-3 w-3 text-gray-400" />;
    };

    const sortedData = useMemo(() => {
        const activePegawai = menuPegawaiFilter.filter(
            p => p.biodata_id != null && p.status_aktif.toLowerCase() == "aktif"
        );

        const dataToDisplay = [...activePegawai]; 

        if (sortConfig.direction !== 'default' && sortConfig.key) {
            dataToDisplay.sort((a, b) => {
                const valA = a[sortConfig.key] || '';
                const valB = b[sortConfig.key] || '';

                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0; 
            });
        }

        return dataToDisplay;

    }, [menuPegawaiFilter, sortConfig]); 

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={onClose}>
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
                                    Pilih Pegawai
                                </Dialog.Title>

                                <input
                                    type="text"
                                    placeholder="Cari nama, NIP, atau NIK..."
                                    className="w-full p-2 border rounded mb-4"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded">
                                    <table className="min-w-full text-sm text-left">
                                        {/* --- THEAD DIMODIFIKASI --- */}
                                        <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                                <th
                                                    className="p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                                                    onClick={() => handleSort('nama')}
                                                >
                                                    Nama {getSortIcon('nama')}
                                                </th>
                                                <th
                                                    className="p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                                                    onClick={() => handleSort('nik_or_passport')}
                                                >
                                                    NIK/No. Passport {getSortIcon('nik_or_passport')}
                                                </th>
                                                <th
                                                    className="p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                                                    onClick={() => handleSort('jenis_kelamin')}
                                                >
                                                    Jenis Kelamin {getSortIcon('jenis_kelamin')}
                                                </th>
                                                <th
                                                    className="p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                                                    onClick={() => handleSort('status')}
                                                >
                                                    Status {getSortIcon('status')}
                                                </th>
                                            </tr>
                                        </thead>
                                        {/* --- TBODY DIMODIFIKASI --- */}
                                        <tbody>
                                            {/* Gunakan 'sortedData' dan hapus filter di sini */}
                                            {sortedData.map((p, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-blue-50 cursor-pointer"
                                                    onClick={() => {
                                                        onPegawaiSelected(p);
                                                        onClose();
                                                    }}
                                                >
                                                    <td className="p-2">{p.nama}</td>
                                                    <td className="p-2">{p.nik_or_passport}</td>
                                                    <td className="p-2">{p.jenis_kelamin}</td>
                                                    <td className="p-2">{p.status}</td>
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

