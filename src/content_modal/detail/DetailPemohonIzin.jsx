import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const DetailPemohonIzin = ({ pemohonIzin }) => {
    const [imgError, setImgError] = useState(false);

    if (!pemohonIzin) {
        return <p className="text-gray-500">Data pemohon izin tidak tersedia.</p>;
    }

    const formatDomisili = ({ kamar, blok, wilayah }) => {
        const parts = [kamar, blok, wilayah].map((v) =>
            v && v !== "-" && v !== null ? v : null
        );
        const filtered = parts.filter((v) => v);
        return filtered.length > 0 ? filtered.join(" - ") : "-";
    };

    const formatAlamat = ({ kecamatan, kabupaten, provinsi }) => {
        const area = [kecamatan, kabupaten].filter(v => v && v !== "-" && v !== null);
        const prov = provinsi && provinsi !== "-" && provinsi !== null ? provinsi : null;

        if (area.length === 0 && !prov) return "-";

        const areaStr = area.join(" - ");
        return prov ? `${areaStr}${areaStr ? ", " : ""}${prov}` : areaStr;
    };

    return (
        <div className="space-y-6 text-sm text-gray-700">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Foto Santri */}
                <div className="w-full md:w-1/4">
                    <div className="border rounded overflow-hidden shadow">
                        {imgError ? (
                            <div className="flex items-center justify-center w-full h-48 bg-gray-100 text-gray-400">
                                <FontAwesomeIcon icon={faImage} className="text-4xl" />
                            </div>
                        ) : (
                            <img
                                src={pemohonIzin.foto_profil}
                                alt={pemohonIzin.nama}
                                className="w-full h-48 object-cover"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>
                </div>

                {/* Informasi Santri */}
                <div className="w-full md:w-3/4 grid grid-cols-1 gap-x-8 gap-y-2">
                    <Info label="Nama Lengkap" value={pemohonIzin.nama || "-"} />
                    <Info label="Jenis Kelamin" value={pemohonIzin.jenis_kelamin === "p" ? "Perempuan" : "Laki-laki"} />
                    <Info label="Domisili" value={formatDomisili(pemohonIzin)} />
                    <Info label="Lembaga" value={pemohonIzin.lembaga || "-"} />
                    <Info label="Alamat" value={formatAlamat(pemohonIzin)} />
                    <Info label="Alasan Izin" value={pemohonIzin.alasan_izin || "-"} />
                    <Info label="Alamat Tujuan" value={pemohonIzin.alamat_tujuan || "-"} />
                    <Info label="Tanggal Mulai" value={pemohonIzin.tanggal_mulai || "-"} />
                    <Info label="Tanggal Akhir" value={pemohonIzin.tanggal_akhir || "-"} />
                    <Info label="Tanggal Kembali" value={pemohonIzin.tanggal_kembali || "-"} />
                    <Info label="Lama Izin" value={pemohonIzin.lama_izin || "-"} />
                    <Info label="Bermalam" value={pemohonIzin.bermalam || "-"} />
                    <Info label="Jenis Izin" value={pemohonIzin.jenis_izin || "-"} />
                    <Info label="Status" value={pemohonIzin.status || "-"} />
                    <Info label="Keterangan" value={pemohonIzin.keterangan || "-"} />
                </div>
            </div>
            <hr className="my-4" />
                {/* Informasi Petugas */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-2">
                    <Info label="Pembuat Izin" value={pemohonIzin.pembuat || "-"} />
                    <Info label="Biktren" value={pemohonIzin.biktren || "-"} />
                    <Info label="Pengasuh" value={pemohonIzin.pengasuh || "-"} />
                    <Info label="Kamtib" value={pemohonIzin.kamtib || "-"} />
                </div>
            <hr className="my-4" />
        </div>
    );
};

const Info = ({ label, value }) => (
    <div className="flex">
        <span className="w-30 font-medium text-gray-800">{label}:</span>
        <span className="text-gray-600">{value || "-"}</span>
    </div>
);

export default DetailPemohonIzin;
