/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const FormKeluarga = ({ register, setValue, keluargaForm }) => {
    const {
        dropdownValue,
        setDropdownValue,
        inputLainnya,
        setInputLainnya
    } = keluargaForm;
    const isLainnyaAyah = dropdownValue.ayah == "Lainnya";
    const isLainnyaIbu = dropdownValue.ibu == "Lainnya";
    const isLainnyaWali = dropdownValue.wali == "Lainnya";

    // Salin nilai input lainnya ke pekerjaan_ayah
    useEffect(() => {
        if (isLainnyaAyah) {
            setValue("modalPeserta.pekerjaan_ayah", inputLainnya.ayah);
        } else {
            setValue("modalPeserta.pekerjaan_ayah", dropdownValue.ayah);
            setInputLainnya.ayah("");
        }
    }, [dropdownValue.ayah, inputLainnya.ayah]);

    useEffect(() => {
        if (isLainnyaIbu) {
            setValue("modalPeserta.pekerjaan_ibu", inputLainnya.ibu);
        } else {
            setValue("modalPeserta.pekerjaan_ibu", dropdownValue.ibu);
            setInputLainnya.ibu("");
        }
    }, [dropdownValue.ibu, inputLainnya.ibu]);

    useEffect(() => {
        if (isLainnyaWali) {
            setValue("modalPeserta.pekerjaan_wali", inputLainnya.wali);
        } else {
            setValue("modalPeserta.pekerjaan_wali", dropdownValue.wali);
            setInputLainnya.wali("");
        }
    }, [dropdownValue.wali, inputLainnya.wali]);

    return (
        <>
            <div className="space-y-2">
                <p className="font-bold text-xl">Data Ayah</p>
                <hr className="border-t border-gray-500 mb-4 mt-2" />
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nik_ayah" className="md:w-1/4 text-black">
                        NIK Ayah *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nik_ayah"
                                name="nik_ayah"
                                type="text"
                                minLength={16}
                                maxLength={16}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
                                }}
                                placeholder="Masukkan NIK Ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalPeserta.nik_ayah', { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nama_ayah" className="md:w-1/4 text-black">
                        Nama Ayah *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nama_ayah"
                                name="nama_ayah"
                                type="text"
                                placeholder="Masukkan Nama Ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalPeserta.nama_ayah', { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tempat_lahir_ayah" className="md:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="tempat_lahir_ayah"
                                name="tempat_lahir_ayah"
                                type="text"
                                placeholder="Masukkan Tempat Lahir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalPeserta.tempat_lahir_ayah', { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_lahir_ayah" className="md:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_lahir_ayah"
                                name="tanggal_lahir_ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.tanggal_lahir_ayah", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="no_telepon_ayah" className="md:w-1/4 text-black">
                        Nomor Telepon Ayah *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="no_telepon_ayah"
                                name="no_telepon_ayah"
                                type="text"
                                maxLength={14}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                placeholder="08"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.no_telepon_ayah", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pendidikan_terakhir_ayah" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="pendidikan_terakhir_ayah"
                                name="pendidikan_terakhir_ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.pendidikan_terakhir_ayah", { required: true })}
                                required
                            >
                                <option value="">
                                    Pilih
                                </option>
                                <option value="paud">Paud</option>
                                <option value="sd/mi">SD/MI</option>
                                <option value="smp/mts">SMP/MTS</option>
                                <option value="sma/smk/ma">SMA/SMK/MA</option>
                                <option value="d3">D3</option>
                                <option value="d4">D4</option>
                                <option value="s1">S1</option>
                                <option value="s2">S2</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pekerjaan_ayah" className="md:w-1/4 text-black">
                        Pekerjaan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="pekerjaan_ayah"
                                name="pekerjaan_ayah"
                                type="text"
                                placeholder="Masukkan Pekerjaan Ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.pekerjaan_ayah", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="penghasilan_ayah" className="md:w-1/4 text-black">
                        Penghasilan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="penghasilan_ayah"
                                name="penghasilan_ayah"
                                type="number"
                                placeholder="1.000.000"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.penghasilan_ayah", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div> */}

                {/* Pekerjaan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pekerjaan_ayah" className="md:w-1/4 text-black">Pekerjaan *</label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="pekerjaan_ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                value={dropdownValue.ayah}
                                onChange={(e) => setDropdownValue.ayah(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Pekerjaan --</option>
                                <option value="Tidak Bekerja">Tidak Bekerja</option>
                                <option value="Petani">Petani</option>
                                <option value="Buruh">Buruh</option>
                                <option value="Pedagang">Pedagang</option>
                                <option value="PNS">PNS</option>
                                <option value="TNI/Polri">TNI/Polri</option>
                                <option value="Karyawan Swasta">Karyawan Swasta</option>
                                <option value="Wiraswasta">Wiraswasta</option>
                                <option value="Guru">Guru</option>
                                <option value="Dosen">Dosen</option>
                                <option value="Dokter">Dokter</option>
                                <option value="Perawat">Perawat</option>
                                <option value="Pengemudi">Pengemudi</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        {isLainnyaAyah && (
                            <div className="mt-1 flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                <input
                                    type="text"
                                    placeholder="Masukkan Pekerjaan Lainnya"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    value={inputLainnya.ayah}
                                    onChange={(e) => setInputLainnya.ayah(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* tetap daftarkan register hanya sekali */}
                        <input type="hidden" {...register("modalPeserta.pekerjaan_ayah", { required: true })} />
                    </div>
                </div>

                {/* Penghasilan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4">
                    <label htmlFor="penghasilan_ayah" className="md:w-1/4 text-black">Penghasilan *</label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="penghasilan_ayah"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.penghasilan_ayah", { required: true })}
                                required
                            >
                                <option value="">-- Pilih Penghasilan --</option>
                                <option value="< Rp 500.000">&lt; Rp 500.000</option>
                                <option value="Rp 500.000 - Rp 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                                <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                                <option value="Rp 2.000.000 - Rp 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                                <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                                <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
                                <option value="Tidak Menentu">Tidak Menentu</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="wafat_ayah" className="md:w-1/4 text-black">
                        Wafat *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="wafat_ayah" value="0" className="w-4 h-4" {...register("modalPeserta.wafat_ayah", { required: true })}
                            required />
                        <span>Tidak</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="wafat_ayah" value="1" className="w-4 h-4" {...register("modalPeserta.wafat_ayah", { required: true })}
                            required />
                        <span>Ya</span>
                    </label>
                </div>

                <hr className="border-t border-gray-500 mb-2 mt-8" />
                <p className="font-bold text-xl">Data Ibu</p>
                <hr className="border-t border-gray-500 mb-4 mt-2" />
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nik_ibu" className="md:w-1/4 text-black">
                        NIK Ibu *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nik_ibu"
                                name="nik_ibu"
                                type="text"
                                minLength={16}
                                maxLength={16}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
                                }}
                                placeholder="Masukkan NIK Ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.nik_ibu", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nama_ibu" className="md:w-1/4 text-black">
                        Nama Ibu *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nama_ibu"
                                name="nama_ibu"
                                type="text"
                                placeholder="Masukkan Nama Ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.nama_ibu", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tempat_lahir_ibu" className="md:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="tempat_lahir_ibu"
                                name="tempat_lahir_ibu"
                                type="text"
                                placeholder="Masukkan Tempat Lahir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.tempat_lahir_ibu", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_lahir_ibu" className="md:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_lahir_ibu"
                                name="tanggal_lahir_ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.tanggal_lahir_ibu", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="no_telepon_ibu" className="md:w-1/4 text-black">
                        Nomor Telepon Ibu *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="no_telepon_ibu"
                                name="no_telepon_ibu"
                                type="text"
                                maxLength={14}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                placeholder="08"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.no_telepon_ibu", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pendidikan_terakhir_ibu" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="pendidikan_terakhir_ibu"
                                name="pendidikan_terakhir_ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.pendidikan_terakhir_ibu", { required: true })}
                                required
                            >
                                <option value="">
                                    Pilih
                                </option>
                                <option value="paud">Paud</option>
                                <option value="sd/mi">SD/MI</option>
                                <option value="smp/mts">SMP/MTS</option>
                                <option value="sma/smk/ma">SMA/SMK/MA</option>
                                <option value="d3">D3</option>
                                <option value="d4">D4</option>
                                <option value="s1">S1</option>
                                <option value="s2">S2</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pekerjaan_ibu" className="md:w-1/4 text-black">
                        Pekerjaan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="pekerjaan_ibu"
                                name="pekerjaan_ibu"
                                type="text"
                                placeholder="Masukkan Pekerjaan Ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.pekerjaan_ibu", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="penghasilan_ibu" className="md:w-1/4 text-black">
                        Penghasilan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="penghasilan_ibu"
                                name="penghasilan_ibu"
                                type="number"
                                placeholder="1.000.000"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.penghasilan_ibu", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div> */}

                {/* Pekerjaan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pekerjaan_ibu" className="md:w-1/4 text-black">Pekerjaan *</label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="pekerjaan_ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                value={dropdownValue.ibu}
                                onChange={(e) => setDropdownValue.ibu(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Pekerjaan --</option>
                                <option value="Tidak Bekerja">Tidak Bekerja</option>
                                <option value="Petani">Petani</option>
                                <option value="Buruh">Buruh</option>
                                <option value="Pedagang">Pedagang</option>
                                <option value="PNS">PNS</option>
                                <option value="TNI/Polri">TNI/Polri</option>
                                <option value="Karyawan Swasta">Karyawan Swasta</option>
                                <option value="Wiraswasta">Wiraswasta</option>
                                <option value="Guru">Guru</option>
                                <option value="Dosen">Dosen</option>
                                <option value="Dokter">Dokter</option>
                                <option value="Perawat">Perawat</option>
                                <option value="Pengemudi">Pengemudi</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        {isLainnyaIbu && (
                            <div className="mt-1 flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                <input
                                    type="text"
                                    placeholder="Masukkan Pekerjaan Lainnya"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    value={inputLainnya.ibu}
                                    onChange={(e) => setInputLainnya.ibu(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* tetap daftarkan register hanya sekali */}
                        <input type="hidden" {...register("modalPeserta.pekerjaan_ibu", { required: true })} />
                    </div>
                </div>

                {/* Penghasilan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4">
                    <label htmlFor="penghasilan_ibu" className="md:w-1/4 text-black">Penghasilan *</label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="penghasilan_ibu"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.penghasilan_ibu", { required: true })}
                                required
                            >
                                <option value="">-- Pilih Penghasilan --</option>
                                <option value="< Rp 500.000">&lt; Rp 500.000</option>
                                <option value="Rp 500.000 - Rp 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                                <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                                <option value="Rp 2.000.000 - Rp 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                                <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                                <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
                                <option value="Tidak Menentu">Tidak Menentu</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="wafat_ibu" className="md:w-1/4 text-black">
                        Wafat *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="wafat_ibu" value="0" className="w-4 h-4" {...register("modalPeserta.wafat_ibu", { required: true })}
                            required />
                        <span>Tidak</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="wafat_ibu" value="1" className="w-4 h-4" {...register("modalPeserta.wafat_ibu", { required: true })}
                            required />
                        <span>Ya</span>
                    </label>
                </div>


                <hr className="border-t border-gray-500 mb-2 mt-8" />
                <p className="font-bold text-xl">Data Wali</p>
                <hr className="border-t border-gray-500 mb-4 mt-2" />
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nik_wali" className="md:w-1/4 text-black">
                        NIK Wali *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nik_wali"
                                name="nik_wali"
                                type="text"
                                minLength={16}
                                maxLength={16}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
                                }}
                                placeholder="Masukkan NIK Wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.nik_wali", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nama_wali" className="md:w-1/4 text-black">
                        Nama Wali *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nama_wali"
                                name="nama_wali"
                                type="text"
                                placeholder="Masukkan Nama Wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.nama_wali", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tempat_lahir_wali" className="md:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="tempat_lahir_wali"
                                name="tempat_lahir_wali"
                                type="text"
                                placeholder="Masukkan Tempat Lahir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.tempat_lahir_wali", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_lahir_wali" className="md:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_lahir_wali"
                                name="tanggal_lahir_wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.tanggal_lahir_wali", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="no_telepon_wali" className="md:w-1/4 text-black">
                        Nomor Telepon Wali *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="no_telepon_wali"
                                name="no_telepon_wali"
                                type="text"
                                maxLength={14}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                placeholder="08"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.no_telepon_wali", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pendidikan_terakhir_wali" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="pendidikan_terakhir_wali"
                                name="pendidikan_terakhir_wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.pendidikan_terakhir_wali", { required: true })}
                                required
                            >
                                <option value="">
                                    Pilih
                                </option>
                                <option value="paud">Paud</option>
                                <option value="sd/mi">SD/MI</option>
                                <option value="smp/mts">SMP/MTS</option>
                                <option value="sma/smk/ma">SMA/SMK/MA</option>
                                <option value="d3">D3</option>
                                <option value="d4">D4</option>
                                <option value="s1">S1</option>
                                <option value="s2">S2</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pekerjaan_wali" className="md:w-1/4 text-black">
                        Pekerjaan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="pekerjaan_wali"
                                name="pekerjaan_wali"
                                type="text"
                                placeholder="Masukkan Pekerjaan Wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.pekerjaan_wali", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="penghasilan_wali" className="md:w-1/4 text-black">
                        Penghasilan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="penghasilan_wali"
                                name="penghasilan_wali"
                                type="number"
                                placeholder="1.000.000"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.penghasilan_wali", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div> */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="pekerjaan_wali" className="md:w-1/4 text-black">Pekerjaan *</label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="pekerjaan_wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                value={dropdownValue.wali}
                                onChange={(e) => setDropdownValue.wali(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Pekerjaan --</option>
                                <option value="Tidak Bekerja">Tidak Bekerja</option>
                                <option value="Petani">Petani</option>
                                <option value="Buruh">Buruh</option>
                                <option value="Pedagang">Pedagang</option>
                                <option value="PNS">PNS</option>
                                <option value="TNI/Polri">TNI/Polri</option>
                                <option value="Karyawan Swasta">Karyawan Swasta</option>
                                <option value="Wiraswasta">Wiraswasta</option>
                                <option value="Guru">Guru</option>
                                <option value="Dosen">Dosen</option>
                                <option value="Dokter">Dokter</option>
                                <option value="Perawat">Perawat</option>
                                <option value="Pengemudi">Pengemudi</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        {isLainnyaWali && (
                            <div className="mt-1 flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                <input
                                    type="text"
                                    placeholder="Masukkan Pekerjaan Lainnya"
                                    className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    value={inputLainnya.wali}
                                    onChange={(e) => setInputLainnya.wali(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* tetap daftarkan register hanya sekali */}
                        <input type="hidden" {...register("modalPeserta.pekerjaan_wali", { required: true })} />
                    </div>
                </div>

                {/* Penghasilan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4">
                    <label htmlFor="penghasilan_wali" className="md:w-1/4 text-black">Penghasilan *</label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="penghasilan_wali"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.penghasilan_wali", { required: true })}
                                required
                            >
                                <option value="">-- Pilih Penghasilan --</option>
                                <option value="< Rp 500.000">&lt; Rp 500.000</option>
                                <option value="Rp 500.000 - Rp 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                                <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                                <option value="Rp 2.000.000 - Rp 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                                <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                                <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
                                <option value="Tidak Menentu">Tidak Menentu</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default FormKeluarga;
