/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import { Controller } from "react-hook-form";

const FormWaliKelas = ({ register, watch, setValue, control, activeTab }) => {
    const lembaga = watch("modalPegawai.lembaga");
    const jurusan = watch("modalPegawai.jurusan");
    const kelas = watch("modalPegawai.kelas");
    const rombel = watch("modalPegawai.rombel");
    const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();

    // useEffect(() => {
    //     if (lembaga && lembaga !== "") {
    //         setValue("modalPegawai.karyawan", "1");
    //     } else {
    //         setValue("modalPegawai.karyawan", "0");
    //     }
    // }, [lembaga, setValue]);

    useEffect(() => {
        const isWaliKelasDiisi =
            (lembaga && lembaga !== "") ||
            (jurusan && jurusan !== "") ||
            (kelas && kelas !== "") ||
            (rombel && rombel !== "") ||
            // (watch("modalPegawai.jumlah_murid_wali") && watch("modalPegawai.jumlah_murid_wali") !== "") ||
            (watch("modalPegawai.periode_awal_wali") && watch("modalPegawai.periode_awal_wali") !== "");

        if (isWaliKelasDiisi) {
            setValue("modalPegawai.wali_kelas", "1");
        } else {
            setValue("modalPegawai.wali_kelas", "0");
        }
    }, [
        lembaga,
        jurusan,
        kelas,
        rombel,
        // watch("modalPegawai.jumlah_murid_wali"),
        watch("modalPegawai.periode_awal_wali"),
        setValue
    ]);


    useEffect(() => {
        if (activeTab !== 4) return;

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
    }, [activeTab, filterLembaga.lembaga, filterLembaga.lembaga.length]);

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const Filters = ({ filterOptions, control, onChange, selectedFilters }) => {
        return (
            <div className="space-y-2 mt-4">
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
                                    name={`modalPegawai.${label}`}
                                    control={control}
                                    defaultValue={selectedFilters[label] || ""}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id={label}
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
        <div className="space-y-2">
            <h1 className="text-red-500 italic font-semibold">* Silahkan isi form ini jika seorang Wali Kelas</h1>
            <Filters filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} control={control} />

            {/* <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="jumlah_murid_wali" className="md:w-1/4 text-black">
                    Jumlah Murid Wali
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            id="jumlah_murid_wali"
                            name="jumlah_murid_wali"
                            type="text"
                            maxLength={20}
                            inputMode="numeric"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            }}
                            placeholder="Masukkan jumlah murid wali"
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            {...register("modalPegawai.jumlah_murid_wali")}
                        />
                    </div>
                </div>
            </div> */}

            {/* Tanggal Mulai Karyawan (nullable|date) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="tanggal_mulperiode_awal_waliai_karyawan" className="md:w-1/4 text-black">
                    Periode Awal
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="date"
                            id="periode_awal_wali"
                            name="periode_awal_wali"
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            {...register("modalPegawai.periode_awal_wali")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormWaliKelas;