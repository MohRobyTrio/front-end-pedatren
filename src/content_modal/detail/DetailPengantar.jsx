const DetailPengantar = ({ pengantar }) => {
    if (!pengantar) {
        return <p className="text-gray-500">Data pengantar tidak tersedia.</p>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Detail Pengantar</h2>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
                <Info label="Nama" value={pengantar.nama} />
                <Info label="Usia" value={pengantar.usia + " tahun"} />
                <Info label="Status" value={pengantar.status} />
                <Info label="Dibuat Oleh" value={pengantar.pembuat} />
                <Info label="Pengasuh" value={pengantar.pengasuh} />
                <Info label="Biktren" value={pengantar.biktren} />
                <Info label="Kamtib" value={pengantar.kamtib} />
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div>
        <span className="font-medium text-gray-800">{label}:</span>{" "}
        <span className="text-gray-600">{value || "-"}</span>
    </div>
);

export default DetailPengantar;
