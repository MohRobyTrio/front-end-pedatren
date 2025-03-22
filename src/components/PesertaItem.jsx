import blankProfile from "../assets/blank_profile.png";

const PesertaItem = ({ student }) => {
    return (
        // <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        //     <img
        //         alt="Student Photo"
        //         className="w-20 h-24 object-cover"
        //         height={50}
        //         src={student.foto_profil || blankProfile }
        //         width={50}
        //         loading="lazy"  
        //         type="image/webp"
        //     />
        //     <div>
        //         <h2 className="font-semibold">{student.nama || "-"}</h2>
        //         <p className="text-gray-600">NIUP: {student.niup || "-"}</p>
        //         <p className="text-gray-600">{student.lembaga || "-"}</p>
        //     </div>
        // </div>

        <div key={student.id_pengajar} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
            <img
                alt={student.nama || "-"}
                className="w-20 h-24 object-cover"
                src={student.foto_profil || blankProfile}
                width={50}
                height={50}
            />
            <div>
                <h2 className="font-semibold">{student.nama}</h2>
                <p className="text-gray-600">NIUP: {student.niup}</p>
                <p className="text-gray-600">{student.lembaga}</p>
            </div>
        </div>
    );
};

export default PesertaItem;
