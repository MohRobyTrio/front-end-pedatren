import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DropdownNegara from '../../hooks/hook_dropdown/DropdownNegara';
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import Swal from "sweetalert2";
import Access from "../../components/Access";
import blankProfile from "../../assets/blank_profile.png";

// Skema validasi form
const schema = yup.object({
    kewarganegaraan: yup.string().optional(),
    no_passport: yup.string().optional(),
    nomor_kk: yup.string().optional()
        .test(
            'len',
            'No.KK harus 16 digit',
            (val) => !val || val.length === 16
        ),
    nik: yup.string().nullable()
        .test(
            'len',
            'NIK harus 16 digit',
            (val) => !val || val.length === 16
        ),
    nama: yup.string().required('Nama wajib diisi'),
    jenis_kelamin: yup.string().required('Jenis Kelamin harus dipilih').oneOf(['p', 'l'], 'Pilihan jenis kelamin tidak valid'),
    tempat_lahir: yup.string().required('Tempat Lahir wajib diisi'),
    tanggal_lahir: yup.object({
        tahun: yup.string().required('Tahun lahir wajib diisi'),
        bulan: yup.string().required('Bulan lahir wajib diisi'),
        tanggal: yup.string().required('Tanggal lahir wajib diisi')
    }),
    anak_keberapa: yup.number().optional(),
    dari_saudara: yup.number().optional(),
    tinggal_bersama: yup.string().optional(),
    jenjang_pendidikan: yup.string().optional(),
    nama_pendidikan: yup.string().optional(),
    telepon1: yup.string().required('Nomor Telepon 1 wajib diisi'),
    telepon2: yup.string().optional(),
    email: yup.string().email('Format email tidak valid'),
    pekerjaan: yup.string().optional(),
    penghasilan: yup.string().optional(),
    negara: yup.string().required('Negara wajib diisi'),
    provinsi: yup.string().optional(),
    kabupaten: yup.string().optional(),
    kecamatan: yup.string().optional(),
    jalan: yup.string().optional(),
    kode_pos: yup.string().optional(),
    wafat: yup.string().required('Status wafat harus dipilih'),
});

const TabBiodata = () => {
    const { biodata_id } = useParams();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [umur, setUmur] = useState(null);
    const [bulanOptions] = useState([
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ]);

    // Add debugging to clearly see what's happening
    useEffect(() => {
        console.log("Current biodata_id from URL:", biodata_id);
        // Cek apakah ID valid (tidak undefined, tidak null, dan bukan string kosong)
        const isValidId = biodata_id && biodata_id.trim() != "";
        console.log("Is valid ID:", isValidId);
    }, [biodata_id]);

    // Gunakan komponen DropdownNegara
    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            kewarganegaraan: 'wni',
            wafat: 'Tidak',
            jenis_kelamin: '',
            tanggal_lahir: {
                tahun: '',
                bulan: '',
                tanggal: ''
            }
        }
    });

    // const kewarganegaraan = watch('kewarganegaraan');

    // Handle perubahan dropdown wilayah
    const handleWilayahChange = (e, level) => {
        const { value } = e.target;
        setValue(level, value);
        handleFilterChangeNegara({ [level]: value });
    };

    // Load data peserta jika dalam mode update
    const loadPesertaData = useCallback(async (id) => {
        // Validasi ID
        if (!id || id.trim() === "") {
            console.warn("ID tidak valid");
            setIsUpdateMode(false);
            return;
        }

        setIsLoading(true);

        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${id}/biodata/show`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("Response dari API:", responseData);

            // Validasi response
            if (!responseData || !responseData.data) {
                console.warn("Data tidak ditemukan dalam response");
                setIsUpdateMode(false);
                return;
            }

            const biodata = responseData.data;

            // Mapping data ke form
            const formData = {
                // Field utama
                nama: biodata.nama || '',
                no_passport: biodata.no_passport || '',
                nik: biodata.nik || '',
                nomor_kk: biodata.no_kk || '',
                jenis_kelamin: biodata.jenis_kelamin === 'l' ? 'l' : 'p',

                // Tanggal lahir
                tanggal_lahir: {
                    tahun: '',
                    bulan: '',
                    tanggal: ''
                },

                // Field lainnya
                tempat_lahir: biodata.tempat_lahir || '',
                anak_keberapa: biodata.anak_keberapa || '',
                dari_saudara: biodata.dari_saudara || '',
                telepon1: biodata.no_telepon || '',
                telepon2: biodata.no_telepon_2 || '',
                email: biodata.email || '',
                jenjang_pendidikan: biodata.jenjang_pendidikan_terakhir || '',
                nama_pendidikan: biodata.nama_pendidikan_terakhir || '',
                jalan: biodata.jalan || '',
                kode_pos: biodata.kode_pos || '',
                wafat: biodata.wafat === false ? '0' : '1',

                negara: biodata.negara_id || '',
                provinsi: biodata.provinsi_id || '',
                kabupaten: biodata.kabupaten_id || '',
                kecamatan: biodata.kecamatan_id || ''
            };

            // Parse tanggal lahir jika ada
            if (biodata.tanggal_lahir) {
                const [tahun, bulan, tanggal] = biodata.tanggal_lahir.split('-');
                formData.tanggal_lahir = { tahun, bulan, tanggal };
            }

            // Set nilai form
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'tanggal_lahir') {
                    setValue('tanggal_lahir.tahun', value.tahun);
                    setValue('tanggal_lahir.bulan', value.bulan);
                    setValue('tanggal_lahir.tanggal', value.tanggal);
                } else {
                    setValue(key, value);
                }
            });

            const nikTerisi = !!formData.nik && formData.nik.trim() != '';
            const passportTerisi = !!formData.no_passport && formData.no_passport.trim() != '';

            if (nikTerisi) {
                setValue('kewarganegaraan', 'wni');
            } else if (passportTerisi) {
                setValue('kewarganegaraan', 'wna');
            }
            if (formData.tanggal_lahir.tahun) {
                hitungUmur(formData.tanggal_lahir.tahun, formData.tanggal_lahir.bulan);
            }
            // Set dropdown wilayah
            if (biodata.negara_id) {
                handleFilterChangeNegara({ negara: biodata.negara_id.toString() });
            }
            if (biodata.provinsi_id) {
                handleFilterChangeNegara({ provinsi: biodata.provinsi_id.toString() });
            }
            if (biodata.kabupaten_id) {
                handleFilterChangeNegara({ kabupaten: biodata.kabupaten_id.toString() });
            }
            if (biodata.kecamatan_id) {
                handleFilterChangeNegara({ kecamatan: biodata.kecamatan_id.toString() });
            }

            // Set photo preview jika ada
            if (biodata.pas_foto_url) {
                setPhotoPreview(biodata.pas_foto_url);
            }

            setIsUpdateMode(true);

        } catch (error) {
            console.error('Error loading data:', error);
            setIsUpdateMode(false);
            alert('Gagal memuat data peserta');
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Jika ada ID, berarti mode update
    // useEffect(() => {
    //     if (biodata_id) {
    //         loadPesertaData(biodata_id);
    //     }
    // }, [biodata_id]);

    // Trigger update mode when biodata_id is present in URL
    useEffect(() => {
        // Validasi ID harus ada dan bukan string kosong
        if (biodata_id && biodata_id.trim() != "") {
            console.log("Entering update mode with ID:", biodata_id);
            loadPesertaData(biodata_id);
        } else {
            console.log("No valid biodata_id found, staying in create mode");
            setIsUpdateMode(false);
        }
    }, [biodata_id, loadPesertaData]);

    // Handle perubahan photo
    // const handlePhotoChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setPhoto(file);
    //         setPhotoPreview(URL.createObjectURL(file));
    //     }
    // };

    // Submit form
    const onSubmit = async (data) => {
        const confirmResult = await Swal.fire({
            title: "Yakin ingin menyimpan data?",
            text: "Pastikan semua data sudah diisi dengan benar.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        Swal.fire({
            title: 'Mohon tunggu...',
            html: 'Sedang menyimpan data.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        setIsLoading(true);
        try {
            // Format tanggal lahir
            const tanggalLahir = `${data.tanggal_lahir.tahun}-${data.tanggal_lahir.bulan}-${data.tanggal_lahir.tanggal}`;

            // Buat form data untuk upload file
            const formData = new FormData();

            // Append manual satu per satu jika perlu transform
            formData.append('tanggal_lahir', tanggalLahir);
            formData.append('no_kk', data.nomor_kk);
            formData.append('nama', data.nama);
            // formData.append('jenis_kelamin', data.jenis_kelamin); // sekarang 'l' atau 'p'
            formData.append('no_telepon', data.telepon1);
            if (data.telepon2) formData.append('no_telepon_2', data.telepon2);
            formData.append('negara_id', data.negara);
            formData.append('provinsi_id', data.provinsi);
            formData.append('kabupaten_id', data.kabupaten);
            formData.append('kecamatan_id', data.kecamatan);
            formData.append('jenjang_pendidikan_terakhir', data.jenjang_pendidikan);
            formData.append('nama_pendidikan_terakhir', data.nama_pendidikan);
            // formData.append('wafat', data.wafat === 'Ya' ? '1' : '0');

            [
                'tempat_lahir', 'no_passport', 'nik',
                'anak_keberapa', 'dari_saudara', 'tinggal_bersama',
                'email', 'jenis_kelamin', 'wafat',
                'pekerjaan', 'jalan', 'kode_pos'
            ].forEach(field => {
                if (data[field]) formData.append(field, data[field]);
            });

            // Tambahkan semua field form ke formData
            Object.keys(data).forEach(key => {
                if (key != 'tanggal_lahir') {
                    formData.append(key, data[key]);
                }
            });

            formData.append('tanggal_lahir', tanggalLahir);

            // cek wafat
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }


            if (photo) {
                formData.append('photo', photo);
            }

            const token = sessionStorage.getItem("token") || getCookie("token");

            let response;

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            };

            if (isUpdateMode && biodata_id && biodata_id.trim() != "") {
                console.log(`Updating record with ID: ${biodata_id}`);
                response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/biodata?_method=PUT`, requestOptions);

                //debugging output
                // console.log("request:", requestOptions);
                // console.log("response:", response);
                // console.log("formData", formData);
                // console.log("result:", await response.json());


            } else {
                console.log("Creating new record");
                response = await fetch(`${API_BASE_URL}formulir/biodata?_method=POST`, requestOptions);
            }

            const result = await response.json();
            Swal.close();

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            if (!response.ok || result.errors) {
                const errorMsg = result.message || "Terjadi kesalahan pada server.";
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align:center">${errorMsg}</div>`,
                });
                return;
            }

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: result.message,
                });
                return;
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: isUpdateMode ? "Data berhasil diupdate!" : "Data berhasil disimpan!",
            });

            if (biodata_id && biodata_id.trim() != "") {
                loadPesertaData(biodata_id);
            }

            if (!isUpdateMode) {
                // Reset form jika mode tambah data
                reset();
                setPhoto(null);
                setPhotoPreview(null);
            }

        } catch (error) {
            Swal.close();
            console.error('Error saving data:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                // Tampilkan error dari validasi backend
                const backendErrors = error.response.data.errors;
                // Object.keys(backendErrors).forEach(key => {
                //     alert(`${key}: ${backendErrors[key][0]}`);
                // });
                const errorList = Object.keys(backendErrors)
                    .map(key => `<li><strong>${key}</strong>: ${backendErrors[key][0]}</li>`)
                    .join("");

                await Swal.fire({
                    icon: "error",
                    title: "Validasi Gagal",
                    html: `<ul style="text-align: left;">${errorList}</ul>`,
                });
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
                });
                // alert('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isUpdateMode) {
        return <div className="text-center p-5">Loading data...</div>;
    }

    const hitungUmur = (tahun, bulan) => {
        if (!tahun) return;

        const today = new Date();
        const tahunSekarang = today.getFullYear();
        const bulanSekarang = today.getMonth() + 1; // getMonth() returns 0-11

        // Hitung umur berdasarkan tahun
        let age = tahunSekarang - tahun;

        // Sesuaikan umur jika bulan lahir belum terlewati di tahun ini
        if (bulan && parseInt(bulan) > bulanSekarang) {
            age--;
        }

        setUmur(age);
    };

    // useEffect(() => {
    //     console.log("Ambil data untuk ID:", biodata_id);
    //     // fetch(`/api/biodata/${biodata_id}`)
    // }, [biodata_id]);


    return (
        <div className="relative p-2 bg-white ">
            {/* Judul Formulir */}
            {/* <h1 className="text-xl font-bold mb-4">{isUpdateMode
                        ? `Formulir Update: ID ${biodata_id}`
                        : 'Formulir Baru'}</h1> */}

            {/* Foto - dibuat responsif */}
            {/* <div className="w-48 h-56 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden shadow md:absolute md:top-4 md:right-4">
                <img
                    src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                    alt="Foto Santri"
                    className="object-cover w-full h-full"
                />
            </div> */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
                <div className="flex-shrink-0">
                    <img
                        src={photoPreview || blankProfile}
                        alt="Foto Profil"
                        className="w-46 h-54 object-cover rounded border border-gray-500 p-1"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = blankProfile;
                        }}
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 space-y-4 w-full">
                    {/* Debug Info - untuk development, bisa dihapus di production */}
                    {/* <div className="mb-4 p-2 bg-gray-100 text-xs">
                    <p>Mode: {isUpdateMode ? 'Update' : 'Baru'}</p>
                    <p>ID: {biodata_id || 'tidak ada'}</p>
                </div>
                <div className="mb-4 p-2 bg-gray-100 text-xs">
                    <pre>{JSON.stringify(watch(), null, 2)}</pre>
                </div> */}
                    {/* <img
                    src={photoPreview}
                    alt="Foto Profil"
                    className="w-46 h-54 object-cover rounded mt-4 sm:mt-0 sm:ml-8 border border-gray-500 p-1"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = blankProfile;
                    }}
                /> */}
                    {/* Kewarganegaraan */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="kewarganegaraan" className="lg:w-1/4 text-black">
                            Kewarganegaraan *
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="kewarganegaraan" value="wni" {...register('kewarganegaraan')} className="w-4 h-4" disabled />
                            <span>WNI</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="kewarganegaraan" value="wna" {...register('kewarganegaraan')} className="w-4 h-4" disabled />
                            <span>WNA</span>
                        </label>
                    </div>
                    {/* Nomor Passport */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="passport" className="lg:w-1/4 text-black">
                            No Passport *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="no_passport"
                                    name="no_passport"
                                    type="text"
                                    placeholder="Masukkan No Passport"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('no_passport')}
                                />

                            </div>
                        </div>
                    </div>

                    {/* Nomor KK */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="nomor_kk" className="lg:w-1/4 text-black">
                            Nomor KK
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="nomor_kk"
                                    type="text"
                                    placeholder="Masukkan No KK"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('nomor_kk')}
                                />
                            </div>
                            {errors.nomor_kk && (
                                <p className="text-end text-red-500 text-sm">{errors.nomor_kk.message}</p>
                            )}
                        </div>
                    </div>

                    {/* NIK */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="nik" className="lg:w-1/4 text-black">
                            NIK *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex flex-col rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="nik"
                                    type="text"
                                    placeholder="Masukkan NIK"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('nik')}
                                />
                            </div>
                            {errors.nik && (
                                <p className="text-end text-red-500 text-sm">{errors.nik.message}</p>
                            )}
                        </div>
                    </div>


                    {/* Nama Lengkap */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 mb-4">
                        <label htmlFor="nama" className="lg:w-1/4 text-black">
                            Nama Lengkap *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex flex-col rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="nama"
                                    type="text"
                                    placeholder="Masukkan Nama Lengkap"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('nama')}
                                />
                            </div>
                            {errors.nama && (
                                <p className="text-end text-red-500 text-sm mt-1">{errors.nama.message}</p>
                            )}
                        </div>
                    </div>


                    {/* Jenis Kelamin */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label className="lg:w-1/4 text-black">
                            Jenis Kelamin *
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="p"
                                {...register('jenis_kelamin')}
                                className="w-4 h-4"
                            />
                            <span>Perempuan</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="l"
                                {...register('jenis_kelamin')}
                                className="w-4 h-4"
                            />
                            <span>Laki-Laki</span>
                        </label>
                        {errors.jenis_kelamin && (
                            <p className="text-end text-red-500 text-sm">{errors.jenis_kelamin.message}</p>
                        )}
                    </div>

                    {/* Tempat Lahir */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="tempat_lahir" className="lg:w-1/4 text-black">
                            Tempat Lahir *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex flex-col rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="tempat_lahir"
                                    type="text"
                                    placeholder="Masukkan Tempat Lahir"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('tempat_lahir')}
                                />
                            </div>
                            {errors.tempat_lahir && (
                                <p className="text-end text-red-500 text-sm mt-1">{errors.tempat_lahir.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="tanggalLahir" className="lg:w-1/4 text-black">
                            Tanggal Lahir *
                        </label>
                        <div className="flex flex-col min-[833px]:flex-row space-y-2 min-[833px]:space-y-0">
                            <div className="flex space-x-1 mr-2">
                                <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 focus-within:border-gray-500">
                                    {/* Tahun */}
                                    <select
                                        {...register('tanggal_lahir.tahun')}
                                        className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                        onChange={(e) => hitungUmur(parseInt(e.target.value), document.querySelector('[name="tanggal_lahir.bulan"]').value)}
                                    >
                                        <option value="">Tahun</option>
                                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 focus-within:border-gray-500">
                                    {/* Bulan */}
                                    <select
                                        {...register('tanggal_lahir.bulan')}
                                        className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                        onChange={(e) => hitungUmur(parseInt(document.querySelector('[name="tanggal_lahir.tahun"]').value), e.target.value)}
                                    >
                                        <option value="">Bulan</option>
                                        {bulanOptions.map(bulan => (
                                            <option key={bulan.value} value={bulan.value}>{bulan.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 focus-within:border-gray-500">
                                    {/* Tanggal */}
                                    <select
                                        {...register('tanggal_lahir.tanggal')}
                                        className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    >
                                        <option value="">Tanggal</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(tanggal => (
                                            <option key={tanggal} value={tanggal < 10 ? `0${tanggal}` : tanggal}>
                                                {tanggal < 10 ? `0${tanggal}` : tanggal}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Label umur */}
                            <span className="w-fit h-8 bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-sm">
                                {umur != null ? `Umur ${umur} tahun` : ''}
                            </span>
                        </div>
                    </div>

                    {/* Anak Ke */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label className="lg:w-1/4 text-black">
                            Anak Ke *
                        </label>
                        <div className="flex space-x-4 items-center">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    type="number"
                                    min="1"
                                    className="w-20 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('anak_keberapa')}
                                />
                            </div>
                            <span>Dari</span>
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    type="number"
                                    min="1"
                                    className="w-20 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('dari_saudara')}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="border-t border-gray-300 my-4" />

                    {/* Tinggal Bersama */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="tinggal_bersama" className="lg:w-1/4 text-black">
                            Tinggal Bersama
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="tinggal_bersama"
                                    type="text"
                                    placeholder="Masukkan Tinggal Bersama"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('tinggal_bersama')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Jenjang Pendidikan Terakhir */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="jenjang_pendidikan" className="lg:w-1/4 text-black">
                            Jenjang Pendidikan Terakhir
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    id="jenjang_pendidikan"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    // value={jenjangPendidikanTerakhir}
                                    {...register('jenjang_pendidikan')}
                                >
                                    <option value="" >
                                        Pilih
                                    </option>
                                    <option value="paud">PAUD</option>
                                    <option value="sd/mi">SD/MI</option>
                                    <option value="smp/mts">SMP/MTs</option>
                                    <option value="sma/smk/ma">SMA Sederajat</option>
                                    <option value="d3">D3</option>
                                    <option value="d4">D4</option>
                                    <option value="s1">S1</option>
                                    <option value="s2">S2</option>
                                    <option value="s3">S3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pendidikan Terakhir */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="nama_pendidikan" className="lg:w-1/4 text-black">
                            Nama Pendidikan Terakhir
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="nama_pendidikan"
                                    type="text"
                                    placeholder="Masukkan Nama Pendidikan Terakhir"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('nama_pendidikan')}
                                />
                            </div>
                        </div>
                    </div>

                    <br />
                    <p className="text-red-500 text-bold timesnewroman">
                        Untuk nomor telepon milik orang tua/wali jangan diinputkan pada data peserta didik!
                        <span className="text-red-500 text-sm italic">
                            Karena manajemen nomor telepon Pedatren untuk sending bulk sms ortu, akan melihat nomor telepon pada entitas ortu/wali
                            dengan priority urutan dimulai dari ayah kandung, ibu kandung kemudian yang dijadikan sebagai wali (jika tidak ada ayah & ibu kandung)
                        </span>
                    </p>


                    {/* Nomor Telepon 1 */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="telepon1" className="lg:w-1/4 text-black">
                            Nomor Telepon 1 *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex flex-col rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="telepon1"
                                    type="text"
                                    placeholder="+62"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('telepon1')}
                                />
                            </div>
                            {errors.telepon1 && (
                                <p className="text-end text-red-500 text-sm mt-1">{errors.telepon1.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Nomor Telepon 2 */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="telepon2" className="lg:w-1/4 text-black">
                            Nomor Telepon 2
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="telepon2"
                                    type="text"
                                    placeholder="+62"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('telepon2')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* E-Mail */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="email" className="lg:w-1/4 text-black">
                            E-Mail
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan E-Mail"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-end text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Pekerjaan */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="pekerjaan" className="lg:w-1/4 text-black">
                            Pekerjaan
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    id="pekerjaan"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    // value={pekerjaan}
                                    {...register('pekerjaan')}
                                >
                                    <option value="" >
                                        Pilih Pekerjaan
                                    </option>
                                    <option>Petani</option>
                                    <option>Pegawai Negeri</option>
                                    <option>Karyawan Swasta</option>
                                    <option>Wiraswasta</option>
                                    <option>Lainnya</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Penghasilan */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="penghasilan" className="lg:w-1/4 text-black">
                            Penghasilan
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    id="penghasilan"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    // value={penghasilan}
                                    {...register('penghasilan')}
                                >
                                    <option value="">
                                        Pilih Penghasilan
                                    </option>
                                    <option>&lt; 1 Juta</option>
                                    <option>1 - 3 Juta</option>
                                    <option>3 - 5 Juta</option>
                                    <option>&gt; 5 Juta</option>
                                    <option>Lainnya</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr className="border-t border-gray-300 my-4" />

                    {/* Negara */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="negara" className="lg:w-1/4 text-black">
                            Negara *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    {...register('negara')}
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleWilayahChange(e, 'negara')}
                                    value={selectedNegara.negara}
                                >
                                    <option value="">Pilih Negara</option>
                                    {filterNegara.negara.map(item => (
                                        <option key={item.value} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.negara && <p className="text-end text-red-500 text-sm">{errors.negara.message}</p>}
                        </div>
                    </div>

                    {/* Provinsi */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="Provinsi" className="lg:w-1/4 text-black">
                            Provinsi *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    {...register('provinsi')}
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleWilayahChange(e, 'provinsi')}
                                    value={selectedNegara.provinsi}
                                    disabled={!selectedNegara.negara}
                                >
                                    <option value="">Pilih Provinsi</option>
                                    {filterNegara.provinsi.map(item => (
                                        <option key={item.value} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Kabupaten */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="Kabupaten" className="lg:w-1/4 text-black">
                            Kabupaten *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    {...register('kabupaten')}
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleWilayahChange(e, 'kabupaten')}
                                    value={selectedNegara.kabupaten}
                                    disabled={!selectedNegara.provinsi}
                                >
                                    <option value="">Pilih Kabupaten</option>
                                    {filterNegara.kabupaten.map(item => (
                                        <option key={item.value} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* Kecamatan */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="Provinsi" className="lg:w-1/4 text-black">
                            Kecamatan *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    {...register('kecamatan')}
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    onChange={(e) => handleWilayahChange(e, 'kecamatan')}
                                    value={selectedNegara.kecamatan}
                                    disabled={!selectedNegara.kabupaten}
                                >
                                    <option value="">Pilih Kecamatan</option>
                                    {filterNegara.kecamatan.map(item => (
                                        <option key={item.value} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr className="border-t border-gray-300 my-4" />

                    {/* Jalan */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="jalan" className="lg:w-1/4 text-black">
                            Jalan *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="jalan"
                                    type="text"
                                    placeholder="Masukkan Nama Jalan"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('jalan')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kode Pos */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label htmlFor="kode_pos" className="lg:w-1/4 text-black">
                            Kode Pos *
                        </label>
                        <div className="lg:w-3/4 max-w-md">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                <input
                                    id="kode_pos"
                                    type="text"
                                    placeholder="Masukkan Kode Pos"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    {...register('kode_pos')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Masi Hidup/Tidak */}
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                        <label className="lg:w-1/4 text-black">
                            Wafat *
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="0"
                                {...register('wafat')}
                                className="w-4 h-4"
                            />
                            <span>Tidak</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="1"
                                {...register('wafat')}
                                className="w-4 h-4"
                            />
                            <span>Ya</span>
                        </label>
                        {errors.wafat && (
                            <p className="text-red-500 text-sm">{errors.wafat.message}</p>
                        )}
                    </div>


                    <br />
                    {/* Tombol Simpan */}
                    <Access action="edit">
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </Access>
                </form>

            </div>
        </div>
    );
};

export default TabBiodata;
