const PengurusItem = ({ pengurus }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
            <img
                alt="Pengurus Photo"
                className="w-20 h-24 object-cover"
                height={50}
                src={pengurus?.foto_profil || "https://via.placeholder.com/50"}
                width={50}
            />
            <div>
                <h2 className="font-semibold">{pengurus?.nama}</h2>
                <p className="text-gray-600">{pengurus?.nik}</p>
                {/* <p className="text-gray-600">{pengurus?.jabatan} {pengurus?.golongan_jabatan}</p> */}
                <p className="text-gray-600">{pengurus?.jabatan}</p>
            </div>
        </div>
    );
};

export default PengurusItem;
