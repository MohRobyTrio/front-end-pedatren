"use client"

import { Fragment, useState, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { FaTimes, FaFileDownload, FaFileUpload, FaCheckCircle } from "react-icons/fa"
import { API_BASE_URL } from "../../hooks/config"
import { getCookie } from "../../utils/cookieUtils"
import Swal from "sweetalert2"

const ModalImport = ({
    isOpen,
    onClose,
    onSuccess,
    title = "Import Data",
    endpoint = "import/pesertadidik",
    templateUrl = "/template/santri_import_test.xlsx",
    templateName = "template_import.xlsx",
    instructions = [
        "Download template terlebih dahulu",
        "Isi data sesuai format template (header di baris 2)",
        "Jangan mengubah nama kolom/header",
        "Upload file yang sudah diisi",
        "Klik 'Import Data' untuk memproses",
    ],
}) => {
    const [file, setFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleDownloadTemplate = () => {
        const link = document.createElement("a")
        link.href = templateUrl
        link.download = templateName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (!selectedFile) return

        // Validasi tipe file
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "text/csv",
        ]

        if (!allowedTypes.includes(selectedFile.type)) {
            Swal.fire({
                icon: "error",
                title: "File Tidak Valid",
                text: "Tipe file tidak didukung. Gunakan file Excel (.xlsx, .xls) atau CSV",
                confirmButtonColor: "#3085d6",
            })
            return
        }

        setFile(selectedFile)
    }

    const handleImport = async () => {
        if (!file) {
            Swal.fire({
                icon: "warning",
                title: "File Belum Dipilih",
                text: "Silakan pilih file terlebih dahulu",
                confirmButtonColor: "#3085d6",
            })
            return
        }

        // Konfirmasi sebelum import
        const confirmResult = await Swal.fire({
            title: "Konfirmasi Import",
            text: `Apakah Anda yakin ingin mengimport file "${file.name}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Import!",
            cancelButtonText: "Batal",
        })

        if (!confirmResult.isConfirmed) return

        setIsUploading(true)

        // Show loading
        Swal.fire({
            title: "Mengimport Data...",
            text: "Mohon tunggu, sedang memproses file Anda",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
            },
        })

        try {
            const formData = new FormData()
            formData.append("file", file)

            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            const result = await response.json()

            if (response.ok) {
                // Success
                await Swal.fire({
                    icon: "success",
                    title: "Import Berhasil!",
                    text: result.message || "Data berhasil diimport!",
                    confirmButtonColor: "#3085d6",
                    timer: 3000,
                    timerProgressBar: true,
                })

                onSuccess?.()
                handleClose()
            } else {
                // Error from API
                await Swal.fire({
                    icon: "error",
                    title: "Import Gagal",
                    text: result.error || "Gagal mengimport data",
                    confirmButtonColor: "#3085d6",
                })
            }
        } catch (error) {
            // Network or other errors
            await Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: `Error: ${error.message}`,
                confirmButtonColor: "#3085d6",
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleClose = () => {
        if (isUploading) {
            Swal.fire({
                icon: "warning",
                title: "Proses Sedang Berjalan",
                text: "Mohon tunggu hingga proses import selesai",
                confirmButtonColor: "#3085d6",
            })
            return
        }

        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        onClose()
    }

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const files = e.dataTransfer.files
        if (files.length > 0) {
            const droppedFile = files[0]

            // Validasi tipe file
            const allowedTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
                "text/csv",
            ]

            if (!allowedTypes.includes(droppedFile.type)) {
                Swal.fire({
                    icon: "error",
                    title: "File Tidak Valid",
                    text: "Tipe file tidak didukung. Gunakan file Excel (.xlsx, .xls) atau CSV",
                    confirmButtonColor: "#3085d6",
                })
                return
            }

            setFile(droppedFile)
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isUploading}
                                    >
                                        <FaTimes className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="space-y-6">
                                    {/* Download Template */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <FaFileDownload className="h-6 w-6 text-blue-600 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-blue-900 mb-1">Download Template</h4>
                                                <p className="text-sm text-blue-700 mb-3">
                                                    Unduh template Excel terlebih dahulu sebelum mengimport data
                                                </p>
                                                <button
                                                    onClick={handleDownloadTemplate}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                    disabled={isUploading}
                                                >
                                                    <FaFileDownload className="h-4 w-4 mr-2" />
                                                    Download Template
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* File Upload */}
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">Upload File Excel/CSV</label>
                                        <div
                                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
                                            onDragOver={handleDragOver}
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <div className="space-y-1 text-center">
                                                <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Upload file</span>
                                                        <input
                                                            ref={fileInputRef}
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept=".xlsx,.xls,.csv"
                                                            onChange={handleFileChange}
                                                            disabled={isUploading}
                                                        />
                                                    </label>
                                                    <p className="pl-1">atau drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">Excel atau CSV hingga 10MB</p>
                                            </div>
                                        </div>

                                        {file && (
                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                                                <div className="flex items-center space-x-2">
                                                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                                                    <span className="font-medium text-gray-900">{file.name}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Ukuran: {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Instructions */}
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-yellow-900 mb-2">Petunjuk Import</h4>
                                        <ul className="text-sm text-yellow-800 space-y-1">
                                            {instructions.map((instruction, index) => (
                                                <li key={index}>• {instruction}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 space-x-3">
                                    <button
                                        onClick={handleClose}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        disabled={isUploading}
                                    >
                                        Batal
                                    </button>

                                    <button
                                        onClick={handleImport}
                                        disabled={isUploading || !file}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isUploading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Mengimport...
                                            </>
                                        ) : (
                                            "Import Data"
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalImport
