import { useEffect } from "react";
import useDropdownGolonganJabatan from "../../../hooks/hook_dropdown/DropdownGolonganJabatan";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import { jenisJabatan } from "../../../data/menuData";

const FormKaryawan = ({ register, watch, setValue, activeTab }) => {
    const golonganJabatan = watch("modalPegawai.golongan_jabatan_id_karyawan");
    const lembaga = watch("modalPegawai.lembaga_id_karyawan");
    const jabatan = watch("modalPegawai.jabatan_karyawan");
    const keterangan = watch("modalPegawai.keterangan_jabatan_karyawan");
    const tglMulai = watch("modalPegawai.tanggal_mulai_karyawan");
    const { filterLembaga } = DropdownLembaga();
    const { menuGolonganJabatan } = useDropdownGolonganJabatan();


    useEffect(() => {
        console.log("cek:", { golonganJabatan, jabatan, keterangan, lembaga, tglMulai });

        const adaIsian = [
            golonganJabatan,
            lembaga,
            jabatan,
            keterangan,
            tglMulai,
        ].some(val => val && val !== "" && val !== "Pilih Golongan Jabatan");

        if (adaIsian) {
            setValue("modalPegawai.karyawan", "1");
        } else {
            setValue("modalPegawai.karyawan", "0");
        }
    }, [golonganJabatan, jabatan, keterangan, lembaga, setValue, tglMulai]);

    useEffect(() => {
        // Saat field sudah terisi (dari register atau data yang diedit), panggil handler
        // console.log("handle", activeTab);
        if (activeTab !== 1) return;
        // console.log("handle change", activeTab);

        if (lembaga && filterLembaga.lembaga.length >= 1) {
            setValue('modalPegawai.lembaga_id_karyawan', lembaga);
        }
        if (golonganJabatan && menuGolonganJabatan.length >= 1) {
            setValue('modalPegawai.golongan_jabatan_id_karyawan', golonganJabatan);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, filterLembaga.lembaga, menuGolonganJabatan]);

    return (
        <div className="space-y-2">
            <h1 className="text-red-500 italic font-semibold">* Silahkan isi form ini jika seorang karyawan</h1>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4">
                <label htmlFor="golongan_jabatan_id_karyawan" className="md:w-1/4 text-black">
                    Golongan Jabatan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className={`flex items-center rounded-md shadow-md pl-1 border border-gray-300 border-gray-500  ${menuGolonganJabatan?.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}>

                        <select
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            disabled={menuGolonganJabatan?.length <= 1}
                            {...register('modalPegawai.golongan_jabatan_id_karyawan')}
                        >
                            {menuGolonganJabatan?.map((option, idx) => (
                                <option key={idx} value={option.val}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lembaga (nullable) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="lembaga_id_karyawan" className="md:w-1/4 text-black">
                    Lembaga
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <select
                            {...register('modalPegawai.lembaga_id_karyawan')}
                            className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm ${filterLembaga?.lembaga?.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                            disabled={filterLembaga?.lembaga?.length <= 1}
                        >
                            {filterLembaga?.lembaga.map((option, idx) => (
                                <option key={idx} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Jabatan Karyawan (nullable|string|max:100) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="jabatan_karyawan" className="md:w-1/4 text-black">
                    Jabatan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <select
                            id="jabatan_karyawan"
                            {...register("modalPegawai.jabatan_karyawan")}
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm bg-transparent"
                        >
                            {jenisJabatan.map((item, idx) => (
                                <option key={idx} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Keterangan Jabatan Karyawan (nullable|string|max:255) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="keterangan_jabatan_karyawan" className="md:w-1/4 text-black">
                    Keterangan Jabatan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <textarea
                            placeholder="Masukkan Keterangan Jabatan"
                            {...register("modalPegawai.keterangan_jabatan_karyawan")}
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            rows={3}
                            maxLength={255}
                        />
                    </div>
                </div>
            </div>

            {/* Tanggal Mulai Karyawan (nullable|date) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="tanggal_mulai_karyawan" className="md:w-1/4 text-black">
                    Tanggal Mulai
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="date"
                            id="tanggal_mulai_karyawan"
                            name="tanggal_mulai_karyawan"
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            {...register("modalPegawai.tanggal_mulai_karyawan")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormKaryawan;