import { useEffect, useState } from "react";
import FileDropInput from "../../../components/FileDropInput";
import { useWatch } from "react-hook-form";

const FormBerkasPeserta = ({ control, setValue, jenisBerkasList }) => {
    const [berkas, setBerkas] = useState([]);

    const watchedFiles = useWatch({
        control,
        name: jenisBerkasList.map(({ id }) => `modalPeserta.file_${id}`)
    });

    useEffect(() => {
        if (!watchedFiles) return;

        const updated = jenisBerkasList.map(({ id }, index) => {
            const file = watchedFiles[index];
            if (file) {
                return {
                    jenis_berkas_id: id,
                    file_path: file,
                    preview: URL.createObjectURL(file),
                };
            }
            return null;
        }).filter(Boolean);

        setBerkas(updated);

        // Clean up previous object URLs to avoid memory leak
        return () => {
            updated.forEach((b) => URL.revokeObjectURL(b.preview));
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watchedFiles)]); // safely compare content

    const handleRemove = (jenisId) => {
        setBerkas(prev => prev.filter(b => b.jenis_berkas_id !== jenisId));
        setValue(`modalPeserta.file_${jenisId}`, null);
    };

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jenisBerkasList.map(({ id, label, required }) => {
            const selected = berkas.find(b => b.jenis_berkas_id === id);

            return (
                <FileDropInput
                    key={id}
                    id={id}
                    label={label}
                    required={required}
                    selected={selected}
                    onRemove={handleRemove}
                    onFileChange={(file) => {
                        const updated = berkas.filter(b => b.jenis_berkas_id !== id);
                        updated.push({
                            jenis_berkas_id: id,
                            file_path: file,
                            preview: URL.createObjectURL(file),
                        });
                        setBerkas(updated);
                    }}
                    control={control}
                    nameModal="modalPeserta"
                />
            );
        })}
    </div>
);

};

export default FormBerkasPeserta;
