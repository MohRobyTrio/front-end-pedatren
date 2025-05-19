import { useState } from "react";
import FileDropInput from "../../../components/FileDropInput";

const FormBerkas = ({ control, setValue, jenisBerkasList }) => {
    const [berkas, setBerkas] = useState([]);

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     const formData = new FormData();

    //     berkas.forEach((item, i) => {
    //         formData.append(`berkas[${i}][jenis_berkas_id]`, item.jenis_berkas_id);
    //         formData.append(`berkas[${i}][file_path]`, item.file_path);
    //     });

    //     onSubmit(formData);
    // };

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
                />
            );
        })}
    </div>
);

};

export default FormBerkas;
