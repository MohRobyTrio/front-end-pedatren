"use client";

import { Construction, ArrowLeft, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeatureUnavailable = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="px-6 py-10 mx-auto max-w-md text-center bg-white rounded-2xl shadow-lg border border-gray-200">
                {/* Icon */}
                <div className="mb-6 flex justify-center relative">
                    <div className="relative">
                        <Construction className="w-20 h-20 text-yellow-500 animate-pulse" />
                        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2 shadow-md">
                            <Wrench className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="mb-2 text-4xl font-bold text-gray-800">Oops!</h1>
                <p className="mb-4 text-lg font-medium text-gray-600">
                    Fitur Belum Tersedia
                </p>

                {/* Description */}
                <p className="mb-8 text-base text-gray-500 leading-relaxed">
                    Maaf, fitur yang Anda cari masih dalam tahap pengembangan.
                    Nantikan update terbaru kami ✨
                </p>

                {/* Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium shadow-md hover:shadow-lg hover:bg-blue-500/90 active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>
            </div>
        </section>
    );
};

export default FeatureUnavailable;
