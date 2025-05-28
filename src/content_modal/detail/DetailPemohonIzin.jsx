import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const DetailPemohonIzin = ({ pemohonIzin }) => {
    const [imgError, setImgError] = useState(false);

    if (!pemohonIzin) {
        return <p className="text-gray-500">Data pemohon izin tidak tersedia.</p>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Detail Pemohon Izin</h2>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                    <div className="border rounded-lg overflow-hidden shadow-md">
                        {imgError ? (
                            <div className="flex items-center justify-center w-full h-64 bg-gray-100 text-gray-400">
                                <FontAwesomeIcon icon={faImage} className="text-4xl" />
                            </div>
                        ) : (
                            <img
                                src={pemohonIzin.foto_profil}
                                alt={pemohonIzin.nama}
                                className="w-full h-64 object-cover"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <Info label="Nama" value={pemohonIzin.nama} />
                    <Info label="Jenis Kelamin" value={pemohonIzin.jenis_kelamin === "p" ? "Perempuan" : "Laki-laki"} />
                    <Info label="Wilayah" value={pemohonIzin.wilayah} />
                    <Info label="Blok" value={pemohonIzin.blok} />
                    <Info label="Kamar" value={pemohonIzin.kamar} />
                    <Info label="Lembaga" value={pemohonIzin.lembaga} />
                    <Info label="Kecamatan" value={pemohonIzin.kecamatan} />
                    <Info label="Kabupaten" value={pemohonIzin.kabupaten} />
                    <Info label="Provinsi" value={pemohonIzin.provinsi} />
                    <Info label="Alamat Tujuan" value={pemohonIzin.alamat_tujuan} />
                    <Info label="Alasan Izin" value={pemohonIzin.alasan_izin} />
                    <Info label="Tanggal Mulai" value={pemohonIzin.tanggal_mulai} />
                    <Info label="Tanggal Akhir" value={pemohonIzin.tanggal_akhir} />
                    <Info label="Tanggal Kembali" value={pemohonIzin.tanggal_kembali} />
                    <Info label="Lama Izin" value={pemohonIzin.lama_izin} />
                    <Info label="Bermalam" value={pemohonIzin.bermalam} />
                    <Info label="Jenis Izin" value={pemohonIzin.jenis_izin} />
                    <Info label="Status" value={pemohonIzin.status} />
                    <Info label="Keterangan" value={pemohonIzin.keterangan} />
                    <Info label="Dibuat Oleh" value={pemohonIzin.pembuat} />
                    <Info label="Pengasuh" value={pemohonIzin.pengasuh} />
                    <Info label="Biktren" value={pemohonIzin.biktren} />
                    <Info label="Kamtib" value={pemohonIzin.kamtib} />
                </div>
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

export default DetailPemohonIzin;
