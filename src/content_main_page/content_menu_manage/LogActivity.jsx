import { useState, Fragment, useEffect } from "react"
import SearchBar from "../../components/SearchBar"
import Filters from "../../components/Filters"
import { OrbitProgress } from "react-loading-indicators"
import Pagination from "../../components/Pagination"
import useFetchLogActivity from "../../hooks/hooks_menu_manage/LogActivity"
import { FaUser, FaClock, FaLink, FaTimes } from "react-icons/fa"
import { Dialog, Transition } from "@headlessui/react"
import { useLocation } from "react-router-dom"

const LogActivity = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedLog, setSelectedLog] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const location = useLocation()

    const { logs, loading, error, fetchLogs, limit, setLimit, totalPages, currentPage, setCurrentPage, totalData } = useFetchLogActivity()

    useEffect(() => {
        fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    const [filters, setFilters] = useState({
        log_name: "",
        event: "",
        causer_type: "",
    })

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const filterOptions = {
        log_name: [
            { label: "Semua Log", value: "" },
            { label: "Authentication", value: "auth" },
            { label: "Perizinan", value: "perizinan" },
            { label: "Pendidikan", value: "pendidikan" },
            { label: "Riwayat Pendidikan", value: "riwayat_pendidikan" },
            { label: "Catatan Afektif", value: "catatan_afektif" },
            { label: "Khadam Registration", value: "khadam_registration" },
        ],
        event: [
            { label: "Semua Event", value: "" },
            { label: "Login", value: "login" },
            { label: "Logout", value: "logout" },
            { label: "Created", value: "created" },
            { label: "Updated", value: "updated" },
            { label: "Deleted", value: "deleted" },
            { label: "Create Khadam", value: "create_khadam" },
        ],
        causer_type: [
            { label: "Semua Tipe User", value: "" },
            { label: "User", value: "App\\Models\\User" },
            { label: "Admin", value: "App\\Models\\Admin" },
            { label: "System", value: "System" },
        ],
    }

    // Enhanced time formatting
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime)
        const now = new Date()
        const diffInMinutes = Math.floor((now - date) / (1000 * 60))

        let relativeTime = ""
        if (diffInMinutes < 1) relativeTime = "Baru saja"
        else if (diffInMinutes < 60) relativeTime = `${diffInMinutes} menit yang lalu`
        else if (diffInMinutes < 1440) relativeTime = `${Math.floor(diffInMinutes / 60)} jam yang lalu`
        else relativeTime = `${Math.floor(diffInMinutes / 1440)} hari yang lalu`

        const absoluteDate = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })

        const absoluteTime = date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        })

        return {
            relative: relativeTime,
            date: absoluteDate,
            time: absoluteTime,
            full: `${absoluteDate} • ${absoluteTime}`,
        }
    }

    const openDetailModal = (log) => {
        setSelectedLog(log)
        setShowDetailModal(true)
    }

    const closeDetailModal = () => {
        setSelectedLog(null)
        setShowDetailModal(false)
    }

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Log Activity</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterOptions}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    showFilterButtons={false}
                    showViewButtons={false}
                    showSearch={false}
                    showLimit={false}
                />

                <div>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">Error: {error}</div>}

                    {/* Table Layout - Separated Log and Event */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                <tr>
                                    <th className="px-3 py-2 border-b">#</th>
                                    <th className="px-3 py-2 border-b">User</th>
                                    <th className="px-3 py-2 border-b">Log Name</th>
                                    <th className="px-3 py-2 border-b">Event</th>
                                    <th className="px-3 py-2 border-b">Description</th>
                                    <th className="px-3 py-2 border-b">Waktu</th>
                                    {/* <th className="px-3 py-2 border-b text-center">Aksi</th> */}
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, index) => {
                                        const timeInfo = formatDateTime(log.created_at)
                                        return (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-gray-50 whitespace-nowrap text-left cursor-pointer"
                                                onClick={() => openDetailModal(log)}
                                            >
                                                {/* ID Column */}
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * 15 + index + 1 || "-"}</td>

                                                {/* User Column */}
                                                <td className="px-3 py-2 border-b">
                                                    <div className="flex items-center gap-2">
                                                        <FaUser className="text-gray-500 text-xs flex-shrink-0" />
                                                        <span className="font-semibold">{log.causer_username}</span>
                                                    </div>
                                                </td>

                                                {/* Log Column */}
                                                <td className="px-3 py-2 border-b">
                                                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                                                        {log.log_name?.replace(/_/g, " ")}
                                                    </span>
                                                </td>

                                                {/* Event Column */}
                                                <td className="px-3 py-2 border-b">
                                                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 capitalize">
                                                        {log.event?.replace(/_/g, " ")}
                                                    </span>
                                                </td>


                                                {/* Description Column */}
                                                <td className="px-3 py-2 border-b">
                                                    <div className="max-w-xs">
                                                        <p className="truncate" title={log.description}>
                                                            {log.description}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Time Column */}
                                                <td className="px-3 py-2 border-b">
                                                    <div className="text-center">
                                                        <div className="flex items-center gap-1 justify-center mb-1">
                                                            <FaClock className="text-gray-400 text-xs" />
                                                            <span className="text-xs text-gray-500">{timeInfo.relative}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">{timeInfo.full}</div>
                                                    </div>
                                                </td>

                                                {/* Action Column */}
                                                {/* <td className="px-3 py-2 border-b text-center">
                          <div className="flex justify-center items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openDetailModal(log)
                              }}
                              className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td> */}
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    className="mt-6"
                />
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedLog && (
                <LogDetailModal isOpen={showDetailModal} log={selectedLog} onClose={closeDetailModal} />
            )}
        </div>
    )
}

