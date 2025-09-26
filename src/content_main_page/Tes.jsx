// src/ExportCard.jsx
import { useRef, useState } from "react";
import backgorundCard from "../assets/kartu/kartu_depan.png";
import kartuBelakang from "../assets/kartu/kartu_belakang.png";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import useDropdownSantri from "../hooks/hook_dropdown/DropdownSantri";
import blankProfile from "../assets/blank_profile.png";


const ExportCard = () => {
    const cardRefs = useRef([]);
    const { menuSantri } = useDropdownSantri();
    const Santri = menuSantri.slice(1, 2);

    const [progress, setProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);


    // const handleExport = async () => {
    // if (!cardRef.current) return;

    // try {
    //     // Convert kartu depan (hasil render React)
    //     const depanDataUrl = await toPng(cardRef.current, {
    //         cacheBust: true,
    //         pixelRatio: 1.6,
    //     });

    //     // Fetch kartu belakang (langsung dari asset)
    //     const belakangBlob = await fetch(kartuBelakang).then((res) => res.blob());

    //     // Buat zip
    //     const zip = new JSZip();
    //     const folder = zip.folder("kartu");

    //     // Masukkan file kartu depan (base64 → file png)
    //     const base64Data = depanDataUrl.split(",")[1];
    //     folder.file("kartu_depan.png", base64Data, { base64: true });

    //     // Masukkan file kartu belakang (langsung blob)
    //     folder.file("kartu_belakang.png", belakangBlob);

    //     // Generate zip dan download
    //     const content = await zip.generateAsync({ type: "blob" });
    //     saveAs(content, `${"Saya"}-${"123325"}.zip`);
    // } catch (err) {
    //     console.error("Export gagal:", err);
    // }

    //     try {
    //         const zip = new JSZip();
    //         const folder = zip.folder("kartu");

    //         for (let i = 0; i < Santri.length; i++) {
    //             const santri = Santri[i];
    //             const cardEl = cardRefs.current[i];
    //             if (!cardEl) continue;

    //             const depanDataUrl = await toPng(cardEl, { cacheBust: true, pixelRatio: 1.6 });
    //             const base64Data = depanDataUrl.split(",")[1];
    //             folder.file(`${santri.label}-${santri.nis}-depan.png`, base64Data, { base64: true });

    //             // belakang sama untuk semua
    //             const belakangBlob = await fetch(kartuBelakang).then((res) => res.blob());
    //             folder.file(`${santri.label}-${santri.nis}-belakang.png`, belakangBlob);
    //         }

    //         const content = await zip.generateAsync({ type: "blob" });
    //         saveAs(content, "kartu-santri.zip");
    //     } catch (err) {
    //         console.error("Export gagal:", err);
    //     }
    // };

    // const handleExport = async () => {
    //     try {
    //         setIsExporting(true);
    //         setProgress(0);

    //         const zip = new JSZip();
    //         const folder = zip.folder("kartu");

    //         for (let i = 0; i < Santri.length; i++) {
    //             const santri = Santri[i];
    //             const cardEl = cardRefs.current[i];
    //             if (!cardEl) continue;

    //             const depanDataUrl = await toPng(cardEl, { cacheBust: true, pixelRatio: 1.6 });
    //             const base64Data = depanDataUrl.split(",")[1];
    //             folder.file(`${santri.label}-${santri.nis}-depan.png`, base64Data, { base64: true });

    //             // belakang sama untuk semua
    //             const belakangBlob = await fetch(kartuBelakang).then((res) => res.blob());
    //             folder.file(`${santri.label}-${santri.nis}-belakang.png`, belakangBlob);

    //             // update progress tiap selesai 1 santri
    //             setProgress(Math.round(((i + 1) / Santri.length) * 100));
    //         }

    //         const content = await zip.generateAsync({ type: "blob" });
    //         saveAs(content, "kartu-santri.zip");

    //     } catch (err) {
    //         console.error("Export gagal:", err);
    //     } finally {
    //         setIsExporting(false);
    //     }
    // };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            setProgress(0);

            const batchSize = 25; // jumlah data per file
            const totalBatches = Math.ceil(Santri.length / batchSize);

            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const zip = new JSZip();
                const folder = zip.folder("kartu");

                // ambil slice data sesuai batch
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, Santri.length);
                const batchSantri = Santri.slice(start, end);

                for (let i = 0; i < batchSantri.length; i++) {
                    const santri = batchSantri[i];
                    const cardEl = cardRefs.current[start + i]; // ambil element sesuai index global
                    if (!cardEl) continue;

                    const depanDataUrl = await toPng(cardEl, { cacheBust: true, pixelRatio: 1.6 });
                    const base64Data = depanDataUrl.split(",")[1];
                    folder.file(`${santri.label}-${santri.nis}-depan.png`, base64Data, { base64: true });

                    // update progress (global)
                    const processed = start + i + 1;
                    setProgress(Math.round((processed / Santri.length) * 100));
                }

                // generate zip untuk batch ini
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `kartu-santri-batch-${batchIndex + 1}.zip`);
            }

        } catch (err) {
            console.error("Export gagal:", err);
        } finally {
            setIsExporting(false);
        }
    };


    const tes = () => {
        console.log(menuSantri);

    }

    // const handleExportPdf = async () => {
    //     if (!cardRefs.current) return;

    //     try {
    //         const depanDataUrl = await toPng(cardRefs.current, {
    //             cacheBust: true,
    //             pixelRatio: 2, // biar tajam
    //         });

    //         const belakangDataUrl = await fetch(kartuBelakang)
    //             .then((res) => res.blob())
    //             .then(
    //                 (blob) =>
    //                     new Promise((resolve) => {
    //                         const reader = new FileReader();
    //                         reader.onloadend = () => resolve(reader.result);
    //                         reader.readAsDataURL(blob);
    //                     })
    //             );

    //         // Konversi pixel ke mm (72 dpi jsPDF)
    //         const pxToMm = (px) => (px * 25.4) / 96; // 96 dpi browser
    //         const widthMm = pxToMm(632);
    //         const heightMm = pxToMm(399);

    //         const pdf = new jsPDF({
    //             orientation: "landscape",
    //             unit: "mm",
    //             format: [widthMm, heightMm],
    //         });

    //         // Page 1 = kartu depan
    //         pdf.addImage(depanDataUrl, "PNG", 0, 0, widthMm, heightMm);

    //         // Page 2 = kartu belakang
    //         pdf.addPage([widthMm, heightMm], "landscape");
    //         pdf.addImage(belakangDataUrl, "PNG", 0, 0, widthMm, heightMm);

    //         pdf.save(`${"nama"}-${"12345678"}.pdf`);
    //     } catch (err) {
    //         console.error("Export PDF gagal:", err);
    //     }
    // };

    const handleExportPdf = async () => {
        try {
            const pxToMm = (px) => (px * 25.4) / 96;
            const widthMm = pxToMm(632);
            const heightMm = pxToMm(399);

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [widthMm, heightMm],
            });

            for (let i = 0; i < cardRefs.current.length; i++) {
                const cardEl = cardRefs.current[i];
                if (!cardEl) continue;

                const depanDataUrl = await toPng(cardEl, {
                    cacheBust: true,
                    pixelRatio: 2,
                    useCors: true,
                });

                if (i > 0) {
                    pdf.addPage([widthMm, heightMm], "landscape");
                }
                pdf.addImage(depanDataUrl, "PNG", 0, 0, widthMm, heightMm);

                // kalau tiap kartu juga perlu halaman belakang
                pdf.addPage([widthMm, heightMm], "landscape");
                pdf.addImage(kartuBelakang, "PNG", 0, 0, widthMm, heightMm);
            }

            pdf.save("kartu-santri.pdf");
        } catch (err) {
            console.error("Export PDF gagal:", err);
        }
    };


    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                {Santri.map((santri, idx) => (
                    <div
                        key={santri.id}
                        ref={(el) => (cardRefs.current[idx] = el)}
                        className="relative w-[632px] h-[399px] shadow-lg overflow-hidden mb-6"
                    >
                        <img
                            src={backgorundCard}
                            alt="Template"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        <div className="absolute inset-x-0 gap-x-6 grid grid-cols-[auto_auto] items-center h-full w-full text-lg pl-12 pr-8 pb-8 pt-12">
                            {/* Foto */}
                            <div className="flex justify-center">
                                <img
                                    alt="Foto"
                                    src={"http://127.0.0.1:8000/storage/formulir/8RWAuPaTPbeCXGwbRocTwSK7BxePsIXgh0UTiWJv.png?1758784287159"}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null; // supaya tidak loop
                                        e.currentTarget.src = blankProfile;
                                    }}
                                    className="w-33 h-45 object-cover mb-3 rounded-xl border-2 border-[#2c9688]"
                                />
                            </div>

                            {/* Data */}
                            <div className="grid grid-cols-[max-content_auto] items-start">
                                <div className="flex flex-col [font-family:'Poppins',sans-serif] items-start pr-1">
                                    <p className="font-medium text-lg">Nama</p>
                                    <p className="font-medium text-lg">NIS</p>
                                    <p className="font-medium text-lg">TTL</p>
                                    <p className="font-medium text-lg">Alamat</p>
                                </div>
                                <div className="flex flex-col [font-family:'Poppins',sans-serif] items-start pl-2">
                                    <p className="font-semibold text-lg">: {santri.label}</p>
                                    <p className="font-semibold text-lg">: {santri.nis}</p>
                                    <p className="font-semibold text-lg">: {santri.tempat_lahir}, {santri.tanggal_lahir}</p>
                                    <p className="font-semibold text-lg">: {`${santri.jalan}, ${santri.kecamatan}, ${santri.kabupaten}, ${santri.provinsi}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Export Button */}
            <button
                onClick={tes}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
            >
                data santri
            </button>
            <button
                onClick={handleExport}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Export PNG
            </button>
            <button
                onClick={handleExportPdf}
                className="px-4 py-2 bg-green-600 text-white rounded"
            >
                Export PDF
            </button>
            <button
                onClick={handleExport}
                disabled={isExporting}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {isExporting ? "Exporting..." : "Export PNG"}
            </button>

            {/* Progress Bar */}
            {isExporting && (
                <div className="w-1/2 bg-gray-300 rounded h-4 mt-4 mx-auto">
                    <div
                        className="bg-green-500 h-4 rounded transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
            {isExporting && <p className="mt-2 text-sm text-gray-600">{progress}%</p>}
        </div>
    );
};

export default ExportCard;
