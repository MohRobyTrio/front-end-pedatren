import { useState } from "react";

const FormKeluarga = ({ register, errors }) => {
    const [jenjangPendidikanTerakhir, setJenjangPendidikanTerakhir] = useState("");
    const [pekerjaan, setpekerjaan] = useState("");
    const [penghasilan, setpenghasilan] = useState("");
    const [umur, setUmur] = useState(0);

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

    // Menghitung umur saat tanggal lahir berubah
    const hitungUmur = (tahun) => {
        const tahunSekarang = new Date().getFullYear();
        setUmur(tahunSekarang - tahun);
    };

    return (
        <>
            <div className="space-y-2">
                <p className="font-bold text-xl">Data Ayah</p>
                <hr className="border-t border-gray-500 mb-4 mt-2" />
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nikAyah" className="md:w-1/4 text-black">
                        NIK Ayah *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="nikAyah"
                                name="nikAyah"
                                type="text"
                                placeholder="Masukkan NIK Ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                 {...register('no_kk', { required: true })}
                            />
                            {errors.no_kk && <span>KK wajib diisi</span>}
                        </div>
                    </div>
                </div>

                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="namaAyah" className="md:w-1/4 text-black">
                        Nama Ayah *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="namaAyah"
                                name="namaAyah"
                                type="text"
                                placeholder="Masukkan Nama Ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tempatLahir" className="md:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="tempatLahir"
                                name="tempatLahir"
                                type="text"
                                placeholder="Masukkan Tempat Lahir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggalLahir" className="md:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="flex flex-col min-[833px]:flex-row space-y-2 min-[833px]:space-y-0">
                        <div className="flex space-x-1 mr-2">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.tahun}
                                    onChange={(e) => {
                                        setTanggalLahir({ ...tanggalLahir, tahun: e.target.value });
                                        hitungUmur(e.target.value);
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
                        {/* Label umur */}
                        <span className="w-fit h-8 bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-sm">
                            umur {umur} tahun
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="noTelponAyah" className="md:w-1/4 text-black">
                        Nomor Telepon Ayah
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="noTelponAyah"
                                name="noTelponAyah"
                                type="number"
                                placeholder="+62"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jenjangPendidikanTerakhirAyah" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="jenjangPendidikanTerakhirAyah"
                                name="jenjangPendidikanTerakhirAyah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={jenjangPendidikanTerakhir}
                                onChange={(e) => setJenjangPendidikanTerakhir(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih
                                </option>
                                <option value="TK">TK</option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="D3">D3</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Pekerjaan" className="md:w-1/4 text-black">
                        Pekerjaan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="Pekerjaan"
                                name="pekerjaan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={pekerjaan}
                                onChange={(e) => setpekerjaan(e.target.value)}
                            >
                                <option value="" disabled>
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

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Penghasilan" className="md:w-1/4 text-black">
                        Penghasilan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="penghasilan"
                                name="penghasilan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={penghasilan}
                                onChange={(e) => setpenghasilan(e.target.value)}
                            >
                                <option value="" disabled>
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

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Wafat" className="md:w-1/4 text-black">
                        Wafat *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="Wafat" value="Tidak" className="w-4 h-4" />
                        <span>Tidak</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="Wafat" value="Ya" className="w-4 h-4" />
                        <span>Ya</span>
                    </label>
                </div>

                <hr className="border-t border-gray-500 mb-2 mt-8" />
                <p className="font-bold text-xl">Data Ibu</p>
                <hr className="border-t border-gray-500 mb-4 mt-2" />
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nikIbu" className="md:w-1/4 text-black">
                        NIK Ibu *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="nikIbu"
                                name="nikIbu"
                                type="text"
                                placeholder="Masukkan NIK Ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="namaIbu" className="md:w-1/4 text-black">
                        Nama Ibu *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="namaIbu"
                                name="namaIbu"
                                type="text"
                                placeholder="Masukkan Nama Ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tempatLahir" className="md:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="tempatLahir"
                                name="tempatLahir"
                                type="text"
                                placeholder="Masukkan Tempat Lahir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggalLahir" className="md:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="flex flex-col min-[833px]:flex-row space-y-2 min-[833px]:space-y-0">
                        <div className="flex space-x-1 mr-2">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.tahun}
                                    onChange={(e) => {
                                        setTanggalLahir({ ...tanggalLahir, tahun: e.target.value });
                                        hitungUmur(e.target.value);
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
                        {/* Label umur */}
                        <span className="w-fit h-8 bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-sm">
                            umur {umur} tahun
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="noTelponIbu" className="md:w-1/4 text-black">
                        Nomor Telepon Ibu
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="noTelponIbu"
                                name="noTelponIbu"
                                type="number"
                                placeholder="+62"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jenjangPendidikanTerakhirIbu" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="jenjangPendidikanTerakhirIbu"
                                name="jenjangPendidikanTerakhirIbu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={jenjangPendidikanTerakhir}
                                onChange={(e) => setJenjangPendidikanTerakhir(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih
                                </option>
                                <option value="TK">TK</option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="D3">D3</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Pekerjaan" className="md:w-1/4 text-black">
                        Pekerjaan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="Pekerjaan"
                                name="pekerjaan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={pekerjaan}
                                onChange={(e) => setpekerjaan(e.target.value)}
                            >
                                <option value="" disabled>
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

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Penghasilan" className="md:w-1/4 text-black">
                        Penghasilan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="penghasilan"
                                name="penghasilan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={penghasilan}
                                onChange={(e) => setpenghasilan(e.target.value)}
                            >
                                <option value="" disabled>
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

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Wafat" className="md:w-1/4 text-black">
                        Wafat *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="Wafat" value="Tidak" className="w-4 h-4" />
                        <span>Tidak</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="Wafat" value="Ya" className="w-4 h-4" />
                        <span>Ya</span>
                    </label>
                </div>


                <hr className="border-t border-gray-500 mb-2 mt-8" />
                <p className="font-bold text-xl">Data Wali</p>
                <hr className="border-t border-gray-500 mb-4 mt-2" />
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nikWali" className="md:w-1/4 text-black">
                        NIK Wali *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="nikWali"
                                name="nikWali"
                                type="text"
                                placeholder="Masukkan NIK Wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="namaIbu" className="md:w-1/4 text-black">
                        Nama Wali *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="namaWali"
                                name="namaWali"
                                type="text"
                                placeholder="Masukkan Nama Wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jenjangPendidikanTerakhirIbu" className="md:w-1/4 text-black">
                        Hubungan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="jenjangPendidikanTerakhirIbu"
                                name="jenjangPendidikanTerakhirIbu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                            >
                                <option value="" disabled>
                                    Pilih
                                </option>
                                <option value="ayah kandung">Ayah Kandung</option>
                                <option value="ibu kandung">Ibu Kandung</option>
                                <option value="kakak kandung">Kakak Kandung</option>
                                <option value="adik kandung">Adik Kandung</option>
                                <option value="kakek kandung">Kakek Kandung</option>
                                <option value="nenek kandung">Nenek Kandung</option>
                                <option value="paman dari ayah/ibu">Paman dari Ayah/Ibu</option>
                                <option value="bibi dari ayah/ibu">Bibi dari Ayah/Ibu</option>
                                <option value="ayah sambung">Ayah sambung</option>
                                <option value="ibu sambung">Ayah ibu</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tempatLahir" className="md:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="tempatLahir"
                                name="tempatLahir"
                                type="text"
                                placeholder="Masukkan Tempat Lahir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggalLahir" className="md:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="flex flex-col min-[833px]:flex-row space-y-2 min-[833px]:space-y-0">
                        <div className="flex space-x-1 mr-2">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.tahun}
                                    onChange={(e) => {
                                        setTanggalLahir({ ...tanggalLahir, tahun: e.target.value });
                                        hitungUmur(e.target.value);
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
                        {/* Label umur */}
                        <span className="w-fit h-8 bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-sm">
                            umur {umur} tahun
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="noTelponWali" className="md:w-1/4 text-black">
                        Nomor Telepon Wali
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="noTelponWali"
                                name="noTelponWali"
                                type="number"
                                placeholder="+62"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jenjangPendidikanTerakhirIbu" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="jenjangPendidikanTerakhirIbu"
                                name="jenjangPendidikanTerakhirIbu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={jenjangPendidikanTerakhir}
                                onChange={(e) => setJenjangPendidikanTerakhir(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih
                                </option>
                                <option value="TK">TK</option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="D3">D3</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Pekerjaan" className="md:w-1/4 text-black">
                        Pekerjaan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="Pekerjaan"
                                name="pekerjaan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={pekerjaan}
                                onChange={(e) => setpekerjaan(e.target.value)}
                            >
                                <option value="" disabled>
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

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="Penghasilan" className="md:w-1/4 text-black">
                        Penghasilan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <select
                                id="penghasilan"
                                name="penghasilan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={penghasilan}
                                onChange={(e) => setpenghasilan(e.target.value)}
                            >
                                <option value="" disabled>
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

            </div>
        </>
    )
};

export default FormKeluarga;
