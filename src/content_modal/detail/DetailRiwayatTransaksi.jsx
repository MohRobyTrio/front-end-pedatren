const formatRupiah = (number) => {
    if (number === null || number === undefined) return "-";
    const parsedNumber = parseFloat(number);
    if (isNaN(parsedNumber)) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(parsedNumber);
};

const DetailRiwayatTransaksi = ({ riwayat }) => {
    if (!riwayat || riwayat.length === 0) {
        return (
            <p className="h-40 flex items-center justify-center text-gray-500">
                Tidak ada riwayat transaksi.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                    <tr>
                        <th className="px-3 py-2 border-b">#</th>
                        <th className="px-3 py-2 border-b">UID Kartu</th>
                        <th className="px-3 py-2 border-b">Outlet & Kategori</th>
                        <th className="px-3 py-2 border-b">Tipe</th>
                        <th className="text-right px-3 py-2 border-b">Jumlah</th>
                        <th className="px-3 py-2 border-b">Keterangan</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800">
                    {riwayat?.map((trx, i) => (
                        <tr key={trx.id} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                            <td className="px-3 py-2 border-b align-middle">{i + 1}</td>
                            <td className="p-3 align-middle border-b">
                                {trx.uid_kartu || "-"}
                            </td>
                            <td className="p-3 align-middle border-b">
                                <div className="font-semibold text-gray-800">{trx.nama_outlet}</div>
                                <div className="text-xs text-gray-500">{trx.nama_kategori}</div>
                            </td>
                            <td className="p-3 align-middle border-b">
                                <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${trx.tipe === 'debit' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {trx.tipe}
                                </span>
                            </td>
                            <td className={`p-3 border-b text-right font-mono font-semibold align-middle ${trx.tipe === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                                {trx.tipe === 'debit' ? '-' : '+'}
                                {formatRupiah(trx.jumlah)}
                            </td>
                            <td className="p-3 align-middle border-b">
                                {trx.keterangan || "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DetailRiwayatTransaksi;