import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const jenisBerkasList = [
    { id: 1, label: 'Kartu Keluarga (KK)', required: true },
    { id: 2, label: 'KTP/KIA', required: false },
    { id: 3, label: 'Akte Kelahiran', required: false },
    { id: 4, label: 'Pas Foto', required: false },
    { id: 5, label: 'Ijazah Terakhir', required: false },
    { id: 6, label: 'Fotokopi Rapor Terakhir', required: false },
    { id: 7, label: 'Surat Keterangan Sehat', required: false },
    { id: 8, label: 'BPJS / Kartu Asuransi Kesehatan', required: false },
    { id: 9, label: 'Surat Pernyataan Kesanggupan', required: false },
    { id: 10, label: 'Surat Izin Orang Tua', required: false },
    { id: 11, label: 'Surat Pernyataan Tidak Merokok', required: false },
    { id: 12, label: 'Surat Keterangan Pindah Sekolah', required: false },
    { id: 13, label: 'Surat Keterangan Lulus (SKL)', required: false },
    { id: 14, label: 'Surat Rekomendasi dari Ulama/Guru', required: false },
    { id: 15, label: 'Surat Pernyataan Bebas Narkoba', required: false },
    { id: 16, label: 'Surat Domisili (jika dari luar kota)', required: false },
    { id: 17, label: 'Surat Keterangan Anak Yatim/Piatu', required: false },
    { id: 18, label: 'Fotokopi Kartu Santri', required: false },
];

const FormBerkas = ({ onSubmit }) => {
    const [berkas, setBerkas] = useState([]);

    const handleChange = (e, jenisId) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB");
            return;
        }

        const updated = berkas.filter(b => b.jenis_berkas_id !== jenisId);
        updated.push({
            jenis_berkas_id: jenisId,
            file_path: file,
            preview: URL.createObjectURL(file),
        });
        setBerkas(updated);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData();

        berkas.forEach((item, i) => {
            formData.append(`berkas[${i}][jenis_berkas_id]`, item.jenis_berkas_id);
            formData.append(`berkas[${i}][file_path]`, item.file_path);
        });

        onSubmit(formData);
    };

    const handleDrop = (e, jenisId) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB");
            return;
        }


        const updated = berkas.filter(b => b.jenis_berkas_id !== jenisId);
        updated.push({
            jenis_berkas_id: jenisId,
            file_path: file,
            preview: URL.createObjectURL(file),
        });
        setBerkas(updated);
    };

    const handleRemove = (jenisId) => {
        setBerkas(prev => prev.filter(b => b.jenis_berkas_id !== jenisId));
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jenisBerkasList.map(({ id, label, required }) => {
                const selected = berkas.find(b => b.jenis_berkas_id === id);

                return (
                    <div key={id} className="p-4 rounded-xl border shadow-sm bg-white">
                        <label className="block text-sm font-semibold mb-2">
                            {label} {required && <span className="text-red-500">* Wajib</span>}
                        </label>

                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor={`dropzone-${id}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, id)}
                                className={`relative flex flex-col items-center justify-center w-full aspect-[4/3] min-h-[150px] cursor-pointer ${selected ? '' : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg'}`}
                            >
                                {selected ? (
                                    selected.file_path.type.startsWith("image") ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={selected.preview}
                                                alt={label}
                                                className="h-full object-contain w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                            </button>
                                        </div>

                                    ) : (
                                        <div className="text-center p-4">
                                            <p className="text-sm font-semibold">File PDF telah diunggah</p>
                                            <p className="text-blue-600 underline">Klik untuk ganti</p>
                                            
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-8 h-8 mb-4 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                                            </p>
                                            <p className="text-xs text-gray-500">PDF, JPG, PNG (max 2MB)</p>
                                        </div>
                                    </>
                                )}

                                <input
                                    id={`dropzone-${id}`}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required={required && !selected}
                                    onChange={e => handleChange(e, id)}
                                    className="hidden"
                                />
                            </label>
                        </div>

                    </div>
                );
            })}

            {/* <div className="col-span-full mt-6">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Simpan Berkas
                </button>
            </div> */}
        </form>
    );
};

export default FormBerkas;
