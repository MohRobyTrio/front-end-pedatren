const PesertaItem = ({ student }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <img
                alt="Student Photo"
                className="w-20 h-24 object-cover"
                height={50}
                src={student.foto_profil || "https://via.placeholder.com/50"}
                width={50}
            />
            <div>
                <h2 className="font-semibold">{student.nama}</h2> {/*diganti name*/}
                <p className="text-gray-600">NIUP: {student.niup}</p> {/*diganti niup*/}
                <p className="text-gray-600">{student.lembaga}</p> {/*diganti university*/}
            </div>
        </div>
    );
};

export default PesertaItem;
