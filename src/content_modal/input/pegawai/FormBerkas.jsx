import { useState } from "react";
import FileDropInput from "../../../components/FileDropInput";

const FormBerkasPegawai = ({ control, setValue, jenisBerkasList }) => {
    const [berkas, setBerkas] = useState([]);

    const handleRemove = (jenisId) => {
        setBerkas(prev => prev.filter(b => b.jenis_berkas_id !== jenisId));
        setValue(`file_${jenisId}`, null);
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
                    nameModal="modalPegawai"
                />
            );
        })}
    </div>
);

};

export default FormBerkasPegawai;
