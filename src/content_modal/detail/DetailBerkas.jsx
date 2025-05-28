import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const DetailBerkas = ({ berkas }) => {
    if (!berkas || berkas.length === 0) {
        return <p className="text-gray-500">Tidak ada berkas yang tersedia.</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Daftar Berkas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {berkas.map((url, index) => (
                    <ImageCard key={index} url={url} index={index} />
                ))}
            </div>
        </div>
    );
};

const ImageCard = ({ url, index }) => {
    const [error, setError] = useState(false);

    return (
        <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
            {error ? (
                <div className="flex items-center justify-center w-full h-64 bg-gray-100 text-gray-400">
                    <FontAwesomeIcon icon={faImage} className="text-4xl" />
                </div>
            ) : (
                <img
                    src={url}
                    alt={`Berkas ${index + 1}`}
                    className="w-full h-64 object-cover"
                    onError={() => setError(true)}
                />
            )}
            <div className="p-2 text-sm text-center text-gray-600">
                Berkas {index + 1}
            </div>
        </div>
    );
};

export default DetailBerkas;
