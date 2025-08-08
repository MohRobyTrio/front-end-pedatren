import { useState } from 'react';
import ModalDetail from './modal/ModalDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FaMapMarkerAlt, FaSchool } from 'react-icons/fa';
import { ModalKeluarProgressFormulir } from './modal/modal_formulir/ModalFormProgress';
import { ModalEditCatatan } from './modal/ModalFormCatatan';
import Access from '../components/Access';
import blankProfile from "../assets/blank_profile.png";

const SantriAfektifCard = ({ santri, menu, fetchData, label }) => {
    // Config nilai sederhana
    const nilaiConfig = {
        'A': { label: 'Sangat Baik', color: 'text-green-700 bg-green-50 border-green-200' },
        'B': { label: 'Baik', color: 'text-blue-700 bg-blue-50 border-blue-200' },
        'C': { label: 'Cukup', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
        'D': { label: 'Kurang', color: 'text-orange-700 bg-orange-50 border-orange-200' },
        'E': { label: 'Sangat Kurang', color: 'text-red-700 bg-red-50 border-red-200' },
    };

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [showOutModal, setShowOutModal] = useState(false);
    const [selectedDataId, setSelectedDataId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    const closeOutModal = () => {
        setShowOutModal(false);
    };

    const openOutModal = (id) => {
        console.log("id card", id);
        setSelectedDataId(id);
        setShowOutModal(true);
    };

    const openEditModal = (data) => {
        setEditData({
            id_catatan: data.id_catatan,
            kategori: data.kategori,
            nilai: data.nilai,
            tindak_lanjut: data.tindak_lanjut
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setEditData(null);
        setShowEditModal(false);
    };

    return (
        <div className="space-y-3">
            <ModalKeluarProgressFormulir isOpen={showOutModal} onClose={closeOutModal} id={selectedDataId} refetchData={fetchData} endpoint={label} />
            {showEditModal && (
                <ModalEditCatatan
                    isOpen={showEditModal}
                    onClose={closeEditModal}
                    id={editData?.id_catatan}
                    endpoint={label}
                    refetchData={fetchData}
                    initialData={editData}
                />
            )}
            
            {santri?.map((data, i) => (
                <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden hover:shadow-md transition-shadow duration-200 relative pb-1"
                >
                    {/* Header dengan Action Buttons */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-600">
                            Penilaian {data.kategori}
                        </div>

                        <div className="flex items-center gap-2">
                            <Access action={'edit'}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(data);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                                    title="Edit Catatan"
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                                    <span>Edit</span>
                                </button>
                            </Access>
                            
                            <Access action={'keluar'}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openOutModal(data.id_catatan);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium"
                                    title="Keluar Afektif"
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                                    <span>Selesai</span>
                                </button>
                            </Access>
                        </div>
                    </div>

                    {/* Main Content - Horizontal Layout */}
                    <div className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Photo Section */}
                            <div className="flex-shrink-0 flex justify-center sm:justify-start">
                                <div 
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTitleModal("Peserta Didik");
                                        openModal(data.Biodata_uuid);
                                    }}
                                >
                                    <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-200 shadow-sm border-2 border-white">
                                            <img 
                                                src={data.foto_catatan || "/placeholder.svg"}
                                                alt={data.nama_santri}
                                                className="w-full h-full object-cover" 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = blankProfile ;
                                                }}
                                            />
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 min-w-0">
                                <div 
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTitleModal("Peserta Didik");
                                        openModal(data.Biodata_uuid);
                                    }}
                                >
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">{data.nama_santri}</h2>
                                    
                                    <div className="space-y-1 text-sm">
                                        {/* Domisili */}
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-green-500 text-sm flex-shrink-0" />
                                            <span className="text-gray-600 min-w-[70px]">Domisili</span>
                                            <span className="font-medium text-gray-800">: {data.blok} - {data.wilayah}</span>
                                        </div>

                                        {/* Pendidikan */}
                                        <div className="flex items-center gap-2">
                                            <FaSchool className="text-blue-500 text-sm flex-shrink-0" />
                                            <span className="text-gray-600 min-w-[70px]">Pendidikan</span>
                                            <span className="font-medium text-gray-800">
                                                : {[data.pendidikan, data.lembaga].filter(Boolean).join(' - ') || 'Tidak ada'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assessment Section */}
                            <div className="flex-1 min-w-0">
                                <div 
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTitleModal("Peserta Didik");
                                        openModal(data.Biodata_uuid);
                                    }}
                                >
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">{data.kategori}</h3>
                                    
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">Nilai:</span>
                                        <span className={`px-2 py-1 rounded text-sm font-medium border ${nilaiConfig[data.nilai]?.color || 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                                            {data.nilai} - {nilaiConfig[data.nilai]?.label || 'Tidak ada'}
                                        </span>
                                    </div>
                                    
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-700">Tindak Lanjut:</span>
                                        <p className="text-gray-600 mt-1 leading-relaxed">{data.tindak_lanjut || 'Tidak ada'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recorder Section */}
                            <div className="flex-shrink-0 sm:w-48">
                                <div 
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTitleModal("Pencatat");
                                        openModal(data.Pencatat_uuid);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shadow-sm border-2 border-white flex-shrink-0">
                                            <img
                                                src={data.foto_pencatat || "/placeholder.svg"}
                                                alt={data.pencatat}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = blankProfile ;
                                                }}
                                            />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pencatat</p>
                                            <h4 className="font-medium text-gray-900 text-sm">{data.pencatat || 'Tidak ada'}</h4>
                                            <p className="text-xs text-gray-600 truncate">({data.jabatanPencatat || 'Tidak ada'})</p>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute bottom-3 right-4 text-xs text-gray-500">
                                        {data.waktu_pencatatan || 'Tidak ada'}
                                    </div>
                                </div>
                            </div>
                        </div>
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
