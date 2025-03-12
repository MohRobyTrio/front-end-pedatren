const PengurusItem = ({ pengurus }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <img
                alt="Student Photo"
                className="w-16 h-16 rounded-full"
                height={50}
                src={student.photo || "https://via.placeholder.com/50"}
                width={50}
            />
            <div>
                <h2 className="font-semibold">{pengurus.nama}</h2>
                <p className="text-gray-600">{pengurus.nik}</p>
                <p className="text-gray-600">{pengurus.jabatan} {pengurus.golongan_jabatan}</p>
            </div>
        </div>
    );
};

export default PengurusItem;
