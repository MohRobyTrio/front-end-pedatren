import { useState } from 'react';
import ModalDetail from './modal/ModalDetail';

const SantriAfektifCard = ({ santri, menu }) => {
    // const [showDetails, setShowDetails] = useState(false);

    // Config nilai
    const nilaiConfig = {
        'A': { label: 'sangat baik', color: ' text-green-800' },
        'B': { label: 'baik', color: ' text-blue-800' },
        'C': { label: 'cukup', color: ' text-yellow-800' },
        'D': { label: 'kurang', color: ' text-red-800' },
        'E': { label: 'sangat kurang', color: ' text-pink-800' },

    };

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titleModal, setTitleModal] = useState("");

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    return (
        <div className="rounded-lg mb-4">
            {santri?.map((data, i) => (
                <div
                    key={i}
                    className="grid grid-cols-12 p-4 rounded-lg shadow-sm gap-4 items-center bg-white mb-4"
                >
                    {/* Foto Santri*/}
                    <div className="col-span-12 md:col-span-2 lg:col-span-2 flex justify-center h-24 w-24 rounded-md bg-gray-200 overflow-hidden cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setTitleModal("Peserta Didik");
                            openModal(data.Biodata_uuid)
                        }}>
                        {data.foto ? (
                            <img src={data.foto}
                                alt={data.nama_santri}
                                className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                                <i className="fas fa-user text-gray-400 text-4xl"></i>
                            </div>
                        )}
                    </div>

                    {/* Info Santri */}
                    <div className="col-span-12 md:col-span-3 lg:col-span-3 space-y-2 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setTitleModal("Peserta Didik");
                            openModal(data.Biodata_uuid)
                        }}>
                        <h2 className="text-lg font-semibold">{data.nama_santri}</h2>
                        <p className="text-sm text-gray-800">
                            Domisili: {data.blok} - {data.wilayah}
                        </p>
                        <p className="text-sm text-gray-800">
                            Pendidikan: {[data.pendidikan, data.lembaga].filter(Boolean).join(' - ') || 'Tidak ada'}
                        </p>
                    </div>

                    {/* Detail Catatan */}
                    <div className="col-span-12 md:col-span-5 lg:col-span-5 space-y-1 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setTitleModal("Peserta Didik");
                            openModal(data.Biodata_uuid)
                        }}>
                        <h2 className='text-lg font-semibold'>
                            {data.kategori}:{' '}
                            <span className={`${nilaiConfig[data.nilai]?.color || 'text-gray-600'}`}>
                                [ {data.nilai} ]
                            </span>
                        </h2>
                        <p className="text-md text-gray-800">{nilaiConfig[data.nilai]?.label || 'Tidak ada'}</p>
                        <h2 className="text-md font-semibold">Tindak Lanjut :</h2>
                        <p className="text-md text-gray-800">{data.tindak_lanjut || 'Tidak ada'}</p>
                    </div>

                    {/* Pencatat  */}
                    <div className="col-span-12 md:col-span-2 lg:col-span-2 space-y-2 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setTitleModal("Pencatat");
                            openModal(data.Pencatat_uuid)
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-1 flex items-center justify-center flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {data.fotoPencatat ? (
                                        <img
                                            src={data.fotoPencatat}
                                            alt={data.pencatat}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <i className="fas fa-user text-gray-400"></i>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Pencatat:</p>
                                <p className="text-sm">{data.pencatat || 'Tidak ada'}</p>
                                <p className="text-sm text-gray-700">({data.jabatanPencatat || 'Tidak ada'})</p>
                                <br />
                            </div>
                        </div>
                        <p className="text-end text-xs text-gray-500">{data.waktu_pencatatan || 'Tidak ada'}</p>
                    </div>
                </div>
            ))}

            {isModalOpen && (
                <ModalDetail
                    title={titleModal}
                    menu={menu}
                    item={selectedItem}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default SantriAfektifCard;