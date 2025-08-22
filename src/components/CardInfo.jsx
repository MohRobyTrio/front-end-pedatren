import blankProfile from "../assets/blank_profile.png";

export const WaliAsuhInfoCard = ({ waliAsuh, setShowSelectWaliAsuh }) => {
    if (!waliAsuh) return null;

    return (
    <div className="relative p-4 pr-12 rounded-md bg-gray-50 shadow-sm mb-6 border border-blue-200">
        {/* Keterangan */}
        <div className="absolute -top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
            Data Wali Asuh/Pencatat
        </div>

            <button
                type="button"
                onClick={() => setShowSelectWaliAsuh(true)}
                className="absolute top-3 right-3 px-2 py-1 rounded hover:bg-blue-700 text-gray-700 bg-blue-500 text-white"
                aria-label="Ganti Wali Asuh"
            >
                <i className="fas fa-exchange-alt"></i>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">

                {/* Foto */}
                <div className="flex justify-center sm:justify-start">
                    <img
                        src={waliAsuh.foto_profil}
                        alt={waliAsuh.value}
                        className="w-32 h-40 object-cover rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = blankProfile;
                        }}
                    />
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Nama</span> <span>: {waliAsuh.value}</span>
                        <span className="font-semibold">NIS</span> <span>: {waliAsuh.nis}</span>
                        <span className="font-semibold">Angkatan</span> <span>: {waliAsuh.angkatan}</span>
                        <span className="font-semibold">Kota Asal</span> <span>: {waliAsuh.kota_asal}</span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Wilayah</span> <span>: {waliAsuh.wilayah}</span>
                        <span className="font-semibold">Blok</span> <span>: {waliAsuh.blok}</span>
                        <span className="font-semibold">Kamar</span> <span>: {waliAsuh.kamar}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export const WaliAsuhInfoCardCompact = ({ waliAsuh, setShowSelectWaliAsuh }) => {
  if (!waliAsuh) return null

  return (
    <div className="relative w-full p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-md border border-blue-200 ">
      {/* Keterangan */}
      <div className="absolute -top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded shadow z-10">
        Wali Asuh
      </div>

      {/* Button Ganti */}
      <button
        type="button"
        onClick={() => setShowSelectWaliAsuh(true)}
        className="absolute top-2 right-2 w-8 h-8 rounded-full hover:bg-blue-700 text-white bg-blue-500 flex items-center justify-center text-sm transition-colors duration-200 z-10"
        aria-label="Ganti Wali Asuh"
      >
        <i className="fas fa-exchange-alt"></i>
      </button>

      <div className="flex items-start gap-4 pt-4">
        {/* Foto - Left Side */}
        <div className="flex-shrink-0">
          <img
            src={waliAsuh.foto_profil || "/placeholder.svg"}
            alt={waliAsuh.value}
            className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 object-cover rounded-md shadow-sm"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = blankProfile
            }}
          />
        </div>

        {/* Info - Right Side */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 gap-y-1 text-xs sm:text-sm">
            <div className="flex flex-wrap items-start gap-x-1">
              <span className="font-semibold text-gray-700 whitespace-nowrap">Nama</span>
              <span className="text-gray-600 break-words">: {waliAsuh.value}</span>
            </div>
            <div className="flex flex-wrap items-start gap-x-1">
              <span className="font-semibold text-gray-700 whitespace-nowrap">NIS</span>
              <span className="text-gray-600">: {waliAsuh.nis}</span>
            </div>
            <div className="flex flex-wrap items-start gap-x-1">
              <span className="font-semibold text-gray-700 whitespace-nowrap">Angkatan</span>
              <span className="text-gray-600">: {waliAsuh.angkatan}</span>
            </div>
            {/* <div className="flex flex-wrap items-start gap-x-1">
              <span className="font-semibold text-gray-700 whitespace-nowrap">Kota</span>
              <span className="text-gray-600 break-words">: {waliAsuh.kota_asal}</span>
            </div> */}
            <div className="flex flex-wrap items-start gap-x-1">
              <span className="font-semibold text-gray-700 whitespace-nowrap">Wilayah</span>
              <span className="text-gray-600">: {waliAsuh.wilayah}</span>
            </div>
            <div className="flex flex-wrap items-start gap-x-1">
              <span className="font-semibold text-gray-700 whitespace-nowrap">Blok</span>
              <span className="text-gray-600">: {waliAsuh.blok}</span>
            </div>
            <div className="flex flex-wrap items-start gap-x-1">
              <span className="font-semibold text-gray-700 whitespace-nowrap">Kamar</span>
              <span className="text-gray-600">: {waliAsuh.kamar}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SantriInfoCard = ({ santri, setShowSelectSantri }) => {
    if (!santri) return null;

    return (
    <div className="relative p-4 pr-12 rounded-md bg-gray-50 shadow-sm mb-6 border border-blue-200">
        {/* Keterangan */}
        <div className="absolute -top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
            Data Santri
        </div>

            <button
                type="button"
                onClick={() => setShowSelectSantri(true)}
                className="absolute top-3 right-3 px-2 py-1 rounded hover:bg-blue-700 text-gray-700 bg-blue-500 text-white"
                aria-label="Ganti Santri"
            >
                <i className="fas fa-exchange-alt"></i>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">

                {/* Foto */}
                <div className="flex justify-center sm:justify-start">
                    <img
                        src={santri.foto_profil}
                        alt={santri.value}
                        className="w-32 h-40 object-cover rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = blankProfile;
                        }}
                    />
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Nama</span> <span>: {santri.value}</span>
                        <span className="font-semibold">NIS</span> <span>: {santri.nis}</span>
                        <span className="font-semibold">NIUP</span> <span>: {santri.niup}</span>
                        <span className="font-semibold">Angkatan</span> <span>: {santri.angkatan}</span>
                        <span className="font-semibold">Kota Asal</span> <span>: {santri.kota_asal}</span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Lembaga</span> <span>: {santri.lembaga}</span>
                        <span className="font-semibold">Wilayah</span> <span>: {santri.wilayah}</span>
                        <span className="font-semibold">Blok</span> <span>: {santri.blok}</span>
                        <span className="font-semibold">Kamar</span> <span>: {santri.kamar}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
export const PengajarInfoCard = ({ pengajar, setShowSelectPengajar }) => {
    if (!pengajar) return null;

    return (
    <div className="relative p-4 pr-12 rounded-md bg-gray-50 shadow-sm mb-6 border border-blue-200">
        {/* Keterangan */}
        <div className="absolute -top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
            Data Pengajar
        </div>

            <button
                type="button"
                onClick={() => setShowSelectPengajar(true)}
                className="absolute top-3 right-3 px-2 py-1 rounded hover:bg-blue-700 text-gray-700 bg-blue-500 text-white"
                aria-label="Ganti Pengajar"
            >
                <i className="fas fa-exchange-alt"></i>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">

                {/* Foto */}
                <div className="flex justify-center sm:justify-start">
                    <img
                        src={pengajar.foto_profil}
                        alt={pengajar.value}
                        className="w-32 h-40 object-cover rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = blankProfile;
                        }}
                    />
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Nama</span> <span>: {pengajar.nama}</span>
                        <span className="font-semibold">NIUP</span> <span>: {pengajar.niup}</span>
                        <span className="font-semibold">Umur</span> <span>: {pengajar.umur}</span>
                        <span className="font-semibold">Masa Kerja</span> <span>: {pengajar.masa_kerja}</span>
                    </div>
                    <div className="grid grid-cols-[auto_auto] gap-y-1">
                        <span className="font-semibold">Pangkalan Lembaga</span> <span>: {pengajar.lembaga}</span>
                        <span className="font-semibold">Golongan</span> <span>: {pengajar.golongan}</span>
                        <span className="font-semibold">Pendidikan Terakhir</span> <span>: {pengajar.pendidikan_terakhir}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};