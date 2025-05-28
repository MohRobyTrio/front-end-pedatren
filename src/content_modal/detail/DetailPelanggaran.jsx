import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const DetailPelanggaran = ({ pelanggaran }) => {
    const [imgError, setImgError] = useState(false);

    if (!pelanggaran) {
        return <p className="text-gray-500">Data pelanggaran tidak tersedia.</p>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Detail Pelanggaran</h2>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                    <div className="border rounded-lg overflow-hidden shadow-md">
                        {imgError ? (
                            <div className="flex items-center justify-center w-full h-64 bg-gray-100 text-gray-400">
                                <FontAwesomeIcon icon={faImage} className="text-4xl" />
                            </div>
                        ) : (
                            <img
                                src={pelanggaran.foto_profil}
                                alt={pelanggaran.nama_santri}
                                className="w-full h-64 object-cover"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <Info label="Nama Santri" value={pelanggaran.nama_santri} />
                    <Info label="Provinsi" value={pelanggaran.provinsi} />
                    <Info label="Kabupaten" value={pelanggaran.kabupaten} />
                    <Info label="Kecamatan" value={pelanggaran.kecamatan} />
                    <Info label="Wilayah" value={pelanggaran.wilayah} />
                    <Info label="Blok" value={pelanggaran.blok} />
                    <Info label="Kamar" value={pelanggaran.kamar} />
                    <Info label="Lembaga" value={pelanggaran.lembaga} />
                    <Info label="Jenis Pelanggaran" value={pelanggaran.jenis_pelanggaran} />
                    <Info label="Status Pelanggaran" value={pelanggaran.status_pelanggaran} />
                    <Info label="Jenis Putusan" value={pelanggaran.jenis_putusan} />
                    <Info label="Diproses Mahkamah" value={pelanggaran.diproses_mahkamah ? "Ya" : "Tidak"} />
                    <Info label="Keterangan" value={pelanggaran.keterangan} />
                    <Info label="Pencatat" value={pelanggaran.pencatat} />
                    <Info label="Tanggal Input" value={pelanggaran.tgl_input} />
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

export default DetailPelanggaran;
