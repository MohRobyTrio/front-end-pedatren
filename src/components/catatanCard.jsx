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
                <div
                    key={i}
                    className="grid grid-cols-12 p-4 rounded-lg shadow-sm gap-4 items-center bg-white mb-4"
                >
                    {/* Foto Santri*/}
                    <div className="col-span-12 md:col-span-2 lg:col-span-2 flex justify-center h-24 rounded-md bg-gray-200 overflow-hidden">
                        {santri.foto ? (
                            <img src={santri.foto} 
                            alt={santri.nama_santri} 
                            className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                                <i className="fas fa-user text-gray-400 text-4xl"></i>
                            </div>
                        )}
                    </div>

                    {/* Info Santri */}
                    <div className="col-span-12 md:col-span-3 lg:col-span-3 space-y-2">
                        <h2 className="text-lg font-semibold">{santri.nama_santri}</h2>
                        <p className="text-sm text-gray-800">
                            Domisili: {santri.blok} - {santri.wilayah}
                        </p>
                        <p className="text-sm text-gray-800">
                            Pendidikan: {[santri.pendidikan, santri.lembaga].filter(Boolean).join(' - ') || 'Tidak ada'}
                        </p>
                    </div>

                    {/* Detail Catatan */}
                    <div className="col-span-12 md:col-span-5 lg:col-span-5 space-y-1">
                        <h2 className='text-lg font-semibold'>
                            {catatan.kategori}:{' '}
                            <span className={`${nilaiConfig[catatan.nilai]?.color || 'text-gray-600'}`}>
                                [ {catatan.nilai} ]
                            </span>
                        </h2>
                        <p className="text-md text-gray-800">{nilaiConfig[catatan.nilai]?.label || 'Tidak ada'}</p>
                        <h2 className="text-md font-semibold">Tindak Lanjut :</h2>
                        <p className="text-md text-gray-800">{catatan.tindak_lanjut || 'Tidak ada'}</p>
                    </div>

                    {/* Pencatat  */}
                    <div className="col-span-12 md:col-span-2 lg:col-span-2 space-y-2">
                        <div className="flex items-start gap-3">
                            <div className="p-1 flex items-center justify-center flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {catatan.fotoPencatat ? (
                                        <img
                                            src={catatan.fotoPencatat}
                                            alt={catatan.pencatat}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <i className="fas fa-user text-gray-400"></i>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Pencatat:</p>
                                <p className="text-sm">{catatan.pencatat || 'Tidak ada'}</p>
                                <p className="text-sm text-gray-700">({catatan.jabatanPencatat || 'Tidak ada'})</p>
                                <br />
                            </div>
                        </div>
                        <p className="text-end text-xs text-gray-500">{catatan.waktu_pencatatan || 'Tidak ada'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SantriAfektifCard;