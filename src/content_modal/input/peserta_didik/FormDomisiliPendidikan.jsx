import { Controller } from "react-hook-form";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import DropdownWilayah from "../../../hooks/hook_dropdown/DropdownWilayah";
import { useEffect } from "react";

const FormDomisiliPendidikan = ({ register, control, watch, activeTab }) => {
    const lembaga = watch("modalPeserta.lembaga");
    const jurusan = watch("modalPeserta.jurusan");
    const kelas = watch("modalPeserta.kelas");
    const rombel = watch("modalPeserta.rombel");
    const wilayah = watch("modalPeserta.wilayah");
    const blok = watch("modalPeserta.blok");
    const kamar = watch("modalPeserta.kamar");
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();

    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, filterLembaga.lembaga, filterLembaga.lembaga.length, filterWilayah.wilayah, filterWilayah, filterWilayah.wilayah.length]);

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
                                        name={`modalPeserta.${label}`}
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
                {/* Nama Lengkap */}
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
                                placeholder="Masukkan No. Induk"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                 {...register('modalPeserta.no_induk', { required: true })}
                                 required
                            />
                        </div>
                    </div>
                </div>

                <Filters filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} control={control} />
                
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_masuk_pendidikan" className="md:w-1/4 text-black">
                        Tanggal Masuk Pendidikan *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_masuk_pendidikan"
                                name="tanggal_masuk_pendidikan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.tanggal_masuk_pendidikan", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <Filters filterOptions={filterWilayah} onChange={handleFilterChangeWilayah} selectedFilters={selectedWilayah} control={control} />

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_masuk_domisili" className="md:w-1/4 text-black">
                        Tanggal Masuk Domisili *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                            <input
                                type="date"
                                id="tanggal_masuk_domisili"
                                name="tanggal_masuk_domisili"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalPeserta.tanggal_masuk_domisili", { required: true })}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
    </>
)
};

export default FormDomisiliPendidikan;
