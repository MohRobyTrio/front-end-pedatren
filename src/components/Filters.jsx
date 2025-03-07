const Filters = ({ showFilters }) => {
    if (!showFilters) return null;

    const filterOptions = [
        "Semua Negara", "Semua Wilayah", "Semua Lembaga", "Semua Provinsi",
        "Semua Blok", "Semua Jurusan", "Semua Status", "Semua Kabupaten",
        "Semua Kamar", "Semua Kelas", "Semua Angkatan Pelajar", "Semua Kecamatan",
        "Semua Rombel", "Semua Angkatan Santri", "Warga Pesantren", "Smartcard",
        "Phone Number", "Urut Berdasarkan", "Urut Secara", "25"
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
            {filterOptions.map((option, index) => (
                <select key={index} className="border border-gray-300 rounded p-2">
                    <option>{option}</option>
                </select>
            ))}
        </div>
    );
};

export default Filters;
