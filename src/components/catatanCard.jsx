import { useState } from 'react';

const SantriAfektifCard = ({ santri }) => {
    const [showDetails, setShowDetails] = useState(false);

    // Config nilai
    const nilaiConfig = {
        'A': { label: 'sangat baik', color: 'bg-green-100 text-green-800' },
        'B': { label: 'baik', color: 'bg-blue-100 text-blue-800' },
        'C': { label: 'cukup', color: 'bg-yellow-100 text-yellow-800' },
        'D': { label: 'kurang', color: 'bg-red-100 text-red-800' },
        'E': { label: 'sangat kurang', color: 'bg-pink-100 text-pink-800' },
        
    };

    return (
        <div className="rounded-lg mb-4">
            {santri.catatan?.map((catatan, i) => (
                <div key={i} className="flex flex-wrap p-4 rounded-lg shadow-sm gap-4 items-center bg-white mb-4">
                    {/* Foto Santri */}
                    <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {santri.foto ? (
                            <img src={santri.foto} alt={santri.nama_santri} className="w-full h-full object-cover" />
                        ) : (
                            <i className="fas fa-user text-gray-400 text-4xl"></i>
                        )}
                    </div>

                    {/* Info Santri */}
                    <div className="flex-1 space-y-2 min-w-[200px]">
                        <h2 className="text-lg font-semibold">{santri.nama_santri}</h2>
                        <p className="text-sm text-gray-600">
                            Domisili: {santri.blok} - {santri.wilayah}</p>
                        <p className="text-sm text-gray-600">
                            Pendidikan : {[santri.pendidikan, santri.lembaga].filter(Boolean).join(' - ')}
                        </p>
                    </div>

                    {/* Detail Catatan */}
                    <div className="flex-1 space-y-2 min-w-[150px]">
                        <h2>
                            {catatan.kategori}: <span className={`${nilaiConfig[catatan.nilai]?.color || 'text-gray-600'}`}>
                                [ {catatan.nilai} ]
                            </span>
                        </h2>
                        <p className="text-sm">{nilaiConfig[catatan.nilai]?.label}</p>
                        <p className="text-sm font-semibold">Tindak Lanjut:</p>
                        <p className="text-sm">{catatan.tindak_lanjut}</p>
                    </div>

                    {/* Pencatat */}
                    <div className="text-center space-y-2 flex flex-col items-center min-w-[120px]">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {catatan.fotoPencatat ? (
                                <img src={catatan.fotoPencatat} alt={catatan.pencatat} className="w-full h-full object-cover" />
                            ) : (
                                <i className="fas fa-user text-gray-400"></i>
                            )}
                        </div>
                        <p className="text-sm font-bold">{catatan.pencatat}</p>
                        <p className="text-sm">({catatan.jabatanPencatat})</p>
                        <p className="text-xs text-gray-500">{catatan.waktu_pencatatan}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SantriAfektifCard;