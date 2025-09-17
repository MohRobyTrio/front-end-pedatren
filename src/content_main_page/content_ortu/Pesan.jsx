"use client"

import { Filter, MessageSquare, Plus } from "lucide-react"
import { useState } from "react"
import { NewMessageForm } from "../../components/ortu/NewMessageForm"
import { MessageCard } from "../../components/ortu/MessageCard"


const initialMessages = [
    {
        id: "1",
        content:
            "Assalamu'alaikum Ahmad. Mohon diingat bahwa kegiatan tahfidz dimulai pukul 07:00 WIB besok pagi. Jangan lupa membawa Al-Quran dan buku catatan.",
        isRead: false,
        sentAt: new Date("2025-01-15T10:30:00"),
    },
    {
        id: "2",
        content:
            "Assalamu'alaikum Siti. Reminder bahwa tugas hafalan hadits 40 Nawawi harus diselesaikan minggu ini. Silakan hubungi saya jika ada kesulitan.",
        isRead: true,
        sentAt: new Date("2025-01-14T15:45:00"),
    },
    {
        id: "3",
        content:
            "Assalamu'alaikum Ridho. Silakan datang ke ruang konseling besok setelah sholat Maghrib untuk membahas progres belajar Anda.",
        isRead: false,
        sentAt: new Date("2025-01-13T11:20:00"),
    },
]

export const PesanPage = () => {
    const [messages, setMessages] = useState(initialMessages)
    const [filter, setFilter] = useState("all")
    const [showNewMessageForm, setShowNewMessageForm] = useState(false)

    const handleNewMessage = (newMessage) => {
        const message = {
            id: Date.now().toString(),
            ...newMessage,
            isRead: false,
            sentAt: new Date(),
        }
        setMessages((prev) => [message, ...prev])
    }

    const handleEditMessage = (id, updatedMessage) => {
        setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, ...updatedMessage } : message)))
    }

    const handleDeleteMessage = (id) => {
        setMessages((prev) => prev.filter((message) => message.id !== id))
    }

    const handleToggleRead = (id) => {
        setMessages((prev) =>
            prev.map((message) => (message.id === id ? { ...message, isRead: !message.isRead } : message)),
        )
    }

    const filteredMessages = messages.filter((message) => {
        if (filter === "read") return message.isRead
        if (filter === "unread") return !message.isRead
        return true
    })

    const unreadCount = messages.filter((m) => !m.isRead).length
    const readCount = messages.filter((m) => m.isRead).length

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="w-full p-4 sm:p-6">
                <div className="mb-6 sm:mb-8 relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                            <h1 className="text-xl sm:text-3xl font-medium text-gray-900">Sistem Pesan Santri</h1>
                        </div>
                        <button
                            onClick={() => setShowNewMessageForm(!showNewMessageForm)}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="font-medium">Pesan Baru</span>
                        </button>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 pr-0 md:pr-32">
                        Kelola komunikasi dengan santri melalui sistem pesan yang dapat dilacak status bacaannya
                    </p>
                </div>

                <div className="grid gap-6 pb-20 md:pb-6">
                    {showNewMessageForm && (
                        // <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        //     <div className="p-4 border-b border-gray-200">
                        //         <h3 className="text-lg font-medium text-gray-900">Pesan Baru</h3>
                        //     </div>
                        //     <div className="p-4">
                                <NewMessageForm
                                    onSubmit={(newMessage) => {
                                        handleNewMessage(newMessage)
                                        // setShowNewMessageForm(false)
                                    }}
                                    isOpen={showNewMessageForm}
                                    onClose={() => setShowNewMessageForm(false)}
                                />
                        //     </div>
                        // </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
                                        Total: {messages.length}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                                        Belum Dibaca: {unreadCount}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-800">
                                        Sudah Dibaca: {readCount}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                                    <button
                                        onClick={() => setFilter("all")}
                                        className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === "all"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        onClick={() => setFilter("unread")}
                                        className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === "unread"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Belum Dibaca
                                    </button>
                                    <button
                                        onClick={() => setFilter("read")}
                                        className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === "read"
                                                ? "bg-emerald-600 text-white"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Sudah Dibaca
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredMessages.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-sm sm:text-base">
                                    {filter === "all"
                                        ? "Belum ada pesan yang dikirim"
                                        : filter === "unread"
                                            ? "Tidak ada pesan yang belum dibaca"
                                            : "Tidak ada pesan yang sudah dibaca"}
                                </p>
                            </div>
                        ) : (
                            filteredMessages.map((message) => (
                                <MessageCard
                                    key={message.id}
                                    message={message}
                                    onEdit={handleEditMessage}
                                    onDelete={handleDeleteMessage}
                                    onToggleRead={handleToggleRead}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowNewMessageForm(!showNewMessageForm)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center z-50 hover:scale-105 active:scale-95"
                aria-label="Tambah pesan baru"
            >
                <Plus className="h-6 w-6" />
            </button>
        </div>
    )
}
