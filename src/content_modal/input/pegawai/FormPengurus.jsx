import { useEffect } from "react";
import useDropdownGolonganJabatan from "../../../hooks/hook_dropdown/DropdownGolonganJabatan";
import useDropdownSatuanKerja from "../../../hooks/hook_dropdown/DropdownSatuanKerja";

const FormPengurus = ({ register, watch, setValue, activeTab }) => {
    const golonganJabatan = watch("modalPegawai.golongan_jabatan_id_pengurus");
    const satuanKerja = watch("modalPegawai.satuan_kerja_pengurus");
    const { menuGolonganJabatan } = useDropdownGolonganJabatan();
    const { menuSatuanKerja } = useDropdownSatuanKerja();

    useEffect(() => {
        if (golonganJabatan && golonganJabatan !== "") {
            setValue("modalPegawai.pengurus", "1");
        } else {
            setValue("modalPegawai.pengurus", "0");
        }
    }, [golonganJabatan, setValue]);

    useEffect(() => {
        // Saat field sudah terisi (dari register atau data yang diedit), panggil handler
        console.log("handle", activeTab);
        if (activeTab !== 3) return;
        console.log("handle change", activeTab);

        if (golonganJabatan && menuGolonganJabatan.length >= 1) {
            // console.log("golongan jabatan handle", golonganJabatan);
            
            setValue('modalPegawai.golongan_jabatan_id_pengurus', golonganJabatan);
        }
        if (satuanKerja && menuSatuanKerja.length >= 1) {
            // console.log("golongan jabatan handle", golonganJabatan);
            
            setValue('modalPegawai.satuan_kerja_pengurus', satuanKerja);
        }
    }, [activeTab, golonganJabatan, menuGolonganJabatan.length, menuSatuanKerja.length, satuanKerja, setValue]);

    return (
        <div className="space-y-2">
            <h1 className="text-red-500 italic font-semibold">* Silahkan isi form ini jika seorang Pengurus</h1>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4">
                <label htmlFor="golongan_jabatan_id_pengurus" className="md:w-1/4 text-black">
                    Golongan Jabatan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className={`flex items-center rounded-md shadow-md pl-1 border border-gray-300 border-gray-500  ${menuGolonganJabatan?.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}>

                        <select
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            disabled={menuGolonganJabatan?.length <= 1}
                            {...register('modalPegawai.golongan_jabatan_id_pengurus')}
                        >
                            {menuGolonganJabatan?.map((option, idx) => (
                                <option key={idx} value={option.id}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Jabatan pengurus (nullable|string|max:100) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="jabatan_pengurus" className="md:w-1/4 text-black">
                    Jabatan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="text"
                            placeholder="Masukkan Jabatan pengurus"
                            {...register("modalPegawai.jabatan_pengurus")}
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            maxLength={100}
                        />
                    </div>
                </div>
            </div>

            {/* Keterangan Jabatan pengurus (nullable|string|max:255) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="keterangan_jabatan_pengurus" className="md:w-1/4 text-black">
                    Keterangan Jabatan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <textarea
                            placeholder="Masukkan Keterangan Jabatan"
                            {...register("modalPegawai.keterangan_jabatan_pengurus")}
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            rows={3}
                            maxLength={255}
                        />
                    </div>
                </div>
            </div>

            {/* satuan kerja (nullable) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="satuan_kerja_pengurus" className="md:w-1/4 text-black">
                    Satuan Kerja
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <select
                            className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm ${menuSatuanKerja?.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                            disabled={menuSatuanKerja?.length <= 1}
                            {...register('modalPegawai.satuan_kerja_pengurus')}
                        >
                            {menuSatuanKerja.map((option, idx) => (
                                <option key={idx} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tanggal Mulai pengurus (nullable|date) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="tanggal_mulai_pengurus" className="md:w-1/4 text-black">
                    Tanggal Mulai
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="date"
                            id="tanggal_mulai_pengurus"
                            name="tanggal_mulai_pengurus"
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            {...register("modalPegawai.tanggal_mulai_pengurus")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPengurus;