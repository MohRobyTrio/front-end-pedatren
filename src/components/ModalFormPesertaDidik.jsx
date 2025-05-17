import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';
import FormBiodata from '../content_modal/input/FormBiodata';
import FormKeluarga from '../content_modal/input/FormKeluarga';
import FormDomisiliPendidikan from '../content_modal/input/FormDomisiliPendidikan';
import FormBerkas from '../content_modal/input/FormBerkas';

export default function MultiStepModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState(0);
    const [unlockedTabs, setUnlockedTabs] = useState([0]);
    const { register, handleSubmit, trigger, 
        // watch, setValue, 
        formState: { errors } } = useForm();

    const nextStep = async () => {
        const valid = await trigger(getFieldsForTab(activeTab));
        if (!valid) return;

        const nextTab = activeTab + 1;
        if (!unlockedTabs.includes(nextTab)) {
            setUnlockedTabs([...unlockedTabs, nextTab]);
        }
        setActiveTab(nextTab);
    };

    const prevStep = () => {
        const prevTab = activeTab - 1;
        if (prevTab >= 0) {
            setActiveTab(prevTab);
        }
    };

    const getFieldsForTab = (tabId) => {
        switch (tabId) {
            case 0:
                return ['nama', 'nik', 'negara_id']; // tambahkan field yang required
            case 1:
                return ['no_kk', 'nama_ayah'];
            case 2:
                return ['jalan', 'kode_pos', 'jenjang_pendidikan_terakhir', 'nama_pendidikan_terakhir'];
            case 3:
                return ['berkas[0].jenis_berkas_id', 'berkas[0].file_path'];
            default:
                return [];
        }
    };


    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Proses data sesuai dengan struktur API
            formData.append('nama', data.nama);
            formData.append('nik', data.nik);
            formData.append('negara_id', data.negara_id);
            formData.append('provinsi_id', data.provinsi_id);
            formData.append('kabupaten_id', data.kabupaten_id);
            formData.append('kecamatan_id', data.kecamatan_id);
            formData.append('jalan', data.jalan);
            formData.append('kode_pos', data.kode_pos);
            formData.append('no_passport', data.no_passport);
            formData.append('jenis_kelamin', data.jenis_kelamin);
            formData.append('tanggal_lahir', data.tanggal_lahir);
            formData.append('tempat_lahir', data.tempat_lahir);
            formData.append('no_telepon', data.no_telepon);
            formData.append('no_telepon_2', data.no_telepon_2);
            formData.append('email', data.email);
            formData.append('jenjang_pendidikan_terakhir', data.jenjang_pendidikan_terakhir);
            formData.append('nama_pendidikan_terakhir', data.nama_pendidikan_terakhir);
            formData.append('anak_keberapa', data.anak_keberapa);
            formData.append('dari_saudara', data.dari_saudara);
            formData.append('tinggal_bersama', data.tinggal_bersama);

            formData.append('no_kk', data.no_kk);
            formData.append('nik_ayah', data.nik_ayah);
            formData.append('nama_ayah', data.nama_ayah);
            formData.append('tempat_lahir_ayah', data.tempat_lahir_ayah);
            formData.append('tanggal_lahir_ayah', data.tanggal_lahir_ayah);
            formData.append('no_telepon_ayah', data.no_telepon_ayah);
            formData.append('pekerjaan_ayah', data.pekerjaan_ayah);
            formData.append('penghasilan_ayah', data.penghasilan_ayah);

            formData.append('nik_ibu', data.nik_ibu);
            formData.append('nama_ibu', data.nama_ibu);
            formData.append('tempat_lahir_ibu', data.tempat_lahir_ibu);
            formData.append('tanggal_lahir_ibu', data.tanggal_lahir_ibu);
            formData.append('no_telepon_ibu', data.no_telepon_ibu);
            formData.append('pekerjaan_ibu', data.pekerjaan_ibu);
            formData.append('penghasilan_ibu', data.penghasilan_ibu);

            formData.append('nik_wali', data.nik_wali);
            formData.append('nama_wali', data.nama_wali);
            formData.append('tempat_lahir_wali', data.tempat_lahir_wali);
            formData.append('tanggal_lahir_wali', data.tanggal_lahir_wali);
            formData.append('no_telepon_wali', data.no_telepon_wali);
            formData.append('pekerjaan_wali', data.pekerjaan_wali);
            formData.append('penghasilan_wali', data.penghasilan_wali);

            // Proses berkas
            if (data.berkas && data.berkas.length > 0) {
                data.berkas.forEach((file, index) => {
                    formData.append(`berkas[${index}][jenis_berkas_id]`, file.jenis_berkas_id);
                    formData.append(`berkas[${index}][file_path]`, file.file_path[0]);
                });
            }

            // Kirim data ke API
            // const response = await fetch('/api/peserta/store', {
            //     method: 'POST',
            //     body: formData,
            // });

            // if (!response.ok) {
            //     throw new Error('Gagal menyimpan data');
            // }

            // const result = await response.json();
            // console.log('Data berhasil disimpan:', result);
            // onClose();
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    const tabs = [
        {
            id: 0,
            label: "Biodata",
            content: <FormBiodata register={register} errors={errors} />
        },
        {
            id: 1,
            label: "Keluarga",
            content: <FormKeluarga register={register} errors={errors} />
        },
        {
            id: 2,
            label: "Domisili & Pendidikan",
            content: <FormDomisiliPendidikan register={register} errors={errors} />
        },
        {
            id: 3,
            label: "Berkas",
            content: <FormBerkas register={register} errors={errors} />
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
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Tambah Data Peserta Didik</Dialog.Title>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-2">
                                {/* {renderStep()} */}
                                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500">
                                    {tabs.map((tab) => (
                                        <li key={tab.id}>
                                            <button
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
                                <div className="ml-auto">
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
