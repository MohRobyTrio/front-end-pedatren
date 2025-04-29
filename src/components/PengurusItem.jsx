import blankProfile from "../assets/blank_profile.png";

const PengurusItem = ({ item }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
            <img
                alt={item.nama}
                className="w-20 h-24 object-cover"
                height={50}
                src={item.image_url || blankProfile}
                width={50}
            />
            <div>
                <h2 className="font-semibold">{item.nama}</h2>
                <p className="text-gray-600">{item.nik}</p>
                {/* <p className="text-gray-600">{pengurus?.jabatan} {pengurus?.golongan_jabatan}</p> */}
                <p className="text-gray-600">{item.jenisJabatan}</p>
            </div>
        </div>
    );
};

export default PengurusItem;
