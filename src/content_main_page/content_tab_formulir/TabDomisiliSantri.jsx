import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../hooks/config";
import { useParams } from "react-router-dom";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import Swal from "sweetalert2";
import ModalPindahDomisili from "../../components/ModalFormPindahDomisili";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";




const TabDomisiliSantri = () => {
    const { biodata_id } = useParams();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();

    const [formData, setFormData] = useState({
        wilayah: "",
        blok: "",
        kamar: "",
        waktuMulai: "",
        waktuAkhir: "",
    });

    const [riwayatDomisili, setRiwayatDomisili] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null); // null = create mode, id = edit mode

    const fetchDomisili = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}formulir/${biodata_id}/domisili`);
            const json = await res.json();
            const data = Array.isArray(json.data) ? json.data : [json.data];
            setRiwayatDomisili(data);
        } catch (err) {
            console.error("Gagal memuat data:", err);
        }
    };

    useEffect(() => {
        if (biodata_id) fetchDomisili();
    }, [biodata_id]);

    const fetchDomisiliDetail = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}formulir/${id}/domisili/show`);
            const json = await res.json();
            const data = json.data;

            setFormData({
                wilayah: data.nama_wilayah || "",
                blok: data.nama_blok || "",
                kamar: data.nama_kamar || "",
                waktuMulai: data.tanggal_masuk?.slice(0, 10) || "",
                waktuAkhir: data.tanggal_keluar?.slice(0, 10) || "",
            });

            setEditId(id);
            setShowForm(true);
        } catch (err) {
            console.error("Gagal ambil detail domisili:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `${API_BASE_URL}formulir/${editId}/domisili`
            : `${API_BASE_URL}formulir/${biodata_id}/domisili`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wilayah: formData.wilayah,
                    blok: formData.blok,
                    kamar: formData.kamar,
                    waktu_mulai: formData.waktuMulai,
                    waktu_akhir: formData.waktuAkhir,
                }),
            });

            const json = await res.json();
            if (json.success || json.status === "success") {
                alert(editId ? "Berhasil diperbarui!" : "Berhasil dibuat!");
                setShowForm(false);
                setEditId(null);
                setFormData({
                    wilayah: "",
                    blok: "",
                    kamar: "",
                    waktuMulai: "",
                    waktuAkhir: "",
                });
                fetchDomisili();
            } else {
                alert("Gagal menyimpan data.");
            }
        } catch (err) {
            console.error("Gagal simpan:", err);
            alert("Terjadi kesalahan.");
        }
    };

    // const handleDelete = async (id) => {
    //     if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    //     try {
    //         const res = await fetch(`${API_BASE_URL}formulir/${id}/domisili`, {
    //             method: "DELETE",
    //         });
    //         const json = await res.json();
    //         if (json.success || json.status === "success") {
    //             alert("Data berhasil dihapus!");
    //             fetchDomisili();
    //         } else {
    //             alert("Gagal menghapus data.");
    //         }
    //     } catch (err) {
    //         console.error("Gagal hapus data:", err);
    //         alert("Terjadi kesalahan saat menghapus.");
    //     }
    // };

    const handleAddNew = () => {
        setFormData({
            wilayah: "",
            blok: "",
            kamar: "",
            waktuMulai: "",
            waktuAkhir: "",
        });
        setEditId(null);
        setShowForm(true);
    };

    const handleKeluarDomisili = async (id) => {
        Swal.fire({
            title: 'Masukkan Tanggal Keluar',
            html: `
                <input type="date" id="tanggalKeluarInput" class="swal2-input" style="width: 80%;" />
            `,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const input = document.getElementById('tanggalKeluarInput').value;
                if (!input) {
                    Swal.showValidationMessage('Tanggal keluar wajib diisi');
                }
                return input;
            }
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const tanggalKeluar = result.value;

            try {
                const res = await fetch(`${API_BASE_URL}formulir/${id}/domisili`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ waktu_akhir: tanggalKeluar }),
                });

                const json = await res.json();

                if (json.success || json.status === "success") {
                    Swal.fire('Berhasil', 'Tanggal keluar berhasil diupdate.', 'success');
                    fetchDomisili();
                } else {
                    Swal.fire('Gagal', json.message || 'Gagal memperbarui tanggal keluar.', 'error');
                }
            } catch (err) {
                Swal.fire('Error', `Terjadi kesalahan saat mengirim data ${err.message}.`, 'error');
            }
        });
    };

    const handlePindahDomisili = (id) => {
        handleAddNew(); // Open form kosong
        setFormData((prev) => ({
            ...prev,
            waktuMulai: new Date().toISOString().slice(0, 10),
        }));


    };

    const [showFormModal, setShowFormModal] = useState(false);

    return (
        <div>
            <h1 className="text-xl font-bold">Domisili Santri</h1>

            <button
                onClick={handleAddNew}
                className="mt-4 mb-2 px-4 py-2 bg-green-600 text-white rounded"
            >
                Tambah Domisili Baru
            </button>

            {riwayatDomisili.length > 0 ? (
                <ul className="divide-y divide-gray-300 bg-white rounded-lg shadow">
                    {riwayatDomisili.map((item) => (
                        <li key={item.id} className="px-4 py-3 space-y-2">
                            <div
                                className="cursor-pointer"
                                onClick={() => fetchDomisiliDetail(item.id)}
                            >
                                <p className="font-semibold text-gray-800">
                                    {item.nama_wilayah || "-"} - ({item.nama_kamar})
                                </p>
                                <p className="text-sm text-gray-600">
                                    Sejak {new Date(item.tanggal_masuk).toLocaleDateString("id-ID", { dateStyle: "medium" })} Sampai{" "}
                                    {item.tanggal_keluar
                                        ? new Date(item.tanggal_keluar).toLocaleDateString("id-ID", {
                                            dateStyle: "medium",
                                        })
                                        : "Sekarang"}
                                </p>
                                <span
                                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${!item.tanggal_keluar ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {!item.tanggal_keluar ? "Aktif" : "Tidak Aktif"}
                                </span>


                            </div>

                            <div className="flex flex-wrap gap-2">
                                {/* <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Hapus
                                </button> */}
                                {!item.tanggal_keluar && (
                                    <>
                                     <button
                                            onClick={() => setShowFormModal(true)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Pindah"
                                        >
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                                        </button>
                                        <button
                                            onClick={() => handleKeluarDomisili(item.id)}
                                            className="text-yellow-600 hover:text-yellow-800 mr-2"
                                            title="Keluar"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                                        </button>
                                    </>

                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-2">Belum ada data domisili.</p>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-gray-50 p-4 rounded shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Wilayah</label>
                            <select
                                className={`w-full border border-gray-300 rounded p-2 ${filterWilayah.wilayah.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                    }`}
                                value={formData.wilayah || selectedWilayah.wilayah || ""}
                                onChange={(e) => {
                                    setFormData({ ...formData, wilayah: e.target.value });
                                    handleFilterChangeWilayah({ wilayah: e.target.value });
                                }}
                                disabled={filterWilayah.wilayah.length <= 1}
                                required
                            >
                                <option value="">-- Pilih Wilayah --</option>
                                {filterWilayah.wilayah.map((option, idx) => (
                                    <option key={idx} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Blok</label>
                            <select
                                className={`w-full border border-gray-300 rounded p-2 ${filterWilayah.blok.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                    }`}
                                value={formData.blok || selectedWilayah.blok || ""}
                                onChange={(e) => {
                                    setFormData({ ...formData, blok: e.target.value });
                                    handleFilterChangeWilayah({ blok: e.target.value });
                                }}
                                disabled={filterWilayah.blok.length <= 1}
                                required
                            >
                                <option value="">-- Pilih Blok --</option>
                                {filterWilayah.blok.map((option, idx) => (
                                    <option key={idx} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Kamar</label>
                            <select
                                className={`w-full border border-gray-300 rounded p-2 ${filterWilayah.kamar.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                    }`}
                                value={formData.kamar || selectedWilayah.kamar || ""}
                                onChange={(e) => {
                                    setFormData({ ...formData, kamar: e.target.value });
                                    handleFilterChangeWilayah({ kamar: e.target.value });
                                }}
                                disabled={filterWilayah.kamar.length <= 1}
                                required
                            >
                                <option value="">-- Pilih Kamar --</option>
                                {filterWilayah.kamar.map((option, idx) => (
                                    <option key={idx} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <TextInput
                            label="Waktu Mulai"
                            type="date"
                            value={formData.waktuMulai}
                            onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                            required
                        />

                        <TextInput
                            label="Waktu Akhir"
                            type="date"
                            value={formData.waktuAkhir}
                            onChange={(e) => setFormData({ ...formData, waktuAkhir: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-start gap-2 mt-1">
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            onClick={() => {
                                setShowForm(false);
                                setEditId(null);
                            }}
                        >
                            Batal
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                            Simpan
                        </button>
                    </div>
                </form>
            )}

            {showFormModal && (
                <ModalPindahDomisili isOpen={showFormModal} onClose={() => setShowFormModal(false)} formData={formData} setFormData={setFormData} filterWilayah={filterWilayah} handleFilterChangeWilayah={handleFilterChangeWilayah} handleSubmit={handleSubmit} selectedWilayah={selectedWilayah} setEditId={setEditId} />
            )}
        </div>
    );
};

const TextInput = ({ label, value, onChange, type = "text", required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            className="mt-1 block w-full p-2 border rounded-md"
            value={value}
            onChange={onChange}
            required={required}
        />
    </div>
);

export default TabDomisiliSantri;
