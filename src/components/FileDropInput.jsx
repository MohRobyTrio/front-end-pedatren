import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller } from "react-hook-form";

const FileDropInput = ({ id, label, required, selected, onRemove, onFileChange, control }) => {
    const handleChange = (e, onChange) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB");
            return;
        }
        onFileChange(file);
        onChange(file); // penting: beritahu react-hook-form
    };

    const handleDrop = (e, onChange) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB");
            return;
        }
        onFileChange(file);
        onChange(file); // penting: beritahu react-hook-form
    };

    return (
        <Controller
            control={control}
            name={`file_${id}`}
            rules={{ required: required && !selected }}
            defaultValue={null}
            render={({ field, fieldState }) => (
                <div className="p-4 rounded-xl border shadow-sm bg-white">
                    <label className="block text-sm font-semibold mb-2">
                        {label} {required && <span className="text-red-500">* Wajib</span>}
                    </label>

                    <div className="flex flex-col w-full">
                        <label
                            htmlFor={`dropzone-${id}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, field.onChange)}
                            className={`relative flex flex-col items-center justify-center w-full aspect-[4/3] min-h-[150px] cursor-pointer ${selected ? '' : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg'}`}
                        >
                            {selected ? (
                                selected.file_path.type.startsWith("image") ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={selected.preview}
                                            alt={label}
                                            className="h-full object-contain w-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => onRemove(id)}
                                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <p className="text-sm font-semibold">File PDF telah diunggah</p>
                                        <p className="text-blue-600 underline">Klik untuk ganti</p>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF, JPG, PNG (max 2MB)</p>
                                </div>
                            )}

                            <input
                                id={`dropzone-${id}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required={required && !selected}
                                onChange={(e) => handleChange(e, field.onChange)}
                                className="hidden"
                            />
                        </label>
                        {fieldState.invalid && (
                            <p className="text-red-500 text-sm mt-1">Berkas ini wajib diunggah.</p>
                        )}
                    </div>
                </div>
            )}
        />
    );
};

export default FileDropInput;