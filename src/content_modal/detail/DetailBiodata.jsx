import React from "react";
import blankProfile from "../../assets/blank_profile.png";

const DetailBiodata = ({ biodata }) => (
    <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col space-y-1">
            {[
                { label: "Nomor KK", value: biodata.nokk },
                { label: "NIK/No. Pasport", value: biodata.nik_nopassport },
                { label: "NIUP", value: biodata.niup },
                { label: "Nama", value: biodata.nama },
                { label: "Jenis Kelamin", value: biodata.jenis_kelamin === "p" ? "Perempuan" : "Laki-laki" },
                { label: "Tempat, Tgl Lahir", value: biodata.tempat_tanggal_lahir },
                { label: "Anak Ke", value: biodata.anak_ke },
                { label: "Umur", value: biodata.umur },
                { label: "Kecamatan", value: biodata.kecamatan },
                { label: "Kabupaten", value: biodata.kabupaten },
                { label: "Provinsi", value: biodata.provinsi },
                { label: "Warganegara", value: biodata.warganegara },
            ].map((item, index) => (
                // <div key={index} className="flex sm:flex-row flex-col sm:space-x-3">
                //     <p className="w-40 font-semibold">{item.label} :</p>
                //     <p>{item.value}</p>
                // </div>
                <React.Fragment key={index}>
                    {/* Spacer sebelum Kecamatan (index 8) */}
                    {/* {index === 8 && (
                        <div className="h-2 sm:h-2 sm:ml-6" />
                    )} */}
                    <div className="flex sm:flex-row flex-col sm:space-x-3">
                        <p className="w-40 font-semibold">{item.label} :</p>
                        <p>{item.value || "-"}</p>
                    </div>
                </React.Fragment>
            ))}
        </div>
        <img
            src={biodata?.foto_profil}
            alt="Foto Profil"
            className="w-46 h-54 object-cover rounded mt-4 sm:mt-0 sm:ml-8 border border-gray-500 p-1"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = blankProfile;
            }}
        />
    </div>
);

export default DetailBiodata;