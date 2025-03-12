const AlumniItem = ({ alumni }) => {
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
                <h2 className="font-semibold">{alumni.nama}</h2>
                <p className="text-gray-600">Kab. {alumni.nama_kabupaten}</p>
                <p className="text-gray-600">Pend.Terakhir :{alumni.lembaga}-{alumni.tahun_keluar}</p>
            </div>
        </div>
    );
};

export default AlumniItem;
