import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const useFetchPeserta = (filters) => {
    const [pesertaDidik, setPesertaDidik] = useState([]);
    const [loadingPesertaDidik, setLoadingPesertaDidik] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPesertaDidik, setTotalDataPesertaDidik] = useState(0);
    const [totalPages, setTotalPages] = useState(1); // Tambahkan total halaman
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log("Filters updated:", filters); // Debugging
        const fetchData = async () => {
            setLoadingPesertaDidik(true);
            setError(null);

            let url = `${API_BASE_URL}data-pokok/peserta-didik?limit=${limit}`;
            if (currentPage > 1) {
                url += `&page=${currentPage}`;
              }

            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            if (filters?.phoneNumber) {
                url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;
            }
            if (filters?.wargaPesantren) {
                url += `&warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`
            }
            if (filters?.status) {
                url += `&status=${encodeURIComponent(filters.status)}`
            }
            if (filters?.jenisKelamin) {
                url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`
            }
            if (filters?.smartcard) {
                url += `&smartcard=${encodeURIComponent(filters.smartcard)}`
            }
            if (filters?.pemberkasan) {
                url += `&pemberkasan=${encodeURIComponent(filters.pemberkasan)}`
            }
            if (filters?.urutBerdasarkan) {
                url += `&sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`
            }
            if (filters?.urutSecara) {
                url += `&sort_order=${encodeURIComponent(filters.urutSecara)}`
            }
            if (filters?.negara && filters.negara !== "Semua Negara") {
                url += `&negara=${encodeURIComponent(filters.negara)}`;
            }
            if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") {
                url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
            }
            if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") {
                url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
            }
            if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") {
                url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
            }
            if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") {
                url += `&wilayah=${encodeURIComponent(filters.wilayah)}`;
            }
            if (filters?.blok && filters.blok !== "Semua Blok") {
                url += `&blok=${encodeURIComponent(filters.blok)}`;
            }
            if (filters?.kamar && filters.kamar !== "Semua Kamar") {
                url += `&kamar=${encodeURIComponent(filters.kamar)}`;
            }
            if (filters?.angkatanPelajar) {
                url += `&angkatan_pelajar=${encodeURIComponent(filters.angkatanPelajar)}`;
            }
            if (filters?.angkatanSantri) {
                url += `&angkatan_santri=${encodeURIComponent(filters.angkatanSantri)}`;
            }
            if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") {
                url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
            }
            if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") {
                url += `&jurusan=${encodeURIComponent(filters.jurusan)}`;
            }
            if (filters?.kelas && filters.kelas !== "Semua Kelas") {
                url += `&kelas=${encodeURIComponent(filters.kelas)}`;
            }
            if (filters?.rombel && filters.rombel !== "Semua Rombel") {
                url += `&rombel=${encodeURIComponent(filters.rombel)}`;
            }
            console.log("Fetching data from:", url);

            try {
                const response = await fetch(url);

                console.log("Response status:", response.status);

                if (!response.ok) {
                    setTotalDataPesertaDidik(0);
                    setTotalPages(1);
                    throw new Error(`Gagal mengambil data: ${response.status} ${response.message}`);
                }

                const text = await response.text();
                // console.log("Raw Response:", text);

                const data = JSON.parse(text);
                console.log("Data dari API:", data);

                setPesertaDidik(Array.isArray(data.data) ? data.data : []);
                setTotalDataPesertaDidik(data.total_data || 0);
                setTotalPages(data.total_pages || 1); // Ambil total halaman dari API
                setCurrentPage(data.current_page || 1); // Pastikan currentPage sesuai dengan API

            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                setPesertaDidik([]);
            } finally {
                setLoadingPesertaDidik(false);
            }
        };

        fetchData();
    }, [currentPage, filters, limit, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    // const filteredPesertaDidik = useMemo(() => {
    //     return pesertaDidik.filter(
    //         (item) =>
    //             item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             item?.niup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             item?.lembaga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             item["nik/nopassport"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             item?.wilayah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             item?.kota_asal?.toLowerCase().includes(searchTerm.toLowerCase()) 
    //     );
    // }, [searchTerm, pesertaDidik]);

    return {
        // pesertaDidik: filteredPesertaDidik,
        pesertaDidik: pesertaDidik.map(item => ({
            id: item.tampilan_awal.id,
            nik: item.tampilan_awal["nik/nopassport"],
            nama: item.tampilan_awal.nama,
            niup: item.tampilan_awal.niup,
            wilayah: item.tampilan_awal.wilayah,
            lembaga: item.tampilan_awal.lembaga,
            kota_asal: item.tampilan_awal.kota_asal,
            tgl_input: item.tampilan_awal.tgl_input,
            tgl_update: item.tampilan_awal.tgl_update,
            foto_profil: item.tampilan_awal.foto_profil
        })),
        loadingPesertaDidik,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataPesertaDidik,
        totalPages, // Kembalikan total halaman dari API
        currentPage,
        setCurrentPage
    };
};

export default useFetchPeserta;
