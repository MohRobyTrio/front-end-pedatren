import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import useDropdownBerkas from '../../../hooks/hook_dropdown/DropdownBerkas';

export default function ModalBerkas({ isOpen, onClose, onSubmit, initialData }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jenisBerkasId, setJenisBerkasId] = useState('');
    const {jenisBerkasList} = useDropdownBerkas();

    useEffect(() => {
        if (isOpen) {
            setJenisBerkasId('');
            setSelectedFile(null)
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setJenisBerkasId(initialData.jenis_berkas_id || '');
            // setSelectedFile(initialData.file_xpath); // Reset file saat edit
            setSelectedFile(null); // Reset file saat edit
        } else {
            setJenisBerkasId('');
            setSelectedFile(null);
        }
    }, [initialData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // if (file && file.size > 2 * 1024 * 1024) {
        //     alert("Ukuran file maksimal 2MB");
        //     return;
        // }
        setSelectedFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedFile && !initialData) {
            alert('File wajib diunggah.');
            return;
        }

        const formData = new FormData();
        formData.append('jenis_berkas_id', jenisBerkasId);

        if (selectedFile) {
            formData.append('file_path', selectedFile);
        }
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }


        onSubmit({ formData, id: initialData?.id || null });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                                aria-label="Close modal"
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>

                            <Dialog.Title className="text-xl font-semibold mb-4">
                                {initialData ? 'Edit Berkas' : 'Tambah Berkas'}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="jenis_berkas_id" className="block text-gray-700">Jenis Berkas *</label>
                                    <select
                                        id="jenis_berkas_id"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        onChange={(e) => setJenisBerkasId(e.target.value)}
                                        value={jenisBerkasId}
                                        required
                                    >
                                        <option value="">Pilih Jenis Berkas</option>
                                        {jenisBerkasList.map((item, idx) => (
                                            <option key={idx} value={item.id}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">File *</label>
                                    <div className="p-2 rounded-xl border border-gray-300 bg-white">
                                        <label
                                            htmlFor="file_path"
                                            className={`relative flex flex-col items-center justify-center w-full aspect-[4/3] min-h-[150px] cursor-pointer ${selectedFile ? '' : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg'}`}
                                        >
                                            {selectedFile ? (
                                                typeof selectedFile === 'object' && selectedFile.type?.startsWith("image") ? (
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={URL.createObjectURL(selectedFile)}
                                                            alt="preview"
                                                            className="h-full object-contain w-full"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedFile(null)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : typeof selectedFile === 'string' ? (
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={selectedFile}
                                                            alt="preview"
                                                            className="h-full object-contain w-full"
                                                            onError={() => setSelectedFile(null)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedFile(null)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"                                                            
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <p className="text-sm font-semibold">File {selectedFile.name} telah diunggah</p>
                                                        <p className="text-blue-600 underline">Klik untuk ganti</p>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">PDF, JPG, PNG</p>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                id="file_path"
                                                accept=".pdf,image/jpeg,image/jpg,image/png"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {/* {initialData && (
                                        <div className="text-sm text-gray-500 italic mt-1">
                                            *Kosongkan jika tidak ingin mengganti file.
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                                    >
                                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                                        {initialData ? 'Update' : 'Upload'}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
