import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
// import blankProfile from "../assets/blank_profile.png";
import { Link } from "react-router-dom";
// import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../hooks/config";

// Subkomponen
const Biodata = ({ biodata }) => (
    <div>
        {/* <h1 className="text-xl font-bold mb-4">Biodata</h1> */}
        <p><strong>Nama:</strong> {biodata.nama}</p>
        <p><strong>NIUP:</strong> {biodata.niup}</p>
        <p><strong>NIK/No. Paspor:</strong> {biodata.nik_nopassport}</p>
        <p><strong>Jenis Kelamin:</strong> {biodata.jenis_kelamin === "p" ? "Perempuan" : "Laki-laki"}</p>
        <p><strong>TTL:</strong> {biodata.tempat_tanggal_lahir}</p>
        <p><strong>Anak Ke:</strong> {biodata.anak_ke}</p>
        <p><strong>Umur:</strong> {biodata.umur}</p>
        <p><strong>Alamat:</strong> {biodata.kecamatan}, {biodata.kabupaten}, {biodata.provinsi}</p>
        <p><strong>Warganegara:</strong> {biodata.warganegara}</p>
    </div>
);

const renderStatus = (value) => {
    if (value === true || value === 1) return <FontAwesomeIcon icon={faCheck} className="text-green-600" />;
    // if (value === false || value === 0) return <FontAwesomeIcon icon={faTimes} className="text-red-600" />;
    if (value === false || value === 0) return "";
    return "-";
};

