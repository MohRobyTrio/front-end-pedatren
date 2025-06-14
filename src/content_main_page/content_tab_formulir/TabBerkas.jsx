import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faFileAlt, faFilePdf, faEdit, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useBerkas } from '../../hooks/hooks_formulir/tabBerkas';
import ModalBerkas from '../../components/modal/modal_formulir/ModalBerkas';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { OrbitProgress } from 'react-loading-indicators';

export default function TabBerkas() {
    const { biodata_id } = useParams();
    const bioId = biodata_id;
    const { berkasList, loading, error, fetchBerkas, createBerkas, updateBerkas } = useBerkas(bioId);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [imgErrorMap, setImgErrorMap] = useState({});


    useEffect(() => {
        fetchBerkas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bioId]);

    function isImage(filePath = '') {
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filePath);
    }

    function iconForType(filePath = '') {
        if (filePath.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) return faFileImage;
        if (filePath.match(/\.pdf$/i)) return faFilePdf;
        return faFileAlt;
    }

    const handleOpenAdd = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenEdit = (berkas) => {
        setEditData({
            id: berkas.id,
            jenis_berkas_id: berkas.jenis_berkas_id || '',
            file_path: berkas.file_path || ''
        });
        setModalOpen(true);
    };

    const handleSubmit = async ({ formData, id }) => {

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang proses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            if (id) {
                for (const pair of formData.entries()) {
                    console.log(`${pair[0]}:`, pair[1]);
                }
                await updateBerkas(id, formData);
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Berkas berhasil diperbarui",
                });
            } else {
                console.log("Isi formData sebelum submit:", formData);

                await createBerkas(bioId, formData);
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Berkas berhasil ditambahkan",
                });
            }
            Swal.close();
            setModalOpen(false);
            fetchBerkas();
        } catch (err) {
            console.log(err.message);

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.message || "Terjadi kesalahan",
            });

        }
    };

    return (
        <div className="px-2 sm:px-4 w-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Berkas</h1>
                <button
                    onClick={handleOpenAdd}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                >
                    Tambah Berkas
                </button>
            </div>

            {loading && <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(berkasList ?? []).length === 0 && !loading && (
                    <p className="col-span-full text-center">Tidak ada berkas.</p>
                )}

                {(berkasList ?? []).map((berkas) => (
                    <div
                        key={berkas.id}
                        className="relative bg-white shadow rounded-lg overflow-hidden border group"
                    >
                        {/* Tombol Edit */}
                        <button
                            onClick={() => handleOpenEdit(berkas)}
                            className="absolute top-2 right-10 z-10 text-yellow-500 hover:text-yellow-600"
                            title="Edit berkas"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>

                        {/* Tombol Download */}
                        <a
                            href={berkas.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 z-10 text-gray-600 hover:text-blue-600"
                            title="Download"
                        >
                            <FontAwesomeIcon icon={faDownload} />
                        </a>

                        {/* Label Jenis Berkas */}
                        <div className="absolute top-2 left-2 bg-purple-200 text-purple-700 text-xs px-2 py-1 rounded shadow">
                            {'Berkas'}
                        </div>

                        {/* Preview Gambar atau Ikon */}
                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {berkas.file_path && isImage(berkas.file_path) && !imgErrorMap[berkas.file_path]  ? (
                                <img
                                    src={berkas.file_path}
                                    alt={berkas.nama_jenis_berkas || 'berkas'}
                                    className="object-cover h-full w-full"
                                    onError={() =>
                                        setImgErrorMap((prev) => ({ ...prev, [berkas.file_path]: true }))
                                    }
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={iconForType(berkas.file_path)}
                                    size="3x"
                                    className="text-gray-400"
                                />
                            )}
                        </div>

                        {/* Deskripsi */}
                        <div className="p-3 text-center">
                            <p className="text-sm font-medium text-gray-700">
                                {berkas.nama_jenis_berkas ? (
                                    berkas.nama_jenis_berkas
                                ) : (
                                    <span className="italic text-gray-400">*tanpa deskripsi</span>
                                )}
                            </p>

                            {/* <div className="mt-2">
                                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                    {jenisBerkasList.find(j => j.id === berkas.jenis_berkas_id)?.label || 'Berkas'}
                                </span>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>

            <ModalBerkas
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={editData}
            />
        </div>
    );
}
