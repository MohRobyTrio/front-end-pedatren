import { Controller } from "react-hook-form";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import DropdownWilayah from "../../../hooks/hook_dropdown/DropdownWilayah";
import { useEffect } from "react";
import DropdownAngkatan from "../../../hooks/hook_dropdown/DropdownAngkatan";

const FormDomisiliPendidikan = ({ register, control, watch, activeTab, setValue }) => {
    const lembaga = watch("modalPeserta.lembaga_id");
    const jurusan = watch("modalPeserta.jurusan_id");
    const kelas = watch("modalPeserta.kelas_id");
    const rombel = watch("modalPeserta.rombel_id");
    const wilayah = watch("modalPeserta.wilayah_id");
    const blok = watch("modalPeserta.blok_id");
    const kamar = watch("modalPeserta.kamar_id");
    const mondok = watch("modalPeserta.mondok");
    const lembagaId = watch("modalPeserta.lembaga_id");
    const angkatanSantri = watch("modalPeserta.angkatan_santri_id");
    const angkatanPelajar = watch("modalPeserta.angkatan_pelajar_id");
    const isDomisiliDisabled = mondok == "0" || mondok == null;
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();
    const { menuAngkatanPelajar, menuAngkatanSantri } = DropdownAngkatan();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah({ withSisa: true });

    useEffect(() => {
        if (isDomisiliDisabled) {
            setValue("modalPeserta.wilayah_id", "");
            setValue("modalPeserta.blok_id", "");
            setValue("modalPeserta.kamar_id", "");
            setValue("modalPeserta.tanggal_masuk_domisili", "");
            setValue("modalPeserta.nis", "");
            setValue("modalPeserta.angkatan_santri_id", "");
        }
    }, [isDomisiliDisabled, mondok, setValue]);

    useEffect(() => {
        if (!lembagaId) {
            setValue("modalPeserta.angkatan_pelajar_id", "");
            setValue("modalPeserta.tanggal_masuk_pendidikan", "")
        }
    }, [lembagaId, setValue]);

    useEffect(() => {
        if (activeTab !== 2) return;
        
        if (lembaga && filterLembaga.lembaga.length >= 1) {
            handleFilterChangeLembaga({ lembaga: lembaga });
        }
        if (jurusan && filterLembaga.jurusan.length >= 1) {
            handleFilterChangeLembaga({ jurusan: jurusan });
        }
        if (kelas && filterLembaga.kelas.length >= 1) {
            handleFilterChangeLembaga({ kelas: kelas });
        }
        if (rombel && filterLembaga.rombel.length >= 1) {
            handleFilterChangeLembaga({ rombel: rombel });
        }
        if (wilayah && filterWilayah.wilayah.length >= 1) {
            handleFilterChangeWilayah({ wilayah: wilayah });
        }
        if (blok && filterWilayah.blok.length >= 1) {
            handleFilterChangeWilayah({ blok: blok });
        }
        if (kamar && filterWilayah.kamar.length >= 1) {
            handleFilterChangeWilayah({ kamar: kamar });
        }
        const defaultSantri = menuAngkatanSantri.find(a => a.value !== ""); // pilih yang pertama
        const defaultPelajar = menuAngkatanPelajar.find(a => a.value !== ""); // pilih yang pertama
        if (defaultSantri && angkatanSantri != "") {
            setValue("modalPeserta.angkatan_santri_id", defaultSantri.value);
        }
        if (defaultPelajar && angkatanPelajar != "") {
            setValue("modalPeserta.angkatan_pelajar_id", defaultPelajar.value);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, filterLembaga.lembaga, filterLembaga.lembaga.length, filterWilayah.wilayah, filterWilayah, filterWilayah.wilayah.length, menuAngkatanSantri]);

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const Filters = ({ filterOptions, control, onChange, selectedFilters, disabled = false }) => {
        const wilayah = watch("modalPeserta.wilayah_id");
            return (
                <div className="space-y-2">
                    {Object.entries(filterOptions).map(([label, options], index) => {
                        const isBlokOrKamar = label === "blok" || label === "kamar";
                        const isDisabled = options.length <= 1 || disabled || (isBlokOrKamar && !wilayah);

                        return (
                        <div
                            key={`${label}-${index}`}
                            className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4"
                        >
                            <label htmlFor={label} className="md:w-1/4 text-black">
                                {capitalize(label)} *
                            </label>
                            <div className="md:w-full md:max-w-md max-w-none">
                                <div
                                    className={`flex items-center rounded-md shadow-md border border-gray-300 border-gray-500 ${isDisabled ? "bg-gray-200 text-gray-500" : ""
                                        }`}
                                >
                                    <Controller
                                        name={`modalPeserta.${label}_id`}
                                        control={control}
                                        defaultValue={selectedFilters[label] || ""}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                id={label}
                                                disabled={isDisabled}
                                                className={`w-full py-1.5 pr-3 pl-1 text-base focus:outline-none sm:text-sm ${isDisabled ? "text-gray-500" : ""
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
                        )
    })}
                </div>
            );
        };

    return (
    <>
        <div className="space-y-2">
                <p className="font-bold text-xl">Mondok </p>
                <hr className="border-t border-gray-500 mb-4 mt-2" />
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="mondok" className="md:w-1/4 text-black">
                        Mondok
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="mondok" value="1" className="w-4 h-4" {...register("modalPeserta.mondok", { required: true })}
                                required />
                        <span>Ya</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="mondok" value="0" className="w-4 h-4" {...register("modalPeserta.mondok", { required: true })}
                                required />
                        <span>Tidak</span>
                    </label>
                </div>
                {/* Nama Lengkap */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="nis" className="md:w-1/4 text-black">
                        NIS 
                    </label>
                    <div className={`md:w-full md:max-w-md max-w-none ${isDomisiliDisabled ? "bg-gray-200 text-gray-500" : ""}`}>
                        <div className="flex items-center rounded-md shadow-md bg-white border border-gray-300 border-gray-500">
                            <input
                                id="nis"
                                name="nis"
                                type="text"
                                inputMode="numeric"
                                disabled={isDomisiliDisabled}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 15);
                                }}
                                maxLength={15}
                                placeholder="Masukkan NIS"
                                className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm ${isDomisiliDisabled ? "bg-gray-200 text-gray-500" : ""}`}
                                 {...register('modalPeserta.nis')}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="angkatan_santri_id" className="md:w-1/4 text-black">
                        Angkatan Santri *
                    </label>
                    <div className={`md:w-full md:max-w-md max-w-none ${isDomisiliDisabled ? "bg-gray-200 text-gray-500" : ""}`}>
                        <div className="flex items-center rounded-md shadow-md bg-white border border-gray-300 border-gray-500">
                            <select
                                id="angkatan_santri_id"
                                name="angkatan_santri_id"
                                disabled={isDomisiliDisabled}
                                {...register("modalPeserta.angkatan_santri_id")}
                                className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm ${isDomisiliDisabled ? "bg-gray-200 text-gray-500" : ""}`}
                            >
                                {menuAngkatanSantri.map((santri, idx) => (
                                    <option key={idx} value={santri.value}>
                                        {santri.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-gray-500 mb-2 mt-8" />
                <p className="font-bold text-xl">Domisili</p>
                <hr className="border-t border-gray-500 mt-2" />
                <p className="text-sm text-red-500 italic mt-1 mb-4">* Bagian domisili ini boleh dikosongi</p>
                <Filters filterOptions={filterWilayah} onChange={handleFilterChangeWilayah} selectedFilters={selectedWilayah} control={control} disabled={isDomisiliDisabled} />

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_masuk_domisili" className="md:w-1/4 text-black">
                        Tanggal Masuk Domisili *
                    </label>
                    <div className={`md:w-full md:max-w-md max-w-none ${isDomisiliDisabled ? "bg-gray-200 text-gray-500" : ""}`}>
                        <div className="flex items-center rounded-md shadow-md bg-white border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_masuk_domisili"
                                name="tanggal_masuk_domisili"
                                disabled={isDomisiliDisabled}
                                className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm ${isDomisiliDisabled ? "bg-gray-200 text-gray-500" : ""}`}
                                {...register("modalPeserta.tanggal_masuk_domisili")}
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-t border-gray-500 mb-2 mt-8" />
                <p className="font-bold text-xl">Pendidikan</p>
                <hr className="border-t border-gray-500 mt-2" />
                <p className="text-sm text-red-500 italic mt-1 mb-4">* Bagian Pendidikan ini boleh dikosongi</p>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="no_induk" className="md:w-1/4 text-black">
                        No. Induk *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 border-gray-500">
                            <input
                                id="no_induk"
                                name="no_induk"
                                type="text"
                                inputMode="numeric"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                                placeholder="Masukkan No. Induk"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                 {...register('modalPeserta.no_induk')}
                            />
                        </div>
                    </div>
                </div>

                <Filters filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} control={control} />

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="angkatan_pelajar_id" className="md:w-1/4 text-black">
                        Angkatan Pelajar *
                    </label>
                    <div className={`md:w-full md:max-w-md max-w-none ${!lembagaId ? "bg-gray-200 text-gray-500" : ""}`}>
                        <div className="flex items-center rounded-md shadow-md bg-white border border-gray-300 border-gray-500">
                            <select
                                id="angkatan_pelajar_id"
                                name="angkatan_pelajar_id"
                                disabled={!lembagaId}
                                {...register("modalPeserta.angkatan_pelajar_id")}
                                className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm ${!lembagaId ? "bg-gray-200 text-gray-500" : ""}`}
                            >
                                {menuAngkatanPelajar.map((pelajar, idx) => (
                                    <option key={idx} value={pelajar.value}>
                                        {pelajar.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_masuk_pendidikan" className="md:w-1/4 text-black">
                        Tanggal Masuk Pendidikan *
                    </label>
                    <div className={`md:w-full md:max-w-md max-w-none ${!lembagaId ? "bg-gray-200 text-gray-500" : ""}`}>
                        <div className="flex items-center rounded-md shadow-md bg-white border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_masuk_pendidikan"
                                disabled={!lembagaId}
                                name="tanggal_masuk_pendidikan"
                                className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm ${!lembagaId ? "bg-gray-200 text-gray-500" : ""}`}
                                {...register("modalPeserta.tanggal_masuk_pendidikan")}
                            />
                        </div>
                    </div>
                </div>

                
            </div>
    </>
)
};

export default FormDomisiliPendidikan;