const Keluarga = ({ keluarga }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">NIK</th>
                    <th className="px-3 py-2 border-b">Nama</th>
                    <th className="px-3 py-2 border-b">Status Keluarga</th>
                    <th className="px-3 py-2 border-b">Sebagai Wali</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">

                {
                    keluarga.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        keluarga.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{item.nik || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.status || "-"}</td>
                                <td className="px-3 py-2 border-b">{renderStatus(item.wali)}</td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>

);

// Placeholder untuk tab lainnya
const Santri = () => <h1 className="text-xl font-bold">Informasi Santri</h1>;
const WaliAsuh = () => <h1 className="text-xl font-bold">Wali Asuh</h1>;
const Pendidikan = ({ pendidikan }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">No. Induk</th>
                    <th className="px-3 py-2 border-b">Nama Lembaga</th>
                    <th className="px-3 py-2 border-b">Jurusan</th>
                    <th className="px-3 py-2 border-b">Kelas</th>
                    <th className="px-3 py-2 border-b">Rombel</th>
                    <th className="px-3 py-2 border-b">Tahun Masuk</th>
                    <th className="px-3 py-2 border-b">Tahun Lulus</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">
                {
                    pendidikan.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        pendidikan.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{item.no_induk || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.nama_lembaga || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.nama_jurusan || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.nama_kelas || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.nama_rombel || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tahun_masuk || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tahun_lul || "-"}</td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>

);
const Pengajar = () => <h1 className="text-xl font-bold">Pengajar</h1>;
const Karyawan = () => <h1 className="text-xl font-bold">Karyawan</h1>;
const Pengurus = () => <h1 className="text-xl font-bold">Pengurus</h1>;
const Khadam = () => <h1 className="text-xl font-bold">Khadam</h1>;
const Berkas = () => <h1 className="text-xl font-bold">Berkas</h1>;
const WarPes = () => <h1 className="text-xl font-bold">Warga Pesantren</h1>;
const Progress = () => <h1 className="text-xl font-bold">Progress Report</h1>;
const Domisili = ({ domisili }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">Kamar</th>
                    <th className="px-3 py-2 border-b">Blok</th>
                    <th className="px-3 py-2 border-b">Wilayah</th>
                    <th className="px-3 py-2 border-b">Tanggal Ditempati</th>
                    <th className="px-3 py-2 border-b">Tanggal Pindah</th>
                    <th className="px-3 py-2 border-b">Status</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">
                {
                    domisili.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        domisili.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.kamar || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.blok || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.wilayah || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tanggal_ditempati || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tanggal_pindah || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.status || "-"}</td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>

);


const TesModal = ({title, menu, item, onClose }) => {
    const [activeTab, setActiveTab] = useState("biodata");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // console.log(menu);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                let endpoint = '';

                if (menu === 1) endpoint = `pesertadidik/${item.biodata_id}`;
                else if (menu === 2) endpoint = `santri/${item.biodata_id}`;
                else if (menu === 3) endpoint = `santri-nondomisili/${item.biodata_id}`;
                else if (menu === 4) endpoint = `pelajar/${item.biodata_id}`;
                else if (menu === 5) endpoint = `pesertadidik-bersaudara/${item.biodata_id}`;
                else if (menu === 6) endpoint = `orangtua/${item.biodata_id}`;
                else if (menu === 7) endpoint = `wali/${item.biodata_id}`;
                else if (menu === 8) endpoint = `pengajar/${item.id}`;
                else if (menu === 9) endpoint = `pengurus/${item.id}`;
                else if (menu === 10) endpoint = `karyawan/${item.biodata_id}`;
                else if (menu === 11) endpoint = `walikelas/${item.biodata_id}`;
                else if (menu === 12) endpoint = `khadam/${item.biodata_id}`;
                else if (menu === 13) endpoint = `alumni/${item.biodata_id}`;

                else if (menu === 21) endpoint = `pegawai/${item.id}`;

                if (!endpoint) throw new Error('Menu tidak valid');

                const res = await fetch(`${API_BASE_URL}data-pokok/${endpoint}`);
                if (!res.ok) throw new Error('Gagal mengambil data');

                console.log(endpoint);
                

                const json = await res.json();
                setData(json.data);

                if (menu === 12) console.log(item.id_khadam);
                if (menu === 13) console.log(item.biodata_id);

                console.log(item.biodata_id);
                console.log(item.id);
                console.log(menu);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data.");
            } finally {
                setLoading(false);
            }
        };

        if (item?.biodata_id || item?.id_khadam || item?.id) {
            fetchData();
        }
    }, [item.biodata_id, item.id, item.id_khadam, menu]);


    const tabs = [
        data?.Biodata && {
            id: "biodata",
            label: "Biodata",
            content: <Biodata biodata={data.Biodata} />
        },
        data?.Keluarga?.length > 0 && {
            id: "keluarga",
            label: "Keluarga",
            content: <Keluarga keluarga={data.Keluarga} />
        },
        data?.Santri && {
            id: "santri",
            label: "Santri",
            content: <Santri />
        },
        data?.Domisili?.length > 0 && {
            id: "domisili",
            label: "Domisili",
            content: <Domisili domisili={data.Domisili}/>
        },
        data?.WaliAsuh && {
            id: "waliasuh",
            label: "Wali Asuh",
            content: <WaliAsuh />
        },
        data?.Pendidikan?.length > 0 && {
            id: "pendidikan",
            label: "Pendidikan",
            content: <Pendidikan pendidikan={data.Pendidikan}/>
        },
        data?.Pengajar && {
            id: "pengajar",
            label: "Pengajar",
            content: <Pengajar />
        },
        data?.Karyawan && {
            id: "karyawan",
            label: "Karyawan",
            content: <Karyawan />
        },
        data?.Pengurus && {
            id: "pengurus",
            label: "Pengurus",
            content: <Pengurus />
        },
        data?.Khadam?.length > 0 && {
            id: "khadam",
            label: "Khadam",
            content: <Khadam />
        },
        data?.Berkas && {
            id: "berkas",
            label: "Berkas",
            content: <Berkas />
        },
        data?.WargaPesantren && {
            id: "warpes",
            label: "Warga Pesantren",
            content: <WarPes />
        },
        data?.Progress && {
            id: "progress",
            label: "Progress Report",
            content: <Progress />
        },
        data?.Kunjungan_Mahrom && {
            id: "Kunjungan Mahrom",
            label: "Kunjungan Mahrom",
            content: <Progress />
        },
        data?.Status_Santri && {
            id: "Status Santri",
            label: "Status Santri",
            content: <Progress />
        },
    ].filter(Boolean); // Hapus tab yang tidak punya data    

    return (
        <Transition appear show={true} as={Fragment}>
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
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail {title}</Dialog.Title>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {loading && (
                                    <div className="flex justify-center items-center h-full">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" />
                                    </div>
                                )}
                                {error && <p className="text-red-500">{error}</p>}
                                {data && (
                                    <>
                                        {/* <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-4">
                                            <img src={data.Biodata?.foto_profil || blankProfile} alt="Foto Profil" className="w-40 h-48 object-cover rounded" />
                                            <div>
                                                <p><strong>Nama:</strong> {data.Biodata?.nama}</p>
                                                <p><strong>NIUP:</strong> {data.Biodata?.niup}</p>
                                                <p><strong>NIK:</strong> {data.Biodata?.nik_nopassport}</p>
                                                <p><strong>Kota Asal:</strong> {data.Biodata?.kabupaten}</p>
                                            </div>
                                        </div> */}

                                        {/* <div className="mt-6 border-b pb-2 flex space-x-4 overflow-x-auto">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                                    onClick={() => setActiveTab(tab.id)}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div> */}

                                        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500">
                                            {tabs.map((tab) => (
                                                <li key={tab.id}>
                                                    <button
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`inline-block p-3 rounded-t-lg border-b-2 ${activeTab === tab.id
                                                            ? "text-blue-600 border-blue-600 bg-gray-200"
                                                            : "border-transparent hover:text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="pt-4">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-4 text-right space-x-2">
                                <Link to="/formulir">
                                    <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                                        Buka di Formulir
                                    </button>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default TesModal;
