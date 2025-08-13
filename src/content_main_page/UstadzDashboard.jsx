import { useState } from "react";
import { API_BASE_URL } from "../hooks/config";

export default function NFCScanner() {
    const [status, setStatus] = useState("Tempelkan kartu NFC...");
    const [scanning, setScanning] = useState(false);

    const startScan = async () => {
        if (!("NDEFReader" in window)) {
            alert("Web NFC tidak didukung di browser ini. Gunakan Chrome Android 89+");
            return;
        }

        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            setScanning(true);
            setStatus("Silakan tempelkan kartu NFC...");

            ndef.addEventListener("reading", async ({ serialNumber, message }) => {
                console.log("UID Kartu (Hex):", serialNumber);

                // --- Konversi serialNumber Hex ke Decimal ---
                // serialNumber contoh: "2F:8B:29:2B"
                let uidDecimal = null;
                try {
                    // Hapus semua tanda ':'
                    const bytes = serialNumber.split(":");      // ["2F","8B","29","2B"]
                    const reversed = bytes.reverse().join("");  // "2B298B2F" (little-endian)
                    const uidDecimal = BigInt("0x" + reversed).toString(10); // konversi ke desimal
                    alert("UID Kartu (Decimal): " + uidDecimal);
                } catch (e) {
                    alert("Gagal konversi UID ke desimal: " + e);
                    uidDecimal = serialNumber; // fallback
                }


                // let angkaRFID = null;

                // for (const record of message.records) {
                //     if (record.recordType == "text") {
                //         const textDecoder = new TextDecoder(record.encoding);
                //         angkaRFID = textDecoder.decode(record.data).trim(); // hapus spasi
                //     }
                // }

                // if (angkaRFID) {
                //     alert(`Data angka dari kartu: ${angkaRFID} | UID Desimal: ${uidDecimal}`);
                // } else {
                //     alert(`Tidak ada data angka di kartu, UID Desimal: ${uidDecimal}`);
                // }

                setScanning(false);

                // Kirim ke API
                try {
                    const res = await fetch(`${API_BASE_URL}presensi/cari-santri`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            card_id: uidDecimal, // gunakan desimal
                        }),
                    });

                    const data = await res.json();
                    console.log("Presensi sukses:", data);
                    setStatus(`Presensi sukses: ${data.message || "Berhasil"}`);
                } catch (err) {
                    console.error("Gagal kirim ke API:", err);
                    setStatus("Gagal mengirim data ke API");
                }
            });


        } catch (error) {
            console.error("Gagal memulai NFC:", error);
            setStatus("Gagal memulai NFC: " + error);
        }
    };

    return (
        <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-4">Scan Kartu NFC</h2>
            <p className="mb-4">{status}</p>
            <button
                onClick={startScan}
                disabled={scanning}
                className={`px-4 py-2 rounded text-white ${scanning ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {scanning ? "Scanning..." : "Mulai Scan NFC"}
            </button>
        </div>
    );
}
