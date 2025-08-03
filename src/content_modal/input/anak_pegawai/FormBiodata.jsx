import { useEffect } from "react";
import DropdownNegara from "../../../hooks/hook_dropdown/DropdownNegara";
import { Controller } from "react-hook-form";

const FormBiodataAnakPegawai = ({ register, watch, setValue, control, activeTab, selectedTinggal, setSelectedTinggal, setLainnyaValue, isLainnya }) => {

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();

    const kewarganegaraan = watch("modalAnakPegawai.kewarganegaraan");
    const negara = watch("modalAnakPegawai.negara_id");
    const provinsi = watch("modalAnakPegawai.provinsi_id");
    const kabupaten = watch("modalAnakPegawai.kabupaten_id");
    const kecamatan = watch("modalAnakPegawai.kecamatan_id");

    const handleKewarganegaraanChange = (e) => {
        const value = e.target.value;
        setValue('modalAnakPegawai.kewarganegaraan', value);

        if (value === 'wna') {
            setValue('modalAnakPegawai.no_kk', '');
            setValue('modalAnakPegawai.nik', '');
        } else if (value === 'wni') {
            setValue('modalAnakPegawai.no_passport', '');
        }
    };

    useEffect(() => {
        // Saat field sudah terisi (dari register atau data yang diedit), panggil handler
        if (activeTab !== 0) return;
        console.log("handle");

        if (negara) {
            console.log("negara handle ", negara);
            handleFilterChangeNegara({ negara: negara });
        }
        if (provinsi) {
            console.log("provinsi handle ", provinsi);
            handleFilterChangeNegara({ provinsi: provinsi });
        }
        if (kabupaten) {
            console.log("kabupaten handle ", kabupaten);
            handleFilterChangeNegara({ kabupaten: kabupaten });
        }
        if (kecamatan) {
            console.log("kecamatan handle ", kecamatan);
            handleFilterChangeNegara({ kecamatan: kecamatan });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    // const updatedFilterNegara = {
    //     negara: updateFirstOptionLabel(filterNegara.negara, "Pilih Negara"),
    //     provinsi: updateFirstOptionLabel(filterNegara.provinsi, "Pilih Provinsi"),
    //     kabupaten: updateFirstOptionLabel(filterNegara.kabupaten, "Pilih Kabupaten"),
    //     kecamatan: updateFirstOptionLabel(filterNegara.kecamatan, "Pilih Kecamatan")
    // };

    const getFilteredNegara = () => {
        const negaraList = filterNegara.negara || [];

        // Pisahkan default option (biasanya value === "")
        const defaultOption = { value: "", label: "Pilih Negara" };

        let filtered = [];

        if (kewarganegaraan === "wna") {
            filtered = negaraList.filter(n =>
                n.value !== "" && n.label.toLowerCase() !== "indonesia"
            );
        } else if (kewarganegaraan === "wni") {
            filtered = negaraList.filter(n =>
                n.value !== "" && n.label.toLowerCase() === "indonesia"
            );
        } else {
            filtered = negaraList.filter(n => n.value !== "");
        }

        return [defaultOption, ...filtered];
    };

    const updatedFilterNegara = {
        negara: updateFirstOptionLabel(getFilteredNegara(), "Pilih Negara"),
        provinsi: updateFirstOptionLabel(filterNegara.provinsi, "Pilih Provinsi"),
        kabupaten: updateFirstOptionLabel(filterNegara.kabupaten, "Pilih Kabupaten"),
        kecamatan: updateFirstOptionLabel(filterNegara.kecamatan, "Pilih Kecamatan")
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const Filters = ({ filterOptions, control, onChange, selectedFilters }) => {
        return (
            <div className="space-y-2">
                {Object.entries(filterOptions).map(([label, options], index) => (
                    <div
                        key={`${label}-${index}`}
                        className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4"
                    >
                        <label htmlFor={label} className="md:w-1/4 text-black">
                            {capitalize(label)} *
                        </label>
                        <div className="md:w-full md:max-w-md max-w-none">
                            <div
                                className={`flex items-center rounded-md shadow-md border border-gray-300 border-gray-500 ${options.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                    }`}
                            >
                                <Controller
                                    name={`modalAnakPegawai.${label}_id`}
                                    control={control}
                                    rules={{ required: true }}
                                    defaultValue={selectedFilters[label] || ""}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id={label}
                                            required
                                            disabled={options.length <= 1}
                                            className={`w-full py-1.5 pr-3 pl-1 text-base focus:outline-none sm:text-sm ${options.length <= 1 ? "text-gray-500" : ""
                                                }`}
                                            onChange={(e) => {
                                                field.onChange(e);   // update react-hook-form state
                                                onChange({ [label]: e.target.value }); // update dependent dropdowns
                                            }}
                                        >
                                            {options.map((option, idx) => (
                                                <option key={idx} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="kewarganegaraan" className="md:w-1/4 text-black">
                        Kewarganegaraan *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="kewarganegaraan" value="wni" className="w-4 h-4" {...register("modalAnakPegawai.kewarganegaraan", { required: true })} checked={kewarganegaraan === 'wni'} onChange={handleKewarganegaraanChange} required />
                        <span>WNI</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="kewarganegaraan" value="wna" className="w-4 h-4" {...register("modalAnakPegawai.kewarganegaraan", { required: true })} checked={kewarganegaraan === 'wna'} onChange={handleKewarganegaraanChange} required />
                        <span>WNA</span>
                    </label>
                </div>
                {/* No Passport */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="passport" className="md:w-1/4 text-black">
                        No Passport *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className={`flex items-center rounded-md shadow-md pl-1 border border-gray-500 ${kewarganegaraan === 'wna' ? 'bg-white border-gray-300 ' : 'bg-gray-300 border-gray-200'}`}>
                            <input
                                id="passport"
                                name="passport"
                                type="text"
                                maxLength={20}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                disabled={kewarganegaraan !== 'wna'}
                                placeholder="Masukkan No Passport"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalAnakPegawai.passport', { required: kewarganegaraan === "wna" ? true : false })}
                                required={kewarganegaraan === 'wna'}
                            />
                            {/* {errors.nama && <span>Nama wajib diisi</span>} */}
                        </div>
                    </div>
                </div>

                {/* Nomor KK */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nokk" className="md:w-1/4 text-black">
                        Nomor KK *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className={`flex items-center rounded-md shadow-md pl-1 border border-gray-500 ${kewarganegaraan === 'wni' ? 'bg-white border-gray-300 ' : 'bg-gray-300 border-gray-200'}`}>
                            <input
                                id="no_kk"
                                name="no_kk"
                                type="text"
                                minLength={16}
                                maxLength={16}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                disabled={kewarganegaraan !== 'wni'}
                                placeholder="Masukkan No KK"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalAnakPegawai.no_kk', { required: kewarganegaraan === "wni" ? true : false })}
                                required={kewarganegaraan === 'wni'}
                            />
                        </div>
                    </div>
                </div>

                {/* NIK */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 ">
                    <label htmlFor="nonik" className="md:w-1/4 text-black">
                        NIK *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className={`flex items-center rounded-md shadow-md pl-1 border border-gray-500 ${kewarganegaraan === 'wni' ? 'bg-white border-gray-300 ' : 'bg-gray-300 border-gray-200'}`}>
                            <input
                                id="nik"
                                name="nik"
                                type="text"
                                minLength={16}
                                maxLength={16}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
                                }}
                                disabled={kewarganegaraan !== 'wni'}
                                placeholder="Masukkan NIK"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalAnakPegawai.nik', { required: kewarganegaraan === "wni" ? true : false })}
                                required={kewarganegaraan === 'wni'}
                            />
                        </div>
                    </div>
                </div>


                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nama" className="md:w-1/4 text-black">
                        Nama Lengkap *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nama"
                                name="nama"
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalAnakPegawai.nama', { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jenisKelamin" className="md:w-1/4 text-black">
                        Jenis Kelamin *
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="jenisKelamin" value="p" className="w-4 h-4" {...register('modalAnakPegawai.jenis_kelamin', { required: true })} required />
                        <span>Perempuan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="jenisKelamin" value="l" className="w-4 h-4" {...register('modalAnakPegawai.jenis_kelamin', { required: true })} required />
                        <span>Laki-Laki</span>
                    </label>
                </div>

                {/* Tempat Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tempatLahir" className="md:w-1/4 text-black">
                        Tempat Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="tempatLahir"
                                name="tempatLahir"
                                type="text"
                                placeholder="Masukkan Tempat Lahir"
                                {...register('modalAnakPegawai.tempat_lahir', { required: true })}
                                required
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_lahir" className="md:w-1/4 text-black">
                        Tanggal Lahir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_lahir"
                                name="tanggal_lahir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.tanggal_lahir", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Anak Ke */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="anak_keberapa" className="md:w-1/4 text-black">
                        Anak Ke
                    </label>
                    <div className="flex space-x-4">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="anak_keberapa"
                                name="anak_keberapa"
                                type="number"
                                min="1"
                                className="w-13 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.anak_keberapa")}
                            />
                        </div>
                        <span>Dari</span>
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="dari_saudara"
                                name="dari_saudara"
                                type="number"
                                min="1"
                                className="w-13 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.dari_saudara")}
                            />
                        </div>
                    </div>
                </div>
                <hr className="border-t border-gray-300 my-4" />

                {/* Tinggal Bersama */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tinggal_bersama" className="md:w-1/4 text-black">
                        Tinggal Bersama
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <select
                            className="w-full py-1.5 px-2 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md shadow-sm"
                            value={selectedTinggal}
                            onChange={(e) => setSelectedTinggal(e.target.value)}
                        >
                            <option value="">-- Pilih Tinggal Bersama --</option>
                            <option value="Bersama orang tua">Bersama orang tua</option>
                            <option value="Bersama kerabat">Bersama kerabat</option>
                            <option value="Bersama wali">Bersama wali</option>
                            <option value="Kos/kontrakan">Kos/kontrakan</option>
                            <option value="Panti Asuhan">Panti Asuhan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>

                        {isLainnya && (
                            <input
                                type="text"
                                placeholder="Tinggal bersama siapa?"
                                className="w-full mt-2 py-1.5 px-2 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md shadow-sm"
                                onChange={(e) => setLainnyaValue(e.target.value)}
                            />
                        )}

                        {/* Hidden input terdaftar ke register */}
                        <input
                            type="hidden"
                            {...register("modalAnakPegawai.tinggal_bersama")}
                        />
                    </div>
                </div>


                {/* Jenjang Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jenjang_pendidikan_terakhir" className="md:w-1/4 text-black">
                        Jenjang Pendidikan Terakhir *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <select
                                id="jenjang_pendidikan_terakhir"
                                name="jenjang_pendidikan_terakhir"
                                {...register("modalAnakPegawai.jenjang_pendidikan_terakhir")}
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
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


                {/* Pendidikan Terakhir */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nama_pendidikan_terakhir" className="md:w-1/4 text-black">
                        Nama Pendidikan Terakhir
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="nama_pendidikan_terakhir"
                                name="nama_pendidikan_terakhir"
                                type="text"
                                placeholder="Masukkan Nama Pendidikan Terakhir"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.nama_pendidikan_terakhir")}
                            />
                        </div>
                    </div>
                </div>

                {/* Nomor Telepon 1 */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="no_telepon" className="md:w-1/4 text-black">
                        Nomor Telepon 1
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="no_telepon"
                                name="no_telepon"
                                type="tel"
                                maxLength={20}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                placeholder="08"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.no_telepon", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Nomor Telepon 2 */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="no_telepon_2" className="md:w-1/4 text-black">
                        Nomor Telepon 2
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="no_telepon_2"
                                name="no_telepon_2"
                                type="tel"
                                maxLength={20}
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                placeholder="08"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.no_telepon_2")}
                            />
                        </div>
                    </div>
                </div>

                {/* E-Mail */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="email" className="md:w-1/4 text-black">
                        E-Mail
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                maxLength={100}
                                placeholder="Masukkan E-Mail"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.email")}
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-t border-gray-300 my-4" />

                <Filters filterOptions={updatedFilterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} control={control} />

                <hr className="border-t border-gray-300 my-4" />

                {/* Jalan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="jalan" className="md:w-1/4 text-black">
                        Jalan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="jalan"
                                name="jalan"
                                type="text"
                                maxLength={255}
                                placeholder="Masukkan Nama Jalan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.jalan", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Kode Pos */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="kodepos" className="md:w-1/4 text-black">
                        Kode Pos
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="kodepos"
                                name="kodepos"
                                type="text"
                                maxLength={10} // misalnya 5 digit kode pos
                                pattern="\d*"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                inputMode="numeric"
                                placeholder="Masukkan Kode Pos"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.kode_pos")}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="smartcard" className="md:w-1/4 text-black">
                        SmartCard
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                id="smartcard"
                                name="smartcard"
                                type="text"
                                maxLength={255}
                                // placeholder="Masukkan Nama Jalan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalAnakPegawai.smartcard")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default FormBiodataAnakPegawai;
