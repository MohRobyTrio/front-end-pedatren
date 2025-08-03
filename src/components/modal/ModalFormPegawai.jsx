import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSave, FaUndo } from "react-icons/fa";
import FormBiodata from "../../content_modal/input/pegawai/FormBiodata";
import FormKaryawan from "../../content_modal/input/pegawai/FormKaryawan";
import FormPengajar from "../../content_modal/input/pegawai/FormPengajar";
import FormPengurus from "../../content_modal/input/pegawai/FormPengurus";
import FormWaliKelas from "../../content_modal/input/pegawai/FormWaliKelas";
import FormBerkasPegawai from "../../content_modal/input/pegawai/FormBerkas";
import { jenisBerkasList } from "../../data/menuData";
import Swal from "sweetalert2";

const MultiStepFormPegawai = ({ isOpen, onClose, formState }) => {
    const { activeTab, control, errors, handleSubmit, nextStep, prevStep, register, setActiveTab, setValue, resetData, unlockedTabs, watch, onValidSubmit, onInvalidSubmit, selectedTinggal,
        setSelectedTinggal,
        isLainnya,
        setLainnyaValue,
        lainnyaValue } = formState;
    const [biodataHandlers, setBiodataHandlers] = useState({});

    const handleReset = async () => {
        const result = await Swal.fire({
            title: 'Yakin ingin mereset data?',
            text: 'Semua data yang telah diisi akan dihapus.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Reset!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            resetData();

            if (activeTab === 0 && biodataHandlers?.handleFilterChangeNegara) {
                biodataHandlers.handleFilterChangeNegara({
                    negara: null,
                    provinsi: null,
                    kabupaten: null,
                    kecamatan: null
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Data berhasil direset',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };


    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    useEffect(() => {
        setValue("modalPegawai.tinggal_bersama", isLainnya ? lainnyaValue : selectedTinggal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTinggal, lainnyaValue, setValue]);

    const tabs = [
        {
            id: 0,
            label: "Biodata",
            content: <FormBiodata register={register} watch={watch} setValue={setValue} control={control} activeTab={activeTab} exposeHandler={(handlers) => setBiodataHandlers(handlers)} selectedTinggal={selectedTinggal} setSelectedTinggal={setSelectedTinggal} isLainnya={isLainnya} setLainnyaValue={setLainnyaValue} />
        },
        {
            id: 1,
            label: "Karyawan",
            content: <FormKaryawan register={register} watch={watch} setValue={setValue} activeTab={activeTab} />
        },
        {
            id: 2,
            label: "Pengajar",
            content: <FormPengajar register={register} watch={watch} setValue={setValue} activeTab={activeTab} />
        },
        {
            id: 3,
            label: "Pengurus",
            content: <FormPengurus register={register} watch={watch} setValue={setValue} activeTab={activeTab} />
        },
        {
            id: 4,
            label: "Wali Kelas",
            content: <FormWaliKelas register={register} watch={watch} setValue={setValue} control={control} activeTab={activeTab} />
        },
        {
            id: 5,
            label: "Berkas",
            content: <FormBerkasPegawai errors={errors} control={control} setValue={setValue} jenisBerkasList={jenisBerkasList} />
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
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Tambah Data Pegawai</Dialog.Title>
                            </div>
                            <form
                                onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
                                className="flex-1 overflow-y-auto p-2"
                                ref={contentRef}>
                                {/* {renderStep()} */}
                                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500">
                                    {tabs.map((tab) => (
                                        <li key={tab.id}>
                                            <button
                                                type="button"
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
                                            onClick={handleReset}
                                            className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                                        >
                                            <FaUndo />
                                            Reset
                                        </button>
                                    )}
                                    {activeTab < tabs.length - 1 ? (
                                        <button
                                            onClick={nextStep}
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Selanjutnya
                                            <FaArrowRight />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
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
};

export default MultiStepFormPegawai;