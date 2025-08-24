import { useParams, Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../hooks/config";
import { getCookie } from "../utils/cookieUtils";
import blankProfile from "../assets/blank_profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Formulir = () => {
    const { biodata_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [tabKondisi, setTabKondisi] = useState('kondisi2'); // default kondisi2
    const [pesertaData, setPesertaData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const prevRoute = sessionStorage.getItem("prevRoute");

    // Definisi tab berdasarkan kondisi
    const tabsKondisi1 = [
        { id: "biodata", label: "Biodata", link: "biodata" },
        { id: "keluarga", label: "Keluarga", link: "keluarga" },
        { id: "pengajar", label: "Pengajar", link: "pengajar" },
        { id: "karyawan", label: "Karyawan", link: "karyawan" },
        { id: "pengurus", label: "Pengurus", link: "pengurus" },
        { id: "walikelas", label: "Wali Kelas", link: "wali-kelas" },
        { id: "berkas", label: "Berkas", link: "berkas" },
        { id: "warpes", label: "Warga Pesantren", link: "warga-pesantren" },
    ];

    const tabsKondisi2 = [
        { id: "biodata", label: "Biodata", link: "biodata" },
        { id: "keluarga", label: "Keluarga", link: "keluarga" },
        { id: "santri", label: "Santri", link: "santri" },
        { id: "domisili", label: "Domisili Santri", link: "domisili-santri" },
        { id: "waliasuh", label: "Wali Asuh", link: "wali-asuh" },
        { id: "anakasuh", label: "Anak Asuh", link: "anak-asuh" },
        { id: "pendidikan", label: "Pendidikan", link: "pendidikan" },
        { id: "khadam", label: "Khadam", link: "khadam" },
        { id: "berkas", label: "Berkas", link: "berkas" },
        { id: "warpes", label: "Warga Pesantren", link: "warga-pesantren" },
        { id: "progress", label: "Progress Report", link: "progress-report" }
    ];

    const tabsKondisi3 = [
        { id: "biodata", label: "Biodata", link: "biodata" },
        { id: "keluarga", label: "Keluarga", link: "keluarga" }
    ];

    useEffect(() => {
        console.log("Mounted once");
    }, []);

    // Tentukan tab yang aktif berdasarkan kondisi
    const getCurrentTabs = () => {
        switch (tabKondisi) {
            case 'kondisi1':
                return tabsKondisi1;
            case 'kondisi2':
                return tabsKondisi2;
            case 'kondisi3':
                return tabsKondisi3;
            default:
                return tabsKondisi2;
        }
    };


    const loadPesertaData = useCallback(async (id) => {
        if (!id || id.trim() === "") {
            console.warn("ID tidak valid");
            return;
        }

        setIsLoading(true);

        try {
            // Cek di sessionStorage
            const cachedData = sessionStorage.getItem(`data_formulir_profile_${id}`);
            if (cachedData) {
                console.log("Menggunakan data dari sessionStorage untuk ID:", id);
                setPesertaData(JSON.parse(cachedData));
                return;
            }

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
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("Response dari API:", responseData);

            if (!responseData || !responseData.data) {
                console.warn("Data tidak ditemukan dalam response");
                return;
            }

            const biodata = responseData.data;
            setPesertaData(biodata);
            sessionStorage.setItem(`data_formulir_profile_${id}`, JSON.stringify(biodata));
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Gagal memuat data peserta');
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const kondisiFromState = location.state?.kondisiTabFormulir;
        if (['kondisi1', 'kondisi2', 'kondisi3'].includes(kondisiFromState)) {
            setTabKondisi(kondisiFromState);
            sessionStorage.setItem("last_kondisi_formulir", kondisiFromState);
        } else {
            const lastKondisi = sessionStorage.getItem("last_kondisi_formulir");
            if (lastKondisi) {
                setTabKondisi(lastKondisi);
            }
        }
    }, [location.state]);

    useEffect(() => {
        // Kalau route sudah bukan /formulir atau turunannya
        if (!location.pathname.startsWith("/formulir")) {
            setTabKondisi("kondisi2"); // balik ke default
            sessionStorage.removeItem("last_kondisi_formulir"); // kalau pakai sessionStorage
        }
    }, [location.pathname]);


    // Effect untuk handle routing dan kondisi tab
    useEffect(() => {
        // const kondisiFromState = location.state?.kondisiTabFormulir;
        // if (['kondisi1', 'kondisi2', 'kondisi3'].includes(kondisiFromState)) {
        //     setTabKondisi(kondisiFromState);
        // }

        if (biodata_id) {
            sessionStorage.setItem("last_biodata_id", biodata_id);
        } else {
            const lastId = sessionStorage.getItem("last_biodata_id");
            const isFormulirRoot = location.pathname === "/formulir";
            if (lastId && isFormulirRoot) {
                const currentTabs = getCurrentTabs();
                navigate(`/formulir/${lastId}/${currentTabs[0].link}`, { replace: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id, navigate, location.pathname, location.state]);

    // Effect terpisah untuk load data - hanya ketika biodata_id berubah
    const key = `data_formulir_profile_${biodata_id}`;
    const cachedData = sessionStorage.getItem(key);
    useEffect(() => {
        const id = biodata_id; // ambil dari props, route, atau state

        if (!cachedData) {
            // Tidak ada cache → lakukan fetch ulang
            console.log("Cache hilang, fetching ulang...");
            loadPesertaData(id);
        } else {
            // Cache masih ada → pakai cache
            setPesertaData(JSON.parse(cachedData));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cachedData]); // jalankan saat id berubah

    // Tambahkan useEffect untuk listen event dari child component
    useEffect(() => {
        const handleBiodataUpdate = (event) => {
            const { biodata_id: updatedId } = event.detail;
            if (updatedId === biodata_id) {
                console.log("Refreshing profile data after biodata update");
                // Clear cache dan reload data
                sessionStorage.removeItem(`data_formulir_profile_${biodata_id}`);
                loadPesertaData(biodata_id);
            }
        };

        window.addEventListener('biodataUpdated', handleBiodataUpdate);

        return () => {
            window.removeEventListener('biodataUpdated', handleBiodataUpdate);
        };
    }, [biodata_id, loadPesertaData]);

    // Format tanggal
    const formatTanggal = (tanggal) => {
        if (!tanggal) return '-';
        try {
            const date = new Date(tanggal);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return tanggal;
        }
    };

    const currentTabs = getCurrentTabs();

    return (
        <div className="flex-1 p-6">
            {!biodata_id ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-center text-gray-600 py-12">
                        <p className="text-lg font-medium">Belum ada data yang dipilih.</p>
                        <p className="text-sm text-gray-500 mt-2">Silakan pilih data terlebih dahulu untuk melihat formulir.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Single Container */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Memuat data...</span>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col md:flex-row items-start gap-6">
                                        {/* Profile Photo */}
                                        <div className="relative group">
                                            <div className="w-32 h-40 bg-white rounded-xl shadow-md overflow-hidden border-4 border-white">
                                                <img
                                                    src={pesertaData?.pas_foto_url || blankProfile}
                                                    alt="Foto Profil"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = blankProfile;
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Profile Info */}
                                        <div className="flex-1 pt-2">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h1 className="text-3xl font-bold text-gray-900">
                                                    {pesertaData?.nama || 'Nama tidak tersedia'}
                                                </h1>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v1H8V6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {pesertaData?.nik ? "NIK" : "No Passport"}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {pesertaData?.nik || pesertaData?.no_passport || "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Jenis Kelamin</p>
                                                        <p className="text-sm text-gray-600">
                                                            {pesertaData?.jenis_kelamin === 'l' ? 'Laki-laki' :
                                                                pesertaData?.jenis_kelamin === 'p' ? 'Perempuan' :
                                                                    pesertaData?.jenis_kelamin || '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Email</p>
                                                        <p className="text-sm text-gray-600">
                                                            {pesertaData?.email || '-'}
                                                        </p>
                                                    </div>
                                                </div> */}

                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Tempat Lahir</p>
                                                        <p className="text-sm text-gray-600">
                                                            {pesertaData?.tempat_lahir || '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Tanggal Lahir</p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatTanggal(pesertaData?.tanggal_lahir)}
                                                        </p>
                                                    </div>
                                                </div>



                                                {/* <div className="flex items-center gap-3 text-gray-600">
                                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                                                            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">No. HP</p>
                                                        <p className="text-sm text-gray-600">
                                                            {pesertaData?.no_telepon || '-'}
                                                        </p>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(prevRoute || "/")}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                        Kembali
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tab Navigation */}
                        <div className="px-8 py-0 bg-white">
                            <nav className="border-b border-gray-200">
                                <ul className="flex flex-wrap -mb-px">
                                    {currentTabs.map((tab) => {
                                        const fullPath = `/formulir/${biodata_id}/${tab.link}`;
                                        const isActive = location.pathname === fullPath;
                                        return (
                                            <li key={tab.id} className="mr-2">
                                                <Link
                                                    to={fullPath}
                                                    className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${isActive
                                                        ? "text-blue-600 border-blue-600 bg-blue-50"
                                                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {tab.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <Outlet />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Formulir;
