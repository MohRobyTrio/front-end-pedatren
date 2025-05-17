import { useState } from "react";

const FormDomisiliPendidikan = ({ register, errors }) => {
const [negara, setnegara] = useState("");
    const [provinsi, setprovinsi] = useState("");
    const [kabupaten, setkabupaten] = useState("");
    const [kecamatan, setkecamatan] = useState("");

    const [tanggalLahir, setTanggalLahir] = useState({
        tahun: "yyyy",
        bulan: "MMM",
        hari: "dd",
    });

    const daftarTahun = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const daftarBulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const daftarHari = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
    <>
        <div className="space-y-2">
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="namaLengkap" className="md:w-1/4 text-black">
                        No. Induk *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="namaLengkap"
                                name="namaLengkap"
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                 {...register('no_kk', { required: true })}
                            />
                            {errors.no_kk && <span>No KK wajib diisi</span>}
                        </div>
                    </div>
                </div>

                {/* Negara */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Lembaga" className="md:w-1/4 text-black">
                        Lembaga *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="lembaga"
                                name="lembaga"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={negara}
                                onChange={(e) => setnegara(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Negara
                                </option>
                                <option>Indonesia</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Provinsi */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Provinsi" className="md:w-1/4 text-black">
                        Jurusan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="jurusan"
                                name="jurusan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={provinsi}
                                onChange={(e) => setprovinsi(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Provinsi
                                </option>
                                <option>Jawa Timur</option>
                                <option>Jawa Tengah</option>
                                <option>Jawa Barat</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kabupaten */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Kabupaten" className="md:w-1/4 text-black">
                        Kelas *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="kabupaten"
                                name="kabupaten"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={kabupaten}
                                onChange={(e) => setkabupaten(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Kabupaten
                                </option>
                                <option>Probolinggo</option>
                                <option>Pasuruan</option>
                                <option>Jember</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>


                {/* Kecamatan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Provinsi" className="md:w-1/4 text-black">
                        Rombel *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="kecamatan"
                                name="kecamatan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={kecamatan}
                                onChange={(e) => setkecamatan(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Kecamatan
                                </option>
                                <option>Paiton</option>
                                <option>Besuk</option>
                                <option>Kraksaan</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggalLahir" className="md:w-1/4 text-black">
                        Tanggal Masuk Pendidikan *
                    </label>
                    <div className="flex flex-col min-[833px]:flex-row space-y-2 min-[833px]:space-y-0">
                        <div className="flex space-x-1 mr-2">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.tahun}
                                    onChange={(e) => {
                                        setTanggalLahir({ ...tanggalLahir, tahun: e.target.value });
                                    }}
                                >
                                    {daftarTahun.map((tahun) => (
                                        <option key={tahun} value={tahun}>{tahun}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.bulan}
                                    onChange={(e) => setTanggalLahir({ ...tanggalLahir, bulan: e.target.value })} >
                                    {daftarBulan.map((bulan) => (
                                        <option key={bulan} value={bulan}>{bulan}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.hari}
                                    onChange={(e) => setTanggalLahir({ ...tanggalLahir, hari: e.target.value })} >
                                    {daftarHari.map((hari) => (
                                        <option key={hari} value={hari}>{hari}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Lembaga" className="md:w-1/4 text-black">
                        Wilayah *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="lembaga"
                                name="lembaga"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={negara}
                                onChange={(e) => setnegara(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Negara
                                </option>
                                <option>Indonesia</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Provinsi */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Provinsi" className="md:w-1/4 text-black">
                        Blok *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="jurusan"
                                name="jurusan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={provinsi}
                                onChange={(e) => setprovinsi(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Provinsi
                                </option>
                                <option>Jawa Timur</option>
                                <option>Jawa Tengah</option>
                                <option>Jawa Barat</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kabupaten */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Kabupaten" className="md:w-1/4 text-black">
                        Kamar *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="kabupaten"
                                name="kabupaten"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={kabupaten}
                                onChange={(e) => setkabupaten(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Kabupaten
                                </option>
                                <option>Probolinggo</option>
                                <option>Pasuruan</option>
                                <option>Jember</option>
                                <option>Lainnya</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggalLahir" className="md:w-1/4 text-black">
                        Tanggal Masuk Domisili *
                    </label>
                    <div className="flex flex-col min-[833px]:flex-row space-y-2 min-[833px]:space-y-0">
                        <div className="flex space-x-1 mr-2">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.tahun}
                                    onChange={(e) => {
                                        setTanggalLahir({ ...tanggalLahir, tahun: e.target.value });
                                    }}
                                >
                                    {daftarTahun.map((tahun) => (
                                        <option key={tahun} value={tahun}>{tahun}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.bulan}
                                    onChange={(e) => setTanggalLahir({ ...tanggalLahir, bulan: e.target.value })} >
                                    {daftarBulan.map((bulan) => (
                                        <option key={bulan} value={bulan}>{bulan}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.hari}
                                    onChange={(e) => setTanggalLahir({ ...tanggalLahir, hari: e.target.value })} >
                                    {daftarHari.map((hari) => (
                                        <option key={hari} value={hari}>{hari}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>
)
};

export default FormDomisiliPendidikan;
