// src/ExportCard.jsx
import { useRef } from "react";
import domtoimage from "dom-to-image";

const ExportCard = () => {
    const cardRef = useRef(null);

    const handleExport = async () => {
        console.log("klik");

        if (!cardRef.current) return;

        try {
            const dataUrl = await domtoimage.toPng(cardRef.current, {
                cacheBust: true,
                width: cardRef.current.offsetWidth * 3,
                height: cardRef.current.offsetHeight * 3,
                style: {
                    transform: "scale(3)",
                    transformOrigin: "top left",
                },
            });


            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "kartu.png";
            link.click();
        } catch (err) {
            console.error("Export gagal:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Template Card */}
            <div
                ref={cardRef}
                id="card"
                className="relative w-[340px] aspect-[22/35] shadow-lg overflow-hidden"
            >
                <img
                    src="/blank_template.png"
                    alt="Template"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-x-0 top-50.5 flex flex-col items-center text-lg">
                    <img
                        alt="Foto"
                        src="src/assets/blank_profile.png"
                        className="w-33 h-45 object-cover mb-3"
                    />
                    <p className="font-bold text-xl [font-family:'Poppins',sans-serif] border-b border-black">
                        Ibrahim Haikal Zidan
                    </p>
                    <p className="font-semibold text-xs [font-family:'Poppins',sans-serif] mb-2">
                        NIS: 1234567890
                    </p>
                    <p className="text-[10px] font-bold mb-1">
                        Probolinggo, 01 Januari 2000
                    </p>
                    <p className="text-[10px]">
                        Alamat: Jl. Merdeka No. 10
                    </p>
                </div>


            </div>



            {/* Export Button */}
            <button
                onClick={handleExport}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Export PNG
            </button>
        </div>
    );
};

export default ExportCard;
