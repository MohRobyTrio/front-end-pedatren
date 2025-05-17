import { useState } from "react";
import blankProfile from "../assets/blank_profile.png";
import ModalDetail from "./ModalDetail";

const PesertaItem = ({ data, title, menu }) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
                onClick={() => setOpenModal(true)}
            >
                <img
                    alt={data.nama || "-"}
                    className="w-20 h-24 object-cover"
                    src={data.foto_profil}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = blankProfile;
                    }}
                />
                <div>
                    <h2 className="font-semibold text-xl">{data.nama}</h2>
                    <p className="text-gray-600">NIUP: {data.niup}</p>
                    <p className="text-gray-600">
                        {" "}
                        {data.pendidikan_terakhir && data.pendidikan_terakhir !== "-" && data.lembaga && data.lembaga !== "-" ? (
                            <>
                                {data.pendidikan_terakhir} - {data.lembaga}
                            </>
                        ) : data.pendidikan_terakhir && data.pendidikan_terakhir !== "-" ? (
                            data.pendidikan_terakhir
                        ) : data.lembaga && data.lembaga !== "-" ? (
                            data.lembaga
                        ) : (
                            "-"
                        )}
                    </p>
                </div>
            </div>

            {/* {openModal && <Modal item={data} onClose={() => setOpenModal(false)} />} */}
            {openModal &&
                <ModalDetail
                    title={title}
                    menu={menu}
                    item={data}
                    onClose={() => setOpenModal(false)}

                />}
        </>
    );
};

export default PesertaItem;