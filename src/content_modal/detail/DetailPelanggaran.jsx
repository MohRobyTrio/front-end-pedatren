import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";

const DetailPelanggaran = ({ pelanggaran }) => {
    const [imgError, setImgError] = useState(false);

    if (!pelanggaran) {
        return <p className="text-gray-500">Data pelanggaran tidak tersedia.</p>;
    }

    return (
        <div className="space-y-4">
            {/* Bagian atas: foto dan info detail */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Foto */}
                <div className="w-full md:w-1/3 text-sm text-gray-700">
                    <div className="border rounded-md overflow-hidden shadow">
                        {imgError ? (
                            <div className="flex items-center justify-center w-full h-60 bg-gray-100 text-gray-400">
                                <FontAwesomeIcon icon={faImage} className="text-4xl" />
                            </div>
                        ) : (
                            <img
                                src={pelanggaran.foto_profil}
                                alt={pelanggaran.nama_santri}
                                className="w-full h-60 object-cover"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>
                </div>

                {/* Info Detail */}
                <div className="w-full md:w-2/3 text-sm text-gray-700">
                    <div className="text-lg font-semibold mb-2">{pelanggaran.nama_santri}</div>
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"> */}
                    <InfoDetail label="Alamat" value={formatAlamat(pelanggaran)} />
                    <InfoDetail label="Domisili" value={formatDomisili(pelanggaran)} />
                    <InfoDetail label="Lembaga" value={pelanggaran.lembaga} />
                    {/* </div> */}
                </div>
            </div>

            {/* Bagian bawah: Pelanggaran dan Putusan */}
            <div className="text-sm text-gray-700 space-y-4">
                <Section title="Pelanggaran">
                    <Row label="Jenis Pelanggaran" value={pelanggaran.jenis_pelanggaran} />
                    <Row label="Diproses Mahkamah" value={pelanggaran.diproses_mahkamah ? "Ya" : <span className="text-red-500">Tidak <FontAwesomeIcon icon={faXmark} /></span>} />
                    <Row label="Status Pelanggaran" value={pelanggaran.status_pelanggaran} />
                    <Row label="Pencatat" value={pelanggaran.pencatat || "(AutoSystem)"} />
                    <Row label="Tanggal Input" value={pelanggaran.tgl_input} />
                </Section>

                <Section title="Putusan">
                    <Row label="Jenis Putusan" value={pelanggaran.jenis_putusan || "-"} />
                    <Row label="Keterangan" value={pelanggaran.keterangan || "-"} />
                </Section>
                <hr className="my-2" />
            </div>
        </div>
    );
};

// Komponen bantu
const InfoDetail = ({ label, value }) => (
    <div className="flex">
        <span className="font-medium w-24">{label}</span>: {value || "-"}
    </div>
);

const Row = ({ label, value }) => (
    <div className="flex">
        <div className="w-40">{label}</div>
        <div className="flex-1">: {value || "-"}</div>
    </div>
);

const Section = ({ title, children }) => (
    <div>
        <hr className="my-2" />
        <div className="font-semibold text-base mb-1">{title}</div>
        <div className="space-y-1">{children}</div>
    </div>
);

// Format alamat (kabupaten, kecamatan, provinsi)
const formatAlamat = ({ kecamatan, kabupaten, provinsi }) => {
    const area = [kabupaten, kecamatan].filter(v => v && v !== "-" && v !== null);
    const prov = provinsi && provinsi !== "-" && provinsi !== null ? provinsi : null;
    if (area.length === 0 && !prov) return "-";
    const areaStr = area.join(", ");
    return prov ? `${areaStr}, ${prov}` : areaStr;
};

// Format domisili (wilayah, blok, kamar)
const formatDomisili = ({ wilayah, blok, kamar }) => {
    const data = [wilayah, blok, kamar].filter(v => v && v !== "-" && v !== null);
    return data.length ? data.join(" - ") : "-";
};

export default DetailPelanggaran;