// Detail Modal Component with Headless UI
const LogDetailModal = ({ isOpen, log, onClose }) => {
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime)
        return {
            date: date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            time: date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
        }
    }

    const timeInfo = formatDateTime(log.created_at)

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                {/* Background overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal content wrapper */}
                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-2xl sm:align-middle">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                                <FaTimes className="text-xl" />
                            </button>

                            {/* Header */}
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-2 sm:mt-0 text-left w-full">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mb-8">
                                            Detail Log Activity
                                        </Dialog.Title>

                                        {/* Content */}
                                        <div className="space-y-4">
                                            {/* ID & Log Type */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                        {log.causer_username}
                                                    </div>
                                                </div>
                                                {/* <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                        #{log.id}
                                                    </div>
                                                </div> */}
                                                {/* <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Log Type</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                        {log.log_name?.replace(/_/g, " ")}
                                                    </div>
                                                </div> */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                        {timeInfo.date} • {timeInfo.time}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Event & User */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Log Type</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                        {log.log_name?.replace(/_/g, " ")}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm capitalize">
                                                        {log.event?.replace(/_/g, " ")}
                                                    </div>
                                                </div>
                                                {/* <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                        {log.causer_username}
                                                    </div>
                                                </div> */}
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm leading-relaxed">
                                                    {log.description}
                                                </div>
                                            </div>

                                            {/* URL */}
                                            {log.properties?.url && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        <FaLink className="inline mr-1" />
                                                        Endpoint URL
                                                    </label>
                                                    <div className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 bg-blue-50 text-sm">
                                                        <code className="text-blue-600 break-all font-mono">{log.properties.url}</code>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Timestamp */}
                                            {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                                                <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                    {timeInfo.date} • {timeInfo.time}
                                                </div>
                                            </div> */}

                                            {/* Properties */}
                                            {log.properties && Object.keys(log.properties).length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Properties</label>
                                                    <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-sm">
                                                        <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                                                            {JSON.stringify(log.properties, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Button */}
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full cursor-pointer inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:w-auto sm:text-sm"
                                >
                                    Tutup
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default LogActivity
