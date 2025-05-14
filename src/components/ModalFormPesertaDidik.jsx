import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';

const steps = ['Biodata', 'Orang Tua', 'Berkas'];

export default function MultiStepModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

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
            const response = await fetch('/api/peserta/store', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Gagal menyimpan data');
            }

            const result = await response.json();
            console.log('Data berhasil disimpan:', result);
            onClose();
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    // const isStepValid = () => {
    //     const stepFields = [
    //         ['nama', 'nik', 'negara_id'], // Step 0
    //         ['no_kk', 'nama_ayah'],       // Step 1
    //         ['berkas[0].jenis_berkas_id', 'berkas[0].file_path'] // Step 2
    //     ];

    //     return stepFields[currentStep].every((field) => {
    //         const value = watch(field);
    //         if (Array.isArray(value)) {
    //             return value.length > 0;
    //         }
    //         return value !== undefined && value !== '';
    //     });
    // };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <>
                        <div>
                            <label>Nama</label>
                            <input {...register('nama', { required: true })} />
                            {errors.nama && <span>Nama wajib diisi</span>}
                        </div>
                        <div>
                            <label>NIK</label>
                            <input {...register('nik', { required: true })} />
                            {errors.nik && <span>NIK wajib diisi</span>}
                        </div>
                        <div>
                            <label>Negara ID</label>
                            <input {...register('negara_id', { required: true })} />
                            {errors.negara_id && <span>Negara ID wajib diisi</span>}
                        </div>
                        {/* Tambahkan field lain sesuai kebutuhan */}
                    </>
                );
            case 1:
                return (
                    <>
                        <div>
                            <label>No KK</label>
                            <input {...register('no_kk', { required: true })} />
                            {errors.no_kk && <span>No KK wajib diisi</span>}
                        </div>
                        <div>
                            <label>Nama Ayah</label>
                            <input {...register('nama_ayah', { required: true })} />
                            {errors.nama_ayah && <span>Nama Ayah wajib diisi</span>}
                        </div>
                        <div>
                            <label>NIK Ayah</label>
                            <input {...register('nik_ayah')} />
                        </div>
                        {/* Tambahkan field lain sesuai kebutuhan */}
                    </>
                );
            case 2:
                return (
                    <>
                        <div>
                            <label>Jenis Berkas ID</label>
                            <input {...register('berkas[0].jenis_berkas_id', { required: true })} />
                            {errors.berkas?.[0]?.jenis_berkas_id && <span>Jenis Berkas ID wajib diisi</span>}
                        </div>
                        <div>
                            <label>File</label>
                            <input type="file" {...register('berkas[0].file_path', { required: true })} />
                            {errors.berkas?.[0]?.file_path && <span>File wajib diunggah</span>}
                        </div>
                        {/* Tambahkan field lain sesuai kebutuhan */}
                    </>
                );
            default:
                return null;
        }
    };

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
                                {renderStep()}
                            </form>

                            <div className="mt-4 pt-4 text-right space-x-2">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="inline-flex items-center gap-2 rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                    >
                                        <FaArrowLeft />
                                        Sebelumnya
                                    </button>
                                )}
                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    // disabled={!isStepValid()}
                                    // className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isStepValid()
                                    //         ? 'bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-500'
                                    //         : 'bg-blue-300 cursor-not-allowed'
                                    //     }`}
                                    >
                                        Selanjutnya
                                        <FaArrowRight />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        
                                        className="inline-flex items-center gap-2 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                    >
                                        <FaSave />
                                        Simpan
                                    </button>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
