import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft, FaArrowRight, FaSave, FaUndo } from 'react-icons/fa';
import { jenisBerkasList } from '../../data/menuData';
import FormBiodataAnakPegawai from '../../content_modal/input/anak_pegawai/FormBiodata';
import FormKeluargaAnakPegawai from '../../content_modal/input/anak_pegawai/FormKeluarga';
import FormDomisiliPendidikanAnakPegawai from '../../content_modal/input/anak_pegawai/FormDomisiliPendidikan';
import FormBerkasAnakPegawai from '../../content_modal/input/anak_pegawai/FormBerkas';

export default function MultiStepModalAnakPegawai({ isOpen, onClose, formState }) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        resetData,
        watch,
        errors,
        activeTab,
        unlockedTabs,
        setActiveTab,
        nextStep,
        prevStep,
        onValidSubmit,
        onInvalidSubmit
    } = formState;

    const tabs = [
        {
            id: 0,
            label: "Biodata",
            content: <FormBiodataAnakPegawai register={register} watch={watch} setValue={setValue} control={control} activeTab={activeTab} />
        },
        {
            id: 1,
            label: "Keluarga",
            content: <FormKeluargaAnakPegawai register={register} errors={errors} />
        },
        {
            id: 2,
            label: "Domisili & Pendidikan",
            content: <FormDomisiliPendidikanAnakPegawai register={register} control={control} watch={watch} activeTab={activeTab} setValue={setValue} />
        },
        {
            id: 3,
            label: "Berkas",
            content: <FormBerkasAnakPegawai errors={errors} control={control} setValue={setValue} jenisBerkasList={jenisBerkasList} />
        }
    ]

    return (
        <Transition appear show={isOpen} as={Fragment}>
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
                            {/* Tombol Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            {/* Header */}
                            <div className="pb-4">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Tambah Data Anak Pegawai</Dialog.Title>
                            </div>
                            <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="flex-1 overflow-y-auto p-2">
                                {/* {renderStep()} */}
                                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500">
                                    {tabs.map((tab) => (
                                        <li key={tab.id}>
                                            <button
                                                type='button'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (unlockedTabs.includes(tab.id)) setActiveTab(tab.id);
                                                }}
                                                className={`inline-block p-3 rounded-t-lg border-b-2 ${activeTab === tab.id
                                                    ? 'text-blue-600 border-blue-600 bg-gray-200'
                                                    : unlockedTabs.includes(tab.id)
                                                        ? 'border-transparent hover:text-gray-600 hover:bg-gray-50'
                                                        : 'border-transparent text-gray-300 cursor-not-allowed'
                                                    }`}
                                                disabled={!unlockedTabs.includes(tab.id)}
                                            >
                                                {tab.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>

                            </form>

                            <div className="mt-4 pt-4 flex justify-between">
                                {activeTab > 0 && (
                                    <button
                                        onClick={prevStep}
                                        className="inline-flex items-center gap-2 rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                                    >
                                        <FaArrowLeft />
                                        Sebelumnya
                                    </button>
                                )}
                                <div className="ml-auto space-x-2">
                                    {activeTab < tabs.length && (
                                        <button
                                            type="button"
                                            onClick={resetData}
                                            className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                                        >
                                            <FaUndo />
                                            Reset
                                        </button>
                                    )}
                                    {activeTab < tabs.length - 1 ? (
                                        <button
                                            type='button'
                                            onClick={nextStep}
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Selanjutnya
                                            <FaArrowRight />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSubmit(onValidSubmit, onInvalidSubmit)}
                                            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                        >
                                            <FaSave />
                                            Simpan
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
