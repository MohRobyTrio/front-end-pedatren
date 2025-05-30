import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { ModalAddBerkasPerizinan } from "../../components/modal/ModalFormPerizinan";
import { ModalAddBerkasPelanggaran } from "../../components/modal/ModalFormPelanggaran";

const DetailBerkas = ({ berkas, menu, id, close }) => {
    const [openPerizinan, setOpenPerizinan] = useState(false);
    const [openPelanggaran, setOpenPelanggaran] = useState(false);

    const handleTambahClick = () => {      
        if (menu === 17) {
            setOpenPerizinan(true);
        } else if (menu === 18) {
            setOpenPelanggaran(true);
        }
    };

    return (
        <div>
            {/* Modal */}
            <ModalAddBerkasPerizinan isOpen={openPerizinan} onClose={() => setOpenPerizinan(false)} id={id} close={close}/>
            <ModalAddBerkasPelanggaran isOpen={openPelanggaran} onClose={() => setOpenPelanggaran(false)} id={id} close={close} />
            
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold flex items-center justify-between">Daftar Berkas
            </h1>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleTambahClick();
                    }}
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                >
                    <i className="fas fa-plus"></i>
                    <span>Tambah</span>
                </button>
                </div>
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
