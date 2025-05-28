const DetailPengantar = ({ pengantar }) => {
    // const [imgError, setImgError] = useState(false);

    if (!pengantar) {
        return <p className="text-gray-500">Data pengantar tidak tersedia.</p>;
    }

    return (
        <div className="space-y-4">
            {/* <h2 className="text-xl font-semibold mb-4">Pengantar / Penjemput</h2> */}
            <div className="border rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Foto profil dan info utama */}
                    <div className="flex gap-4 w-full md:w-1/2">
                        {/* <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
                            {imgError ? (
                                <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-400" />
                            ) : (
                                <img
                                    src={pengantar.foto_profil || "/default-profile.jpg"}
                                    alt={pengantar.nama}
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            )}
                        </div> */}
                        <div className="flex flex-col justify-center space-y-1 text-sm">
                            <div className="font-semibold flex items-center gap-1">
                                {pengantar.nama}
                            </div>
                            <div className="text-gray-600">{pengantar.usia} Tahun</div>
                            <div className="text-gray-600 capitalize">{pengantar.status}</div>
                        </div>
                    </div>

                    
                </div>

                <hr className="my-4" />

                {/* Petugas */}
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <Petugas label="Pembuat Izin" value={pengantar.pembuat} />
                    <Petugas label="Biktren" value={pengantar.biktren} />
                    <Petugas label="Pengasuh" value={pengantar.pengasuh} />
                    <Petugas label="Kamtib" value={pengantar.kamtib} />
                </div>
            </div>
        </div>
    );
};

const Petugas = ({ label, value }) => (
    <div>
        <span className="inline-block font-medium text-gray-800 w-25">{label}:</span>{" "}
        <span className="text-gray-600">{value || "-"}</span>
    </div>
);

export default DetailPengantar;
