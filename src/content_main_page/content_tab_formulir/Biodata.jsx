import { useState } from "react";

const Biodata = () => {
    const [jenisKelamin, setJenisKelamin] = useState("");
    const [jenjangPendidikanTerakhir, setJenjangPendidikanTerakhir] = useState("");
    // const [formData, setFormData] = useState({
    //     nama: "",
    //     nis: "",
    //     kelas: "",
    //   });

    //   const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    //   };
    return (
        <>
            <form action="" method="POST">
                {/* <div className="flex flex-col md:flex-row md:items-center">
                    <label className="md:w-1/3 font-medium">Kelas</label>
                    <input
                        type="text"
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleChange}
                        className="mt-1 md:mt-0 p-2 border rounded-md flex-1"
                    />
                </div> */}
                <div className="relative">
                    {/* <div className="absolute top-0 right-0 w-1/4">
                        <div className="profile-image bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                            <img
                                src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                                alt="Foto Santri"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-md-8 space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                                <label htmlFor="kewarganegaraan" className="lg:w-1/4 text-black">Kewarganegaraan</label>
                                <div className="lg:w-3/4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <input id="inline-radio" type="radio" value="WNI" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="inline-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-black">WNI</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="inline-2-radio" type="radio" value="WNA" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="inline-2-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-black">WNA</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                                <label htmlFor="passport" className="lg:w-1/4 text-black">No Passport</label>
                                <div className="lg:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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

                            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                                <label htmlFor="nokk" className="lg:w-1/4 text-black">Nomor KK</label>
                                <div className="lg:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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

                            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                                <label htmlFor="nonik" className="lg:w-1/4 text-black">NIK</label>
                                <div className="lg:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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

                            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                                <label htmlFor="namaLengkap" className="lg:w-1/4 text-black">Nama Lengkap</label>
                                <div className="lg:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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

                            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                                <label htmlFor="jenisKelamin" className="lg:w-1/4 text-black">Jenis Kelamin</label>
                                <div className="lg:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                        <select
                                            id="jenisKelamin"
                                            name="jenisKelamin"
                                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                            value={jenisKelamin}
                                            onChange={(e) => setJenisKelamin(e.target.value)}
                                        >
                                            <option value="" disabled>Pilih</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                                <label htmlFor="tempatLahir" className="lg:w-1/4 text-black">Tempat Lahir</label>
                                <div className="lg:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                            <div className="flex flex-col md:flex-row md:items-center space-x-4">
                                <label htmlFor="passport" className="md:w-1/4 text-blcak">Tanggal Lahir</label>
                                <div className="md:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                        <input
                                            id="tanggalLahir"
                                            name="tanggalLahir"
                                            type="date"
                                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center space-x-4">
                                <label htmlFor="passport" className="md:w-1/4 text-blcak">Anak Ke</label>
                                <div className="md:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                            <div className="flex flex-col md:flex-row md:items-center space-x-4">
                                <label htmlFor="passport" className="md:w-1/4 text-blcak">Jumlah Saudara</label>
                                <div className="md:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                            <div className="flex flex-col md:flex-row md:items-center space-x-4">
                                <label htmlFor="jenisKelamin" className="md:w-1/4 text-black">Jenjang Pendidikan Terakhir</label>
                                <div className="md:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
                                        <select
                                            id="jenjangPendidikanTerakhir"
                                            name="jenjangPendidikanTerakhir"
                                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                            value={jenjangPendidikanTerakhir}
                                            onChange={(e) => setJenjangPendidikanTerakhir(e.target.value)}
                                        >
                                            <option value="" disabled>Pilih</option>
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
                            <div className="flex flex-col md:flex-row md:items-center space-x-4">
                                <label htmlFor="passport" className="md:w-1/4 text-blcak">Nomor Telepon</label>
                                <div className="md:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                            <div className="flex flex-col md:flex-row md:items-center space-x-4">
                                <label htmlFor="passport" className="md:w-1/4 text-blcak">E-Mail</label>
                                <div className="md:w-3/4">
                                    <div className="flex items-center rounded-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
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
                        </div>

                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Biodata;
