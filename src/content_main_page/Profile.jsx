"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faUser,
    faEnvelope,
    faLock,
    faShield,
    faClock,
    faEdit,
    faSave,
    faTimes,
    faEye,
    faEyeSlash,
    faUserCircle,
    faCalendarAlt,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { getRolesString } from "../utils/getRolesString"
import { API_BASE_URL } from "../hooks/config"
import { getCookie } from "../utils/cookieUtils"
import Swal from "sweetalert2"
import useLogout from "../hooks/Logout"

const Profile = () => {
    const navigate = useNavigate()
    const { clearAuthData } = useLogout()
    const [activeTab, setActiveTab] = useState("profile")
    const [isEditing, setIsEditing] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // User data from storage
    const [userData, setUserData] = useState({
        name: localStorage.getItem("name") || sessionStorage.getItem("name") || "",
        email: localStorage.getItem("email") || sessionStorage.getItem("email") || "",
        role: getRolesString(),
        lastLogin: localStorage.getItem("lastLogin") || sessionStorage.getItem("lastLogin") || "",
        createdAt: localStorage.getItem("createdAt") || sessionStorage.getItem("createdAt") || "",
    })

    // Form states
    const [profileForm, setProfileForm] = useState({
        name: userData.name,
        email: userData.email,
    })

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Load additional user data from API if needed
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const token = sessionStorage.getItem("token") || getCookie("token")
                const response = await fetch(`${API_BASE_URL}profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const result = await response.json()
                    if (result.data) {
                        setUserData(result.data)
                        setProfileForm({
                            name: result.data.name || userData.name,
                            email: result.data.email || userData.email,
                        })
                    }
                }
            } catch (error) {
                console.error("Error loading profile:", error)
            }
        }

        loadUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileForm),
            })

            const result = await response.json()

            if (response.status === 401) {
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                clearAuthData()
                navigate("/login")
                return
            }

            if (response.ok) {
                // Update local storage
                // localStorage.setItem("name", profileForm.name)
                // localStorage.setItem("email", profileForm.email)
                sessionStorage.setItem("name", profileForm.name)
                sessionStorage.setItem("email", profileForm.email)

                setUserData((prev) => ({
                    ...prev,
                    name: profileForm.name,
                    email: profileForm.email,
                }))

                setIsEditing(false)

                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Profile berhasil diperbarui!",
                    timer: 2000,
                    showConfirmButton: false,
                })
            } else {
                throw new Error(result.message || "Gagal memperbarui profile")
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat memperbarui profile",
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            await Swal.fire({
                icon: "error",
                title: "Password Tidak Cocok",
                text: "Password baru dan konfirmasi password tidak cocok",
            })
            return
        }

        if (passwordForm.newPassword.length < 6) {
            await Swal.fire({
                icon: "error",
                title: "Password Terlalu Pendek",
                text: "Password minimal 6 karakter",
            })
            return
        }

        setLoading(true)

        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: passwordForm.currentPassword,
                    new_password: passwordForm.newPassword,
                    new_password_confirmation: passwordForm.confirmPassword,
                }),
            })

            const result = await response.json()

            if (response.status === 401) {
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                clearAuthData()
                navigate("/login")
                return
            }

            if (response.ok) {
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })

                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Password berhasil diperbarui!",
                    timer: 2000,
                    showConfirmButton: false,
                })
            } else {
                throw new Error(result.message || "Gagal memperbarui password")
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat memperbarui password",
            })
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        try {
            return new Date(dateString).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch {
            return dateString
        }
    }

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Profile Settings</h1>
                        <p className="text-gray-600 mt-1">Kelola informasi akun dan keamanan Anda</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Kembali
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                        {/* Profile Avatar */}
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FontAwesomeIcon icon={faUserCircle} className="text-3xl text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800">{userData.name}</h3>
                            <p className="text-sm text-gray-600">{userData.role}</p>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === "profile"
                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faUser} />
                                Informasi Profile
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === "security"
                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faLock} />
                                Keamanan
                            </button>
                            {/* <button
                                onClick={() => setActiveTab("activity")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === "activity"
                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faClock} />
                                Aktivitas
                            </button> */}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800">Informasi Profile</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleProfileUpdate}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nama */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                                                    }`}
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                                                    }`}
                                                required
                                            />
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FontAwesomeIcon icon={faShield} className="mr-2" />
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={userData.role}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                                            />
                                        </div>

                                        {/* Tanggal Bergabung */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                                Tanggal Bergabung
                                            </label>
                                            <input
                                                type="text"
                                                value={formatDate(userData.createdAt)}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <FontAwesomeIcon icon={faSave} />
                                                {loading ? "Menyimpan..." : "Simpan"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false)
                                                    setProfileForm({
                                                        name: userData.name,
                                                        email: userData.email,
                                                    })
                                                }}
                                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                                Batal
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Keamanan Akun</h2>

                                <form onSubmit={handlePasswordUpdate}>
                                    <div className="space-y-6">
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-yellow-800">
                                                <FontAwesomeIcon icon={faLock} />
                                                <span className="font-medium">Ubah Password</span>
                                            </div>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Pastikan password baru minimal 6 karakter dan berbeda dari password lama
                                            </p>
                                        </div>

                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    minLength={6}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    minLength={6}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <FontAwesomeIcon icon={faLock} />
                                            {loading ? "Memperbarui..." : "Perbarui Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Activity Tab */}
                        {activeTab === "activity" && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Aktivitas Akun</h2>

                                <div className="space-y-6">
                                    {/* Login Terakhir */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <FontAwesomeIcon icon={faClock} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Login Terakhir</h3>
                                                <p className="text-sm text-gray-600">Informasi sesi login terakhir</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Waktu Login</p>
                                                <p className="text-gray-900">{formatDate(userData.lastLogin)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Status</p>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Aktif
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informasi Akun */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-800 mb-4">Informasi Akun</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">ID Pengguna</p>
                                                <p className="text-gray-900">{userData.id || "-"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Status Akun</p>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Aktif
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Tanggal Dibuat</p>
                                                <p className="text-gray-900">{formatDate(userData.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Terakhir Diperbarui</p>
                                                <p className="text-gray-900">{formatDate(userData.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
