import { Fragment, useState } from 'react';
import { Send } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import { useActiveChild } from './useActiveChild';

export function NewMessageForm({ onSubmit, isOpen, onClose }) {
    const { activeChild } = useActiveChild();
    const [form, setForm] = useState({
        studentName: '',
        subject: '',
        content: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.studentName.trim() && form.subject.trim() && form.content.trim()) {
            onSubmit(form);
            setForm({ studentName: '', subject: '', content: '' });
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
                                                    placeholder="Tulis pesan Anda di sini..."
                                                    value={form.content}
                                                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                                                    rows={4}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Send className="h-4 w-4" />
                                                Kirim Pesan
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