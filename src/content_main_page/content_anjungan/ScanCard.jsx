import { useState } from 'react';
import { CreditCard, Wifi, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export function CardScanPage() {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState(false);

    const handleScanCard = () => {
        setScanning(true);

        // Simulasi proses scanning kartu
        setTimeout(() => {
            setScanning(false);
            setScanned(true);

            // Simulasi sukses scan
            setTimeout(() => {
                navigate('/pin-entry');
            }, 1000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-6">
            <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl">
                <div className="p-8 text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl mb-2 text-blue-900">ATM Santri</h1>
                        <p className="text-gray-600">Sistem Informasi Pondok Pesantren</p>
                    </div>

                    {/* Animasi Scan */}
                    <div className="mb-8">
                        <div className="relative mb-6">
                            {/* <div
                                className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${scanning
                                        ? 'border-blue-500 bg-blue-50 animate-pulse'
                                        : scanned
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-300 bg-gray-50'
                                    }`}
                            > */}
                            <div
                                className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${scanned
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-blue-500 bg-blue-50 animate-pulse'
                                    }`}
                            >
                                {scanned ? (
                                    <CheckCircle className="w-16 h-16 text-green-500" />
                                ) : (
                                    <Wifi className="w-16 h-16 text-blue-500 animate-pulse" />
                                // ) : (
                                //     <CreditCard className="w-16 h-16 text-gray-400" />
                                )
                                }
                            </div>

                            {/* {scanning && ( */}
                                {/* <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div> */}
                            {/* )} */}
                        </div>

                        {/* Status Pesan */}
                        {scanned ? (
                            <div className="text-green-600">
                                <p className="mb-2">Kartu berhasil dibaca!</p>
                                <p className="text-sm">Mengarahkan ke halaman PIN...</p>
                            </div>
                        // ) : scanning ? (
                        // ) : (
                        //     <div className="text-blue-600">
                        //         <p className="mb-2">Membaca kartu...</p>
                        //         <p className="text-sm">Mohon tunggu sebentar</p>
                        //     </div>
                        ) : (
                            <div>
                                <h2 className="text-lg mb-2">Scan Kartu Santri</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    Tempelkan kartu santri Anda pada sensor untuk memulai
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tombol Aksi */}
                    {!scanning && !scanned && (
                        <button
                            onClick={handleScanCard}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-medium flex items-center justify-center transition-colors"
                        >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Mulai Scan Kartu
                        </button>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            Untuk bantuan hubungi petugas atau administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
