import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ModalPindahDomisili = ({ isOpen, onClose, formData, setFormData, handleSubmit, selectedWilayah, filterWilayah, handleFilterChangeWilayah, setEditId }) => {

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
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
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Update Data Domisili</Dialog.Title>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-gray-50 p-4 rounded shadow">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Wilayah</label>
                                        <select
                                            className={`w-full border border-gray-300 rounded p-2 ${filterWilayah.wilayah.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                                }`}
                                            value={formData.wilayah || selectedWilayah.wilayah || ""}
                                            onChange={(e) => {
                                                setFormData({ ...formData, wilayah: e.target.value });
                                                handleFilterChangeWilayah({ wilayah: e.target.value });
                                            }}
                                            disabled={filterWilayah.wilayah.length <= 1}
                                            required
                                        >
                                            <option value="">-- Pilih Wilayah --</option>
                                            {filterWilayah.wilayah.map((option, idx) => (
                                                <option key={idx} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Blok</label>
                                        <select
                                            className={`w-full border border-gray-300 rounded p-2 ${filterWilayah.blok.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                                }`}
                                            value={formData.blok || selectedWilayah.blok || ""}
                                            onChange={(e) => {
                                                setFormData({ ...formData, blok: e.target.value });
                                                handleFilterChangeWilayah({ blok: e.target.value });
                                            }}
                                            disabled={filterWilayah.blok.length <= 1}
                                            required
                                        >
                                            <option value="">-- Pilih Blok --</option>
                                            {filterWilayah.blok.map((option, idx) => (
                                                <option key={idx} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Kamar</label>
                                        <select
                                            className={`w-full border border-gray-300 rounded p-2 ${filterWilayah.kamar.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                                }`}
                                            value={formData.kamar || selectedWilayah.kamar || ""}
                                            onChange={(e) => {
                                                setFormData({ ...formData, kamar: e.target.value });
                                                handleFilterChangeWilayah({ kamar: e.target.value });
                                            }}
                                            disabled={filterWilayah.kamar.length <= 1}
                                            required
                                        >
                                            <option value="">-- Pilih Kamar --</option>
                                            {filterWilayah.kamar.map((option, idx) => (
                                                <option key={idx} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <TextInput
                                        label="Waktu Mulai"
                                        type="date"
                                        value={formData.waktuMulai}
                                        onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                                        required
                                    />

                                    {/* <TextInput
                                        label="Waktu Akhir"
                                        type="date"
                                        value={formData.waktuAkhir}
                                        onChange={(e) => setFormData({ ...formData, waktuAkhir: e.target.value })}
                                    /> */}
                                </div>

                                <div className="flex justify-start gap-2 mt-1">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                        onClick={() => {
                                            setFormData({
                                                waktuMulai: '',
                                                // waktuAkhir: '',
                                                // tambahkan field lain jika ada
                                            });
                                            // setShowForm(false);
                                            setEditId(null);
                                        }}
                                    >
                                        Batal
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                        Simpan
                                    </button>
                                </div>
                            </form>

                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>

    );
};

const TextInput = ({ label, value, onChange, type = "text", required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            className="mt-1 block w-full p-2 border rounded-md"
            value={value}
            onChange={onChange}
            required={required}
        />
    </div>
);

export default ModalPindahDomisili;