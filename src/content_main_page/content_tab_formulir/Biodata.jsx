import { useState } from "react";

const Biodata = () => {
    const [jenisKelamin, setJenisKelamin] = useState("");
    const [jenjangPendidikanTerakhir, setJenjangPendidikanTerakhir] = useState("");

    return (
        <div className="relative p-2 bg-white ">
            {/* Judul Formulir */}
            <h1 className="text-xl font-bold mb-4">Formulir</h1>

            {/* Foto di pojok kanan atas */}
            <div className="absolute top-4 right-0 w-24 h-32 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden shadow">
                <img
                    src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                    alt="Foto Santri"
                    className="object-cover w-full h-full"
                />
            </div>

            <form action="" method="POST" className="space-y-4 mt-6">
                {/* Kewarganegaraan */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="kewarganegaraan" className="lg:w-1/4 text-black">
                        Kewarganegaraan
                    </label>
                    <div className="lg:w-3/4">
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                            <div className="flex items-center">
                                <input
                                    id="wni-radio"
                                    type="radio"
                                    value="WNI"
                                    name="kewarganegaraan"
                                    defaultChecked
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="wni-radio" className="ml-2 text-sm font-medium text-gray-900">
                                    WNI
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="wna-radio"
                                    type="radio"
                                    value="WNA"
                                    name="kewarganegaraan"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="wna-radio" className="ml-2 text-sm font-medium text-gray-900">
                                    WNA
                                </label>
                            </div>
                        </div>
                    </div>
                </div>


                {/* No Passport */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="passport" className="lg:w-1/4 text-black">
                        No Passport
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

                {/* NIK */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 ">
                    <label htmlFor="nonik" className="lg:w-1/4 text-black">
                        NIK
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

                {/* Nomor KK */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="nokk" className="lg:w-1/4 text-black">
                        Nomor KK
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

                {/* Nama Lengkap */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="namaLengkap" className="lg:w-1/4 text-black">
                        Nama Lengkap
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
                        Jenis Kelamin
                    </label>
                    <div className="lg:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <select
                                id="jenisKelamin"
                                name="jenisKelamin"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                value={jenisKelamin}
                                onChange={(e) => setJenisKelamin(e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih
                                </option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <label htmlFor="tempatLahir" className="lg:w-1/4 text-black">
                        Tempat Lahir
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
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggalLahir" className="md:w-1/4 text-black">
                        Tanggal Lahir
                    </label>
                    <div className="md:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="tanggalLahir"
                                name="tanggalLahir"
                                type="date"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Anak Ke */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="anakKe" className="md:w-1/4 text-black">
                        Anak Ke
                    </label>
                    <div className="md:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="anakKe"
                                name="anakKe"
                                type="text"
                                placeholder="Anak Keberapa"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Jumlah Saudara */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jumlahSaudara" className="md:w-1/4 text-black">
                        Jumlah Saudara
                    </label>
                    <div className="md:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="jumlahSaudara"
                                name="jumlahSaudara"
                                type="text"
                                placeholder="Masukkan Jumlah Saudara"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jenjangPendidikanTerakhir" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir
                    </label>
                    <div className="md:w-3/4 max-w-md">
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

                {/* Nomor Telepon */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="noTelpon" className="md:w-1/4 text-black">
                        Nomor Telepon
                    </label>
                    <div className="md:w-3/4 max-w-md">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                            <input
                                id="noTelpon"
                                name="noTelpon"
                                type="number"
                                placeholder="Masukkan Nomor Telepon"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* E-Mail */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="email" className="md:w-1/4 text-black">
                        E-Mail
                    </label>
                    <div className="md:w-3/4 max-w-md">
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

export default Biodata;
