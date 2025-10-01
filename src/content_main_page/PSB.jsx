import { useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaSave, FaUndo } from 'react-icons/fa';
import Swal from 'sweetalert2';
import FormBiodata from '../content_modal/input/peserta_didik/FormBiodata';
import FormKeluarga from '../content_modal/input/peserta_didik/FormKeluarga';
import FormDomisiliPendidikan from '../content_modal/input/peserta_didik/FormDomisiliPendidikan';
import FormBerkasPeserta from '../content_modal/input/peserta_didik/FormBerkas';
import { useMultiStepFormPesertaDidik } from '../hooks/hooks_modal/useMultiStepFormPesertaDidik';
import useDropdownBerkas from '../hooks/hook_dropdown/DropdownBerkas';

// --- Placeholder / Mock Data ---
// Ganti ini dengan implementasi Anda yang sebenarnya
// const useDropdownBerkas = () => ({
//     jenisBerkasList: [
//         { id: 1, label: "Kartu Keluarga (KK)", required: true },
//         { id: 2, label: "Akta Kelahiran", required: true },
//         { id: 3, label: "Ijazah Terakhir", required: false },
//         { id: 4, label: "Pas Foto 3x4", required: true },
//         // ...tambahkan jenis berkas lainnya sesuai kebutuhan
//     ]
// });


// Komponen Utama Halaman Penuh
export default function TambahPesertaDidikPage() {
    // Mock fungsi yang dibutuhkan oleh hook Anda
    const mockOnClose = () => console.log("Form ditutup");
    const mockRefetchData = () => console.log("Memuat ulang data...");

    // Mengambil data list berkas dari mock hook
    const { jenisBerkasList } = useDropdownBerkas();

    // Menggunakan hook yang Anda sediakan
    const formState = useMultiStepFormPesertaDidik(mockOnClose, jenisBerkasList, mockRefetchData);
    
    const {
        handleSubmit,
        activeTab,
        unlockedTabs,
        setActiveTab,
        nextStep,
        prevStep,
        onValidSubmit,
        onInvalidSubmit,
        resetData,
    } = formState;


    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const handleResetClick = async () => {
        const result = await Swal.fire({
            title: 'Yakin ingin mereset data?',
            text: "Semua data yang sudah diisi akan dihapus.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Reset!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            resetData(); // Memanggil fungsi reset dari hook Anda
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil direset',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };
    
    // Mendefinisikan props untuk setiap komponen form
    const formProps = {
        register: formState.register,
        watch: formState.watch,
        setValue: formState.setValue,
        control: formState.control,
        errors: formState.errors,
        activeTab: formState.activeTab,
    };

    const biodataProps = {
        ...formProps,
        selectedTinggal: formState.selectedTinggal,
        setSelectedTinggal: formState.setSelectedTinggal,
        isLainnya: formState.isLainnya,
        setLainnyaValue: formState.setLainnyaValue
    };
    
    const keluargaProps = {
        ...formProps,
        keluargaForm: {
            dropdownValue: formState.dropdownValue,
            setDropdownValue: formState.setDropdownValue,
            inputLainnya: formState.inputLainnya,
            setInputLainnya: formState.setInputLainnya
        }
    };
    
    const berkasProps = {
        ...formProps,
        jenisBerkasList: jenisBerkasList,
    };


    const tabs = [
        { id: 0, label: "Biodata", content: <FormBiodata {...biodataProps} /> },
        { id: 1, label: "Keluarga", content: <FormKeluarga {...keluargaProps} /> },
        { id: 2, label: "Domisili & Pendidikan", content: <FormDomisiliPendidikan {...formProps} /> },
        { id: 3, label: "Berkas", content: <FormBerkasPeserta {...berkasProps} /> }
    ];

    return (
        <main className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full flex flex-col">
                    {/* Header Halaman */}
                    <div className="pb-4 border-b">
                        <h1 className="text-2xl font-semibold text-gray-900">Tambah Data Peserta Didik Baru</h1>
                        <p className="text-gray-600 mt-1">Lengkapi semua data yang diperlukan pada setiap langkah.</p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
                        className="flex-1 overflow-y-auto pt-4"
                        ref={contentRef}
                        noValidate // Mencegah validasi browser bawaan agar react-hook-form yang bekerja
                    >
                        {/* Navigasi Tab */}
                        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-300">
                            {tabs.map((tab) => (
                                <li key={tab.id}>
                                    <button
                                        type='button'
                                        onClick={() => {
                                            if (unlockedTabs.includes(tab.id)) setActiveTab(tab.id);
                                        }}
                                        className={`inline-block p-3 rounded-t-lg border-b-2 text-base ${activeTab === tab.id
                                            ? 'text-blue-600 border-blue-600 bg-gray-100 font-semibold'
                                            : unlockedTabs.includes(tab.id)
                                                ? 'border-transparent hover:text-gray-600 hover:bg-gray-50'
                                                : 'border-transparent text-gray-400 cursor-not-allowed'
                                            }`}
                                        disabled={!unlockedTabs.includes(tab.id)}
                                    >
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Konten Tab */}
                        <div className="pt-6 pb-4 min-h-[400px]">
                            {tabs.find((tab) => tab.id === activeTab)?.content}
                        </div>
                    </form>

                    {/* Tombol Aksi di Footer */}
                    <div className="mt-4 pt-4 flex justify-between items-center">
                        <div>
                            {activeTab > 0 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400"
                                >
                                    <FaArrowLeft />
                                    Sebelumnya
                                </button>
                            )}
                        </div>
                        <div className="ml-auto space-x-3">
                             <button
                                type="button"
                                onClick={handleResetClick}
                                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                <FaUndo />
                                Reset
                            </button>
                            
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
                                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    <FaSave />
                                    Simpan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}