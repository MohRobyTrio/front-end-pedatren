import { useState } from "react";

const TabBiodata = () => {
    // const [jenisKelamin, setJenisKelamin] = useState("");
    const [jenjangPendidikanTerakhir, setJenjangPendidikanTerakhir] = useState("");
    const [pekerjaan, setpekerjaan] = useState("");
    const [penghasilan, setpenghasilan] = useState("");
    const [negara, setnegara] = useState("");
    const [provinsi, setprovinsi] = useState("");
    const [kabupaten, setkabupaten] = useState("");
    const [kecamatan, setkecamatan] = useState("");

    const [tanggalLahir, setTanggalLahir] = useState({
        tahun: "2001",
        bulan: "Desember",
        hari: "30",
    });

    const [umur, setUmur] = useState(22);

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
        <div className="relative p-2 bg-white ">
            {/* Judul Formulir */}
            <h1 className="text-xl font-bold mb-4">Formulir</h1>

            {/* Foto - dibuat responsif */}
            <div className="w-48 h-56 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden shadow md:absolute md:top-4 md:right-4">
                <img
                    src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                    alt="Foto Santri"
                    className="object-cover w-full h-full"
                />
            </div>

            <form action="" method="POST" className="md:col-span-2 space-y-4 w-full">
                {/* Kewarganegaraan */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="kewarganegaraan" className="lg:w-1/4 text-black">
                        Kewarganegaraan *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="kewarganegaraan" value="wni" className="w-4 h-4" />
                        <span>WNI</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="kewarganegaraan" value="wna" className="w-4 h-4" />
                        <span>WNA</span>
                    </label>
                </div>
                {/* No Passport */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="passport" className="lg:w-1/4 text-black">
                        No Passport *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="passport"
                                name="passport"
                                type="number"
                                placeholder="Masukkan No Passport"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Nomor KK */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="nokk" className="lg:w-1/4 text-black">
                        Nomor KK *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="nokk"
                                name="nokk"
                                type="number"
                                placeholder="Masukkan No KK"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* NIK */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 ">
                    <label htmlFor="nonik" className="lg:w-1/4 text-black">
                        NIK *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="nonik"
                                name="nonik"
                                type="number"
                                placeholder="Masukkan NIK"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>


                {/* Nama Lengkap */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="namaLengkap" className="lg:w-1/4 text-black">
                        Nama Lengkap *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="namaLengkap"
                                name="namaLengkap"
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="jenisKelamin" className="lg:w-1/4 text-black">
                        Jenis Kelamin *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="jenisKelamin" value="Perempuan" className="w-4 h-4" />
                        <span>Perempuan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="jenisKelamin" value="Laki-Laki" className="w-4 h-4" />
                        <span>Laki-Laki</span>
                    </label>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="tempatLahir" className="lg:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="tanggalLahir" className="lg:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="flex flex-col min-[833px]:flex-row space-y-2 min-[833px]:space-y-0">
                        <div className="flex space-x-1 mr-2">
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 focus-within:border-gray-500">
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
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 focus-within:border-gray-500">
                                <select
                                    className="w-full py-1.5 pr-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                    value={tanggalLahir.bulan}
                                    onChange={(e) => setTanggalLahir({ ...tanggalLahir, bulan: e.target.value })} >
                                    {daftarBulan.map((bulan) => (
                                        <option key={bulan} value={bulan}>{bulan}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center rounded-md shadow-md bg-white pl-2 border border-gray-300 focus-within:border-gray-500">
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

                {/* Anak Ke */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="anakKe" className="lg:w-1/4 text-black">
                        Anak Ke *
                    </label>
                    <div className="flex space-x-4">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                type="number"
                                min="1"
                                className="w-13 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                        <span>Dari</span>
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                type="number"
                                min="1"
                                className="w-13 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 my-4" />

                {/* Tinggal Bersama */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="tinggalbersama" className="lg:w-1/4 text-black">
                        Tinggal Bersama
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="tinggalbersama"
                                name="tinggalbersama"
                                type="text"
                                placeholder="Masukkan Tinggal Bersama"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="jenjangPendidikanTerakhir" className="lg:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <select
                                id="jenjangPendidikanTerakhir"
                                name="jenjangPendidikanTerakhir"
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

                {/* Pendidikan Terakhir */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="PendidikanTerakhir" className="lg:w-1/4 text-black">
                        Nama Pendidikan Terakhir
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="namapendidikanterakhir"
                                name="namapendidikanterakhir"
                                type="text"
                                placeholder="Masukkan Nama Pendidikan Terakhir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
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
                    <label htmlFor="noTelpon1" className="md:w-1/4 text-black">
                        Nomor Telepon 1
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="noTelpon"
                                name="noTelpon"
                                type="number"
                                placeholder="+62"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Nomor Telepon 2 */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="noTelpon2" className="lg:w-1/4 text-black">
                        Nomor Telepon 2
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="noTelpon"
                                name="noTelpon"
                                type="number"
                                placeholder="+62"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
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
                                name="email"
                                type="email"
                                placeholder="Masukkan E-Mail"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Pekerjaan */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="Pekerjaan" className="lg:w-1/4 text-black">
                        Pekerjaan
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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

                {/* Penghasilan */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="Penghasilan" className="lg:w-1/4 text-black">
                        Penghasilan
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                <hr className="border-t border-gray-300 my-4" />

                {/* Negara */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="Negara" className="lg:w-1/4 text-black">
                        Negara *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <select
                                id="negara"
                                name="negara"
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
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="Provinsi" className="lg:w-1/4 text-black">
                        Provinsi *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <select
                                id="provinsi"
                                name="provinsi"
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
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="Kabupaten" className="lg:w-1/4 text-black">
                        Kabupaten *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="Provinsi" className="lg:w-1/4 text-black">
                        Kecamatan *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                <hr className="border-t border-gray-300 my-4" />

                {/* Jalan */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="namaLengkap" className="lg:w-1/4 text-black">
                        Jalan *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="jalan"
                                name="jalan"
                                type="text"
                                placeholder="Masukkan Nama Jalan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Kode Pos */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="namaLengkap" className="lg:w-1/4 text-black">
                        Kode Pos *
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="kodepos"
                                name="kodepos"
                                type="text"
                                placeholder="Masukkan Kode Pos"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Masi Hidup/Tidak */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="Wafat" className="lg:w-1/4 text-black">
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


                <br />
                {/* Tombol Simpan */}
                <div className="mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TabBiodata;
