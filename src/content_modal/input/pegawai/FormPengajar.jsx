import { useEffect, useState } from "react";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import DropdownGolongan from "../../../hooks/hook_dropdown/DropdownGolongan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from "react-icons/fa";
import { jenisJabatan } from "../../../data/menuData";

const FormPengajar = ({ register, watch, setValue, activeTab }) => {
    const golongan = watch("modalPegawai.golongan_id_pengajar");
    const { filterLembaga } = DropdownLembaga();
    const { allGolonganList } = DropdownGolongan();
    const lembaga = watch("modalPegawai.lembaga_id_pengajar");
    const existingMateri = watch("modalPegawai.mata_pelajaran");

    const listGolonganNama = allGolonganList.map(g => ({
        value: g.id,
        label: g.GolonganNama
    }));

    useEffect(() => {
        if (golongan && golongan !== "") {
            setValue("modalPegawai.pengajar", "1");
        } else {
            setValue("modalPegawai.pengajar", "0");
        }
    }, [golongan, setValue]);

    const [materiList, setMateriList] = useState([])
    const [form, setForm] = useState({ kode_mapel: '', nama_mapel: '' })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleAdd = () => {
        if (!form.kode_mapel || !form.nama_mapel) return

        setMateriList([
            ...materiList,
            { kode_mapel: form.kode_mapel, nama_mapel: form.nama_mapel }
        ])
        setForm({ kode_mapel: '', nama_mapel: '' })
    }

    const handleRemove = (indexToRemove) => {
        const updatedList = materiList.filter((_, index) => index !== indexToRemove)
        setMateriList(updatedList)
    }

    useEffect(() => {
        setValue("modalPegawai.mata_pelajaran", materiList.map(item => ({
            kode_mapel: item.kode_mapel,
            nama_mapel: item.nama_mapel
        })));
    }, [materiList, setValue]);

    useEffect(() => {
        // Saat field sudah terisi (dari register atau data yang diedit), panggil handler
        console.log("handle", activeTab);
        if (activeTab != 2) return;
        console.log("handle change", activeTab);
        
        if (lembaga && filterLembaga.lembaga.length >= 1) {
            setValue('modalPegawai.lembaga_id_pengajar', lembaga);
        }
        if (golongan && allGolonganList.length >= 1) {
            console.log("golongan handle ",golongan);
            
            setValue('modalPegawai.golongan_id_pengajar', golongan)
        }
        if (existingMateri && existingMateri.length > 0 && materiList.length === 0) {
            const hydratedMateri = existingMateri.map(item => ({
                kode_mapel: item.kode_mapel,
                nama_mapel: item.nama_mapel
            }));
            setMateriList(hydratedMateri);
        }
    }, [activeTab, filterLembaga.lembaga, allGolonganList.length, materiList.length, lembaga, golongan, existingMateri, setValue]);

    return (
        <div className="space-y-2">
            <h1 className="text-red-500 italic font-semibold">* Silahkan isi form ini jika seorang Pengajar</h1>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4">
                <label htmlFor="golongan_id_pengajar" className="md:w-1/4 text-black">
                    Golongan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className={`flex items-center rounded-md shadow-md pl-1 border border-gray-300 border-gray-500  ${listGolonganNama?.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}>

                        <select
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            disabled={listGolonganNama?.length <= 1}
                            {...register('modalPegawai.golongan_id_pengajar')}
                        >
                            {listGolonganNama?.map((option, idx) => (
                                <option key={idx} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lembaga (nullable) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="lembaga_id_pengajar" className="md:w-1/4 text-black">
                    Lembaga
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <select
                            className={`w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm ${filterLembaga?.lembaga?.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                            disabled={filterLembaga?.lembaga?.length <= 1}
                            {...register('modalPegawai.lembaga_id_pengajar')}
                        >
                            {filterLembaga?.lembaga.map((option, idx) => (
                                <option key={idx} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Jabatan pengajar (nullable|string|max:100) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="jabatan_pengajar" className="md:w-1/4 text-black">
                    Jabatan
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <select
                            id="jabatan_pengajar"
                            {...register("modalPegawai.jabatan_pengajar")}
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

            {/* Tanggal Mulai pengajar (nullable|date) */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <label htmlFor="tanggal_mulai_pengajar" className="md:w-1/4 text-black">
                    Tanggal Mulai
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="date"
                            id="tanggal_mulai_pengajar"
                            name="tanggal_mulai_pengajar"
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            {...register("modalPegawai.tanggal_mulai_pengajar")}
                        />
                    </div>
                </div>
            </div>

            {/* Tanggal Mulai pengajar (nullable|date) */}
            {/* <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-6">
                <label htmlFor="tanggal_mulai_materi" className="md:w-1/4 text-black">
                    Tanggal Mulai Materi
                </label>
                <div className="md:w-full md:max-w-md max-w-none">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="date"
                            id="tanggal_mulai_materi"
                            name="tanggal_mulai_materi"
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            {...register("modalPegawai.tanggal_mulai_materi")}
                        />
                    </div>
                </div>
            </div> */}

            <label className="md:w-1/4 text-black font-bold">
                Mata Pelajaran
            </label>
            <div className="flex flex-row gap-2 mb-4 items-center mt-2">
                <div className="w-full max-w-md">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="text"
                            name="kode_mapel"
                            placeholder="Masukkan Kode Mapel"
                            value={form.kode_mapel}
                            onChange={handleChange}
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            maxLength={50}
                        />
                    </div>
                </div>

                {/* Input Jumlah Menit */}
                <div className="w-full max-w-md">
                    <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                        <input
                            type="text"
                            name="nama_mapel"
                            placeholder="Masukkan Nama Mapel"
                            value={form.nama_mapel}
                            onChange={handleChange}
                            className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                            maxLength={100}
                        />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    <FaPlus />
                </button>
            </div>

            
            {/* <input type="hidden" {...register("mata_pelajaran")} /> */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                        <tr>
                            <th className="px-3 py-2 border-b">No</th>
                            <th className="px-3 py-2 border-b">Kode Mapel</th>
                            <th className="px-3 py-2 border-b">Nama Mapel</th>
                            <th className="px-3 py-2 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {materiList.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{item.kode_mapel}</td>
                                <td className="px-3 py-2 border-b">{item.nama_mapel}</td>
                                <td className="px-3 py-2 border-b">
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {materiList.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-6">Belum Ada Materi</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FormPengajar;