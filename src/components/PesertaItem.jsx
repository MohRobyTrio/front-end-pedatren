import { useState } from "react";
import blankProfile from "../assets/blank_profile.png";
import Modal from "./Modal";

const PesertaItem = ({ student }) => {
    const [openModal, setOpenModal] = useState(false);
    
    return (
        <>
            <div
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
                onClick={() => setOpenModal(true)}
            >
                <img
                    alt={student.nama || "-"}
                    className="w-20 h-24 object-cover"
                    src={student.foto_profil}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = blankProfile;
                    }}
                />
                <div>
                    <h2 className="font-semibold text-xl">{student.nama}</h2>
                    <p className="text-gray-600">NIUP: {student.niup}</p>
                    <p className="text-gray-600">
                        {" "}
                        {student.pendidikan_terakhir && student.pendidikan_terakhir !== "-" && student.lembaga && student.lembaga !== "-" ? (
                            <>
                                {student.pendidikan_terakhir} - {student.lembaga}
                            </>
                        ) : student.pendidikan_terakhir && student.pendidikan_terakhir !== "-" ? (
                            student.pendidikan_terakhir
                        ) : student.lembaga && student.lembaga !== "-" ? (
                            student.lembaga
                        ) : (
                            "-"
                        )}
                    </p>
                </div>
            </div>

            {openModal && <Modal item={student} onClose={() => setOpenModal(false)} />}
        </>
    );
};

export default PesertaItem;