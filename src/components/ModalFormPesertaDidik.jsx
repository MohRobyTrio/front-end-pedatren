import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';
import FormBiodata from '../content_modal/input/peserta_didik/FormBiodata';
import FormKeluarga from '../content_modal/input/peserta_didik/FormKeluarga';
import FormDomisiliPendidikan from '../content_modal/input/peserta_didik/FormDomisiliPendidikan';
import FormBerkas from '../content_modal/input/peserta_didik/FormBerkas';
import { useMultiStepFormPesertaDidik } from '../hooks/hooks_modal/useMultiStepFormPesertaDidik';

const jenisBerkasList = [
        { id: 1, label: 'Kartu Keluarga (KK)', required: true },
        { id: 2, label: 'KTP/KIA', required: false },
        { id: 3, label: 'Akte Kelahiran', required: false },
        { id: 4, label: 'Pas Foto', required: false },
        { id: 5, label: 'Ijazah Terakhir', required: false },
        { id: 6, label: 'Fotokopi Rapor Terakhir', required: false },
        { id: 7, label: 'Surat Keterangan Sehat', required: false },
        { id: 8, label: 'BPJS / Kartu Asuransi Kesehatan', required: false },
        { id: 9, label: 'Surat Pernyataan Kesanggupan', required: false },
        { id: 10, label: 'Surat Izin Orang Tua', required: false },
        { id: 11, label: 'Surat Pernyataan Tidak Merokok', required: false },
        { id: 12, label: 'Surat Keterangan Pindah Sekolah', required: false },
        { id: 13, label: 'Surat Keterangan Lulus (SKL)', required: false },
        { id: 14, label: 'Surat Rekomendasi dari Ulama/Guru', required: false },
        { id: 15, label: 'Surat Pernyataan Bebas Narkoba', required: false },
        { id: 16, label: 'Surat Domisili (jika dari luar kota)', required: false },
        { id: 17, label: 'Surat Keterangan Anak Yatim/Piatu', required: false },
        { id: 18, label: 'Fotokopi Kartu Santri', required: false },
    ];

export default function MultiStepModal({ isOpen, onClose }) {
    const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    errors,
    activeTab,
    unlockedTabs,
    setActiveTab,
    nextStep,
    prevStep,
    onValidSubmit,
    onInvalidSubmit
  } = useMultiStepFormPesertaDidik(onClose, jenisBerkasList);

    // const onValidSubmit = async (data) => {
    //     try {
    //         const confirmResult = await Swal.fire({
    //             title: 'Yakin ingin mengirim data?',
    //             text: "Pastikan semua data sudah benar!",
    //             icon: 'question',
    //             showCancelButton: true,
    //             confirmButtonText: 'Ya, kirim',
    //             cancelButtonText: 'Batal'
    //         });

    //         if (!confirmResult.isConfirmed) {
    //             // Jika user batal, stop eksekusi submit
    //             return;
    //         }

    //         console.log("Data form:", data);
    //         const formData = new FormData();

    //         // Proses data sesuai dengan struktur API
    //         formData.append('negara_id', data.negara);
    //         formData.append('provinsi_id', data.provinsi);
    //         formData.append('kabupaten_id', data.kabupaten);
    //         formData.append('kecamatan_id', data.kecamatan);
    //         formData.append('jalan', data.jalan);
    //         formData.append('kode_pos', data.kode_pos);
    //         formData.append('nama', data.nama);

    //         formData.append('passport', data.no_passport);
    //         formData.append('nik', data.nik);

    //         formData.append('no_kk', data.no_kk);
    //         formData.append('jenis_kelamin', data.jenis_kelamin);
    //         formData.append('tanggal_lahir', data.tanggal_lahir);
    //         formData.append('tempat_lahir', data.tempat_lahir);
    //         formData.append('no_telepon', data.no_telepon);
    //         formData.append('no_telepon_2', data.no_telepon_2);
    //         formData.append('email', data.email);

    //         formData.append('jenjang_pendidikan_terakhir', data.jenjang_pendidikan_terakhir);
    //         formData.append('nama_pendidikan_terakhir', data.nama_pendidikan_terakhir);
    //         formData.append('anak_keberapa', data.anak_keberapa);
    //         formData.append('dari_saudara', data.dari_saudara);
    //         formData.append('tinggal_bersama', data.tinggal_bersama);

    //         formData.append('nama_ayah', data.nama_ayah);
    //         formData.append('nik_ayah', data.nik_ayah);
    //         formData.append('tempat_lahir_ayah', data.tempat_lahir_ayah);
    //         formData.append('tanggal_lahir_ayah', data.tanggal_lahir_ayah);
    //         formData.append('no_telepon_ayah', data.no_telepon_ayah);
    //         formData.append('pekerjaan_ayah', data.pekerjaan_ayah);
    //         formData.append('pendidikan_terakhir_ayah', data.pendidikan_terakhir_ayah);
    //         formData.append('penghasilan_ayah', data.penghasilan_ayah);
    //         formData.append('wafat_ayah', data.wafat_ayah);

    //         formData.append('nama_ibu', data.nama_ibu);
    //         formData.append('nik_ibu', data.nik_ibu);
    //         formData.append('tempat_lahir_ibu', data.tempat_lahir_ibu);
    //         formData.append('tanggal_lahir_ibu', data.tanggal_lahir_ibu);
    //         formData.append('no_telepon_ibu', data.no_telepon_ibu);
    //         formData.append('pekerjaan_ibu', data.pekerjaan_ibu);
    //         formData.append('pendidikan_terakhir_ibu', data.pendidikan_terakhir_ibu);
    //         formData.append('penghasilan_ibu', data.penghasilan_ibu);
    //         formData.append('wafat_ibu', data.wafat_ibu);

    //         formData.append('nama_wali', data.nama_wali);
    //         formData.append('nik_wali', data.nik_wali);
    //         formData.append('hubungan', data.hubungan);
    //         formData.append('tempat_lahir_wali', data.tempat_lahir_wali);
    //         formData.append('tanggal_lahir_wali', data.tanggal_lahir_wali);
    //         formData.append('no_telepon_wali', data.no_telepon_wali);
    //         formData.append('pekerjaan_wali', data.pekerjaan_wali);
    //         formData.append('pendidikan_terakhir_wali', data.pendidikan_terakhir_wali);
    //         formData.append('penghasilan_wali', data.penghasilan_wali);

    //         formData.append('no_induk', data.no_induk);
    //         formData.append('lembaga_id', data.lembaga);
    //         formData.append('jurusan_id', data.jurusan);
    //         formData.append('kelas_id', data.kelas);
    //         formData.append('rombel_id', data.rombel);
    //         formData.append('tanggal_masuk_pendidikan', data.tanggal_masuk_pendidikan);

    //         formData.append('wilayah_id', data.wilayah);
    //         formData.append('blok_id', data.blok);
    //         formData.append('kamar_id', data.kamar);
    //         formData.append('tanggal_masuk_domisili', data.tanggal_masuk_domisili);

    //         // Proses berkas
    //         const berkas = [];

    //         for (let i = 1; i <= 18; i++) {
    //             const fileKey = `file_${i}`;
    //             if (data[fileKey]) {
    //                 berkas.push({
    //                     file: data[fileKey],
    //                     jenis_berkas_id: i.toString(), // asumsikan ID jenis berkas sesuai urutan
    //                 });
    //             }
    //         }

    //         berkas.forEach((b, index) => {
    //             formData.append(`berkas[${index}][jenis_berkas_id]`, b.jenis_berkas_id);
    //             formData.append(`berkas[${index}][file_path]`, b.file);
    //         });

    //         const token = localStorage.getItem("token") || sessionStorage.getItem("token"); // sesuaikan dengan penyimpanan kamu

    //         const response = await fetch(`${API_BASE_URL}crud/pesertadidik`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 // NOTE: Jangan set Content-Type ke multipart/form-data saat pakai FormData,
    //                 // browser akan otomatis handle boundary-nya
    //             },
    //             body: formData
    //         });

    //         const result = await response.json();

    //         console.log("Response dari server:", result); // 👈 Tambahkan ini untuk melihat error detail



    //         if (!response.ok) {
    //             if (result.errors) {
    //                 const errorMessages = Object.entries(result.errors).map(([field, messages]) => {
    //                     const formattedField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    //                     return `- ${formattedField}: ${messages.join(', ')}`;
    //                 });

    //                 Swal.fire({
    //                     icon: 'warning',
    //                     title: 'Periksa input anda',
    //                     html: `
    //                         <div style="text-align: left; white-space: normal;">
    //                             ${errorMessages.join('<br>')}
    //                         </div>
    //                     `,
    //                     confirmButtonText: 'Oke'
    //                 });
    //             } else if (result.error) {
    //                 // Tangani pesan error khusus dari server
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Terjadi Kesalahan',
    //                     text: result.error,
    //                     confirmButtonText: 'Oke'
    //                 });
    //             } else {
    //                 // Jika tidak ada detail errors, tampilkan pesan umum
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Gagal',
    //                     text: result.message || 'Gagal mengirim data',
    //                     confirmButtonText: 'Oke'
    //                 });
    //             }

    //             throw new Error(result.message || "Gagal mengirim data");
    //         }

    //         console.log("Sukses:", result);
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Berhasil!',
    //             text: 'Data berhasil dikirim.',
    //             confirmButtonText: 'Oke'
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 onClose();  // jalankan fungsi onClose() di sini
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Terjadi kesalahan:', error);
    //     }
    // };

    // const onInvalidSubmit = (errors) => {
    //     const fileErrors = Object.keys(errors)
    //         .filter(key => key.startsWith('file_'))
    //         .map(key => {
    //             const id = parseInt(key.split('_')[1], 10);
    //             const berkas = jenisBerkasList.find(item => item.id === id);
    //             return `- ${berkas?.label || `Berkas ${id}`} wajib diisi`;
    //         });

    //     if (fileErrors.length > 0) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Berkas wajib diunggah',
    //             html: `<pre style="text-align: left;">${fileErrors.join('<br>')}</pre>`,
    //             confirmButtonText: 'Oke'
    //         });
    //     }
    // };

    const tabs = [
        {
            id: 0,
            label: "Biodata",
            content: <FormBiodata register={register} watch={watch} setValue={setValue} control={control} />
        },
        {
            id: 1,
            label: "Keluarga",
            content: <FormKeluarga register={register} errors={errors} />
        },
        {
            id: 2,
            label: "Domisili & Pendidikan",
            content: <FormDomisiliPendidikan register={register} control={control} />
        },
        {
            id: 3,
            label: "Berkas",
            content: <FormBerkas errors={errors} control={control} setValue={setValue} jenisBerkasList={jenisBerkasList} />
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
                            <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="flex-1 overflow-y-auto p-2">
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

                                {/* <div className="pt-4">
                                    {tabs.map((tab) => (
                                        <div
                                            key={tab.id}
                                            style={{ display: activeTab === tab.id ? "block" : "none" }}
                                            aria-hidden={activeTab !== tab.id}
                                        >
                                            {tab.content}
                                        </div>
                                    ))}
                                </div> */}

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
