import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../../hooks/config";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from 'react-hook-form'; // Import useForm
import { yupResolver } from '@hookform/resolvers/yup'; // Import yupResolver
import * as yup from 'yup'; // Import yup
import axios from "axios"; // Menggunakan axios untuk fetch data

// Skema validasi form domisili
const schema = yup.object({
    wilayah: yup.string().required('Wilayah wajib dipilih'),
    blok: yup.string().optional(),
    kamar: yup.string().optional(),
    waktuMulai: yup.date().required('Tanggal mulai wajib diisi'),
    waktuAkhir: yup.date().nullable().transform((value) => (value === "" ? null : value)),
}).required();

const TabDomisiliSantri = () => {
    const { biodata_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [riwayatDomisili, setRiwayatDomisili] = useState([]);
    const [errorHistory, setErrorHistory] = useState(null);

    // Data options from API
    const [wilayahOptions, setWilayahOptions] = useState([]);
    const [blokOptions, setBlokOptions] = useState([]);
    const [kamarOptions, setKamarOptions] = useState([]);

    // State untuk menyimpan ID (hanya untuk parameter dropdown)
    const [selectedIds, setSelectedIds] = useState({
        wilayah_id: '',
        blok_id: '',
        kamar_id: ''
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            wilayah: "",
            blok: "",
            kamar: "",
            waktuMulai: "",
            waktuAkhir: null,
        }
    });

    // Watch selected values
    const selectedWilayah = watch('wilayah');
    const selectedBlok = watch('blok');

    // Load history domisili
    const fetchDomisili = async () => {
        if (!biodata_id) return;

        try {
            setIsLoading(true);
            setErrorHistory(null);
            const res = await axios.get(`${API_BASE_URL}formulir/${biodata_id}/domisili`);
            const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            setRiwayatDomisili(data);

            // Otomatis isi form dengan data terbaru jika ada (untuk mode update default)
            if (data.length > 0) {
                fillFormWithHistory(data[0]);
            }
        } catch (err) {
            console.error("Gagal memuat data domisili:", err);
            setErrorHistory(err.response?.data?.message || 'Gagal memuat history domisili. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Isi form dengan data history
    const fillFormWithHistory = useCallback((historyData) => {
        // Set nilai text/nama
        setValue('wilayah', historyData.nama_wilayah || '');
        setValue('blok', historyData.nama_blok || '');
        setValue('kamar', historyData.nama_kamar || '');
        setValue('waktuMulai', historyData.tanggal_masuk?.slice(0, 10) || '');
        setValue('waktuAkhir', historyData.tanggal_keluar?.slice(0, 10) || null);

        // Cari ID untuk keperluan dropdown chaining
        const findId = (options, name, fieldName = 'nama') => {
            if (!options || !Array.isArray(options)) return ''; // Handle non-array or null options
            const found = options.find(opt =>
                opt[`nama_${fieldName}`] === name || opt[fieldName] === name
            );
            return found?.id || '';
        };

        // Update selectedIds setelah form diisi (menggunakan setTimeout untuk memastikan options sudah terload)
        setTimeout(() => {
            setSelectedIds(prev => ({
                ...prev,
                wilayah_id: findId(wilayahOptions, historyData.nama_wilayah, 'wilayah'),
                blok_id: findId(blokOptions, historyData.nama_blok, 'blok'),
                kamar_id: findId(kamarOptions, historyData.nama_kamar, 'kamar')
            }));
            setIsUpdateMode(true);
        }, 100); // Sedikit delay untuk memastikan options terisi
    }, [setValue, wilayahOptions, blokOptions, kamarOptions]);

    // Load dropdown options
    useEffect(() => {
        const fetchWilayah = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}dropdown/wilayah`);
                const data = Array.isArray(response.data) ? response.data : [response.data];
                setWilayahOptions(data || []);
            } catch (error) {
                console.error('Error fetching wilayah:', error);
                setWilayahOptions([]);
            }
        };

        fetchWilayah();
        fetchDomisili();
    }, [biodata_id]);

    // Load blok based on selected wilayah ID
    useEffect(() => {
        const fetchBlok = async () => {
            if (!selectedIds.wilayah_id) {
                setBlokOptions([]);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}dropdown/blok/${selectedIds.wilayah_id}`);
                setBlokOptions(Array.isArray(response.data) ? response.data : [response.data]);
                logger.log('Blok options:', response.data);
            } catch (error) {
                console.error('Error fetching blok:', error);
                setBlokOptions([]);
            }
        };

        fetchBlok();
    }, [selectedIds.wilayah_id]);

    // Load kamar based on selected blok ID
    useEffect(() => {
        const fetchKamar = async () => {
            if (!selectedIds.blok_id) {
                setKamarOptions([]);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}dropdown/kamar/${selectedIds.blok_id}`);
                setKamarOptions(Array.isArray(response.data) ? response.data : [response.data]);
            } catch (error) {
                console.error('Error fetching kamar:', error);
                setKamarOptions([]);
            }
        };

        fetchKamar();
    }, [selectedIds.blok_id]);

    // Handle perubahan dropdown wilayah
    const handleWilayahChange = useCallback((e) => {
        const selectedValue = e.target.value;
        const selectedOption = wilayahOptions.find(w => w.nama_wilayah === selectedValue);

        setValue('wilayah', selectedValue, { shouldValidate: true });
        setValue('blok', '', { shouldValidate: true });
        setValue('kamar', '', { shouldValidate: true });

        setSelectedIds(prev => ({
            ...prev,
            wilayah_id: selectedOption?.id || '',
            blok_id: '',
            kamar_id: ''
        }));
    }, [wilayahOptions, setValue]);

    // Handle perubahan dropdown blok
    const handleBlokChange = useCallback((e) => {
        const selectedValue = e.target.value;
        const selectedOption = blokOptions.find(b => b.nama_blok === selectedValue);

        setValue('blok', selectedValue, { shouldValidate: true });
        setValue('kamar', '', { shouldValidate: true });

        setSelectedIds(prev => ({
            ...prev,
            blok_id: selectedOption?.id || '',
            kamar_id: ''
        }));
    }, [blokOptions, setValue]);

    // Handle perubahan dropdown kamar
    const handleKamarChange = useCallback((e) => {
        const selectedValue = e.target.value;
        const selectedOption = kamarOptions.find(k => k.nama_kamar === selectedValue);

        setValue('kamar', selectedValue, { shouldValidate: true });

        setSelectedIds(prev => ({
            ...prev,
            kamar_id: selectedOption?.id || ''
        }));
    }, [kamarOptions, setValue]);

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const payload = {
                wilayah_id: selectedIds.wilayah_id,
                blok_id: selectedIds.blok_id || null,
                kamar_id: selectedIds.kamar_id || null,
                tanggal_masuk: data.waktuMulai,
                tanggal_keluar: data.waktuAkhir || null,
            };

            let response;
            if (isUpdateMode && riwayatDomisili.length > 0) { // If there's an existing record and we are in update mode
                // Assuming the first item in history is the one being updated (or pass a specific ID)
                response = await axios.put(
                    `${API_BASE_URL}formulir/${riwayatDomisili[0].id}/domisili`, // Use the specific domisili ID
                    payload
                );
            } else { // Create new / Pindah
                response = await axios.post(
                    `${API_BASE_URL}formulir/${biodata_id}/domisili`, // Endpoint for new/pindah
                    payload
                );
                console.log('Response:', response);
                
            };

            Swal.fire({
                title: 'Berhasil!',
                text: isUpdateMode ? 'Data domisili berhasil diupdate!' : 'Data domisili berhasil disimpan!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            fetchDomisili(); // Reload history

            if (!isUpdateMode) {
                reset();
                setSelectedIds({
                    wilayah_id: '',
                    blok_id: '',
                    kamar_id: ''
                });
            }
        } catch (err) {
            console.error('Error saving data:', err);
            Swal.fire({
                title: 'Gagal!',
                text: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeluarDomisili = async (domisiliId) => {
        Swal.fire({
            title: 'Masukkan Tanggal Keluar',
            html: `
                <input type="date" id="tanggalKeluarInput" class="swal2-input" style="width: 80%;" />
            `,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const input = document.getElementById('tanggalKeluarInput').value;
                if (!input) {
                    Swal.showValidationMessage('Tanggal keluar wajib diisi');
                }
                return input;
            }
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const tanggalKeluar = result.value;

            try {
                const res = await axios.put(`${API_BASE_URL}formulir/${domisiliId}/domisili`, {
                    tanggal_keluar: tanggalKeluar
                });

                if (res.data.success || res.data.status === "success") {
                    Swal.fire('Berhasil', 'Tanggal keluar berhasil diupdate.', 'success');
                    fetchDomisili();
                } else {
                    Swal.fire('Gagal', res.data.message || 'Gagal memperbarui tanggal keluar.', 'error');
                }
            } catch (err) {
                Swal.fire('Error', `Terjadi kesalahan saat mengirim data ${err.message}.`, 'error');
            }
        });
    };

    const handleAddNew = () => {
        reset();
        setSelectedIds({
            wilayah_id: '',
            blok_id: '',
            kamar_id: ''
        });
        setIsUpdateMode(false);
    };

    if (isLoading && isUpdateMode) {
        return <div className="text-center p-5">Loading data...</div>;
    }

    return (
        <div className="relative p-2 bg-white">
            {/* Judul Formulir */}
            <h1 className="text-xl font-bold mb-4">
                {isUpdateMode ? `Formulir Domisili: ID ${biodata_id}` : 'Formulir Domisili Baru'}
            </h1>

            {/* History Domisili */}
            <div className="mb-6">
                {/* Debug Info - untuk development, bisa dihapus di production */}
                <div className="mb-4 p-2 bg-gray-100 text-xs">
                    <p>Mode: {isUpdateMode ? 'Update' : 'Baru'}</p>
                    <p>Biodata ID: {biodata_id || 'tidak ada'}</p>
                    <p>Selected IDs: {JSON.stringify(selectedIds)}</p>
                </div>
                <div className="mb-4 p-2 bg-gray-100 text-xs">
                    <pre>{JSON.stringify(watch(), null, 2)}</pre>
                    {/* <pre>{JSON.stringify(errors, null, 2)}</pre> ini bisa diaktifkan untuk debug error */}
                </div>
                <h2 className="text-lg font-semibold mb-2">History Domisili</h2>

                {errorHistory && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errorHistory}
                        <button
                            onClick={fetchDomisili}
                            className="ml-2 text-red-700 underline"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {riwayatDomisili.length > 0 ? (
                    <div className="space-y-3">
                        {riwayatDomisili.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => fillFormWithHistory(item)}
                                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                    // Mengecek apakah item ini adalah yang sedang diedit/dipilih
                                    (getValues('wilayah') === item.nama_wilayah &&
                                        getValues('blok') === item.nama_blok &&
                                        getValues('kamar') === item.nama_kamar &&
                                        getValues('waktuMulai') === (item.tanggal_masuk?.slice(0, 10) || ''))
                                        ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">
                                            {item.nama_wilayah || "-"} - {item.nama_blok || "-"} ({item.nama_kamar || "-"})
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Sejak {new Date(item.tanggal_masuk).toLocaleDateString("id-ID", { dateStyle: "medium" })} Sampai{" "}
                                            {item.tanggal_keluar
                                                ? new Date(item.tanggal_keluar).toLocaleDateString("id-ID", {
                                                    dateStyle: "medium",
                                                })
                                                : "Sekarang"}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${!item.tanggal_keluar ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {!item.tanggal_keluar ? "Aktif" : "Tidak Aktif"}
                                    </span>
                                </div>
                                {!item.tanggal_keluar && ( // Hanya tampilkan tombol jika domisili aktif
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Mencegah onClick parent terpicu
                                                handleAddNew(); // Untuk membuka form baru dengan tanggal masuk hari ini
                                            }}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            title="Pindah Domisili"
                                        >
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Mencegah onClick parent terpicu
                                                handleKeluarDomisili(item.id);
                                            }}
                                            className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                                            title="Keluar Domisili"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                        {isLoading ? 'Memuat history...' : 'Tidak ada history domisili.'}
                    </div>
                )}

                {riwayatDomisili.length > 0 && (
                    <button
                        type="button"
                        onClick={handleAddNew}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Tambah Domisili Baru
                    </button>
                )}
            </div>

            {/* Form Domisili */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-gray-50 p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Wilayah */}
                    <div className="flex flex-col">
                        <label htmlFor="wilayah" className="text-black mb-1">
                            Wilayah *
                        </label>
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <select
                                id="wilayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={selectedWilayah || ""}
                                {...register('wilayah')}
                                onChange={handleWilayahChange}
                                disabled={isLoading}
                            >
                                <option value="">Pilih Wilayah</option>
                                {wilayahOptions.map(option => (
                                    <option key={option.id} value={option.nama_wilayah}>
                                        {option.nama_wilayah}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.wilayah && (
                            <p className="text-red-500 text-sm mt-1">{errors.wilayah.message}</p>
                        )}
                    </div>

                    {/* Blok */}
                    <div className="flex flex-col">
                        <label htmlFor="blok" className="text-black mb-1">
                            Blok
                        </label>
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <select
                                id="blok"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={selectedBlok || ""}
                                {...register('blok')}
                                onChange={handleBlokChange}
                                disabled={!selectedIds.wilayah_id || isLoading}
                            >
                                <option value="">Pilih Blok</option>
                                {blokOptions.map(option => (
                                    <option key={option.id} value={option.nama_blok}>{option.nama_blok}</option>
                                ))}
                            </select>
                        </div>
                        {errors.blok && (
                            <p className="text-red-500 text-sm mt-1">{errors.blok.message}</p>
                        )}
                    </div>

                    {/* Kamar */}
                    <div className="flex flex-col">
                        <label htmlFor="kamar" className="text-black mb-1">
                            Kamar
                        </label>
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <select
                                id="kamar"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={watch('kamar') || ""}
                                {...register('kamar')}
                                onChange={handleKamarChange}
                                disabled={!selectedIds.blok_id || isLoading}
                            >
                                <option value="">Pilih Kamar</option>
                                {kamarOptions.map(option => (
                                    <option key={option.id} value={option.nama_kamar}>{option.nama_kamar}</option>
                                ))}
                            </select>
                        </div>
                        {errors.kamar && (
                            <p className="text-red-500 text-sm mt-1">{errors.kamar.message}</p>
                        )}
                    </div>

                    {/* Waktu Mulai */}
                    <div className="flex flex-col">
                        <label htmlFor="waktuMulai" className="text-black mb-1">
                            Tanggal Mulai *
                        </label>
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="waktuMulai"
                                type="date"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('waktuMulai')}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.waktuMulai && (
                            <p className="text-red-500 text-sm mt-1">{errors.waktuMulai.message}</p>
                        )}
                    </div>

                    {/* Waktu Akhir */}
                    <div className="flex flex-col">
                        <label htmlFor="waktuAkhir" className="text-black mb-1">
                            Tanggal Akhir
                        </label>
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="waktuAkhir"
                                type="date"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('waktuAkhir')}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.waktuAkhir && (
                            <p className="text-red-500 text-sm mt-1">{errors.waktuAkhir.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-start gap-2 mt-1">
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => {
                            reset();
                            setSelectedIds({
                                wilayah_id: '',
                                blok_id: '',
                                kamar_id: ''
                            });
                            setIsUpdateMode(false);
                        }}
                        disabled={isLoading}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
            {/* ModalPindahDomisili tidak lagi digunakan karena logika pindah domisili di handle di form yang sama */}
        </div>
    );
};

export default TabDomisiliSantri;