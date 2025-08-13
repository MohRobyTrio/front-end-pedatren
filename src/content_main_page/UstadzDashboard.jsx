    import { useState } from "react";

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

        ndef.addEventListener("reading", async ({ serialNumber }) => {
            console.log("NFC Serial:", serialNumber);
            setStatus(`Kartu terbaca: ${serialNumber}`);
            setScanning(false);

            // Kirim ke API presensi
            try {
            const res = await fetch("http://localhost:8000/api/presensi/cari-santri", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // opsional
                },
                body: JSON.stringify({ card_id: serialNumber }),
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
            className={`px-4 py-2 rounded text-white ${
            scanning ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
            {scanning ? "Scanning..." : "Mulai Scan NFC"}
        </button>
        </div>
    );
    }
