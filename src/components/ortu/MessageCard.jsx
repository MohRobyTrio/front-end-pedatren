"use client"

import { useState } from "react"
import { MoreVertical, Edit2, Trash2, Eye, EyeOff, Calendar } from "lucide-react"

export const MessageCard = ({ message, onEdit, onDelete, onToggleRead }) => {
    const [showMenu, setShowMenu] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        studentName: message.studentName,
        subject: message.subject,
        content: message.content,
    })

    const handleEdit = () => {
        onEdit(message.id, editData)
        setIsEditing(false)
        setShowMenu(false)
    }

    const handleCancel = () => {
        setEditData({
            studentName: message.studentName,
            subject: message.subject,
            content: message.content,
        })
        setIsEditing(false)
    }

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <div
            className={`bg-white rounded-lg shadow-sm transition-all duration-200 ${!message.isRead
                ? "border-l-4 border-l-emerald-500 bg-emerald-50/30"
                : "border border-gray-200"
                }`}
        >

            <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        {/* {isEditing ? (
                            <input
                                type="text"
                                value={editData.subject}
                                onChange={(e) => setEditData((prev) => ({ ...prev, subject: e.target.value }))}
                                className="w-full text-lg font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-emerald-500 focus:outline-none pb-1"
                            />
                        ) : ( */}
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{message.subject}</h3>
                        {/* )} */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                            {/* <div className="flex items-center gap-1 text-sm text-gray-600">
                                <User className="h-4 w-4 flex-shrink-0" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.studentName}
                                        onChange={(e) => setEditData((prev) => ({ ...prev, studentName: e.target.value }))}
                                        className="bg-transparent border-b border-gray-300 focus:border-emerald-500 focus:outline-none"
                                    />
                                ) : (
                                    <span className="font-medium">{message.studentName}</span>
                                )}
                            </div> */}
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                <span>{formatDate(message.sentAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${message.isRead ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                }`}
                        >
                            {message.isRead ? "Dibaca" : "Belum Dibaca"}
                        </div>

                        <div className="relative">
                            {!message.isRead && (
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                </button>
                            )}

                            {showMenu && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]">
                                    <button
                                        onClick={() => {
                                            onToggleRead(message.id)
                                            setShowMenu(false)
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        {message.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        {message.isRead ? "Tandai Belum Dibaca" : "Tandai Dibaca"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(true)
                                            setShowMenu(false)
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(message.id)
                                            setShowMenu(false)
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Hapus
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    {isEditing ? (
                        <textarea
                            value={editData.content}
                            onChange={(e) => setEditData((prev) => ({ ...prev, content: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none"
                            rows={4}
                        />
                    ) : (
                        <p
                            className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line break-words max-w-full"
                            style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                        >
                            {message.content}
                        </p>
                    )}
                </div>

                {isEditing && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                        >
                            Simpan
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            Batal
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}