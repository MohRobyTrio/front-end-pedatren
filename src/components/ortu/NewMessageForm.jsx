import { Fragment, useState } from 'react';
import { Send } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import { useActiveChild } from './useActiveChild';

export function NewMessageForm({ onSubmit, isOpen, onClose, isSending, error }) {
    const { activeChild } = useActiveChild();
    
    // 2. Sederhanakan state, kita hanya perlu 'content'
    const [content, setContent] = useState('');

    // 3. Ubah handleSubmit menjadi async
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Panggil onSubmit (yang terhubung ke kirimPesan di hook)
        // kirimPesan akan mengembalikan true jika berhasil
        
        const berhasil = await onSubmit(content);

        if (berhasil) {
            setContent(''); // Kosongkan form jika berhasil
            // Biarkan parent (PesanPage) yang memutuskan untuk menutup modal
            // onClose(); 
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="p-4 sm:p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <Dialog.Title as="h3" className="flex items-center gap-2 text-lg sm:text-xl font-medium">
                                                <Send className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                                                Kirim Pesan Baru
                                            </Dialog.Title>
                                            <button
                                                onClick={onClose}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                disabled={isSending} // Disable tombol close saat mengirim
                                            >
                                                <FaTimes className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Kirim kepada
                                                </label>
                                                <div className="px-3 py-3 border border-gray-200 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900 font-medium">
                                                        {activeChild?.nama || "Santri"}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        NIS: {activeChild?.nis || "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="newContent" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Isi Pesan
                                                </label>
                                                <textarea
                                                    id="newContent"
                                                    placeholder="Tulis pesan Anda di sini (min. 5 karakter)..."
                                                    value={content} // Gunakan state 'content'
                                                    onChange={(e) => setContent(e.target.value)} // Gunakan 'setContent'
                                                    rows={4}
                                                    required
                                                    minLength={5} // Tambahkan validasi HTML
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
                                                    disabled={isSending} // 4. Disable saat loading
                                                />
                                            </div>
                                            
                                            {/* 4. Tampilkan error jika ada */}
                                            {/* {error && (
                                                <p className="text-sm text-red-600">
                                                    {error}
                                                </p>
                                            )} */}

                                            <button
                                                type="submit"
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                disabled={isSending || content.length < 5} // 4. Disable saat loading
                                            >
                                                <Send className="h-4 w-4" />
                                                {/* 4. Ubah teks tombol saat loading */}
                                                {isSending ? 'Mengirim...' : 'Kirim Pesan'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}