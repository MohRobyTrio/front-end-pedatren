import { LucideLoader2 } from "lucide-react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../hooks/config";
import { toast } from "sonner";

const RegisterOrtuPage = () => {
    const [noKK, setNoKK] = useState("");
    const [nisAnak, setNisAnak] = useState("");
    const [noHP, setNoHP] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (!noKK.trim()) {
            setError("Nomor KK harus diisi");
            return false;
        }
        if (!nisAnak.trim()) {
            setError("NIS anak harus diisi");
            return false;
        }
        if (!noHP.trim()) {
            setError("Nomor HP harus diisi");
            return false;
        }
        if (!email.trim()) {
            setError("Email harus diisi");
            return false;
        }
        if (!email.includes("@")) {
            setError("Format email tidak valid");
            return false;
        }
        if (!password.trim()) {
            setError("Password harus diisi");
            return false;
        }
        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            return false;
        }
        return true;
    };

    const friendlyMessages = {
        no_kk: {
            required: "Nomor KK harus diisi",
            string: "Nomor KK harus berupa angka",
            max: "Nomor KK maksimal 16 karakter",
            exists: "Nomor KK tidak terdaftar",
        },
        nis_anak: {
            required: "NIS anak harus diisi",
            string: "NIS anak harus berupa angka",
            max: "NIS anak maksimal 20 karakter",
            exists: "NIS anak tidak ditemukan",
        },
        no_hp: {
            max: "Nomor HP maksimal 15 karakter",
            unique: "Nomor HP sudah digunakan",
        },
        email: {
            email: "Email tidak valid",
            max: "Email maksimal 100 karakter",
            unique: "Email sudah digunakan",
        },
        password: {
            required: "Password harus diisi",
            min: "Password minimal 8 karakter",
            confirmed: "Konfirmasi password tidak cocok",
        },
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}register-ortu`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    no_kk: noKK,
                    nis_anak: nisAnak,
                    no_hp: noHP,
                    email,
                    password,
                    password_confirmation: passwordConfirm,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errors = data.errors || data.error;

                if (errors) {
                    Object.entries(errors).forEach(([field, messages]) => {
                        messages.forEach((msg) => {
                            // Ambil pesan friendly jika ada
                            const key = msg.split(".")[1] || msg; // contoh: validation.exists
                            const friendly = friendlyMessages[field]?.[key] || msg;
                            toast.error(friendly);
                        });
                    });
                } else {
                    toast.error(data.message || "Registrasi gagal");
                }

                return;
            }

            localStorage.setItem("ortu_first_visit", "false");
            toast.success(data.message || "Registrasi berhasil!");
            navigate("/login-ortu");
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan, silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-white flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-emerald-100 p-6">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-emerald-800">Register Wali Santri</h1>
                    <p className="text-sm text-emerald-600">Isi data berikut untuk membuat akun</p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-5 mt-6">
                    {error && (
                        <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="no_kk" className="block text-emerald-700 text-sm font-medium">
                            No KK
                        </label>
                        <input
                            id="no_kk"
                            type="text"
                            inputMode="numeric"
                            placeholder="Masukkan No KK"
                            value={noKK}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                if (value.length <= 16) {
                                    setNoKK(value);
                                }
                            }}
                            className="w-full border border-emerald-200 rounded-lg px-3 py-3 text-base focus:border-emerald-500 focus:ring focus:ring-emerald-200 outline-none"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="nis_anak" className="block text-emerald-700 text-sm font-medium">
                            NIS Anak
                        </label>
                        <input
                            id="nis_anak"
                            type="text"
                            placeholder="Masukkan NIS Anak"
                            inputMode="numeric"
                            value={nisAnak}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                if (value.length <= 16) {
                                    setNisAnak(value);
                                }
                            }}
                            className="w-full border border-emerald-200 rounded-lg px-3 py-3 text-base focus:border-emerald-500 focus:ring focus:ring-emerald-200 outline-none"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="no_hp" className="block text-emerald-700 text-sm font-medium">
                            No HP
                        </label>
                        <input
                            id="no_hp"
                            type="text"
                            placeholder="Masukkan No HP"
                            value={noHP}
                            inputMode="numeric"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                if (value.length <= 13) {
                                    setNoHP(value);
                                }
                            }}
                            className="w-full border border-emerald-200 rounded-lg px-3 py-3 text-base focus:border-emerald-500 focus:ring focus:ring-emerald-200 outline-none"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-emerald-700 text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="contoh@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-emerald-200 rounded-lg px-3 py-3 text-base focus:border-emerald-500 focus:ring focus:ring-emerald-200 outline-none"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-emerald-700 text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-emerald-200 rounded-lg px-3 py-3 pr-10 text-base focus:border-emerald-500 focus:ring focus:ring-emerald-200 outline-none"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                                disabled={loading}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-emerald-700 text-sm font-medium">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPasswordConfirm ? "text" : "password"}
                                placeholder="Masukkan password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="w-full border border-emerald-200 rounded-lg px-3 py-3 pr-10 text-base focus:border-emerald-500 focus:ring focus:ring-emerald-200 outline-none"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                                disabled={loading}
                            >
                                {showPasswordConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-base font-medium transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <LucideLoader2 className="h-5 w-5 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Sudah punya akun?{" "}
                        <Link to='/login-ortu' className="text-blue-600 font-semibold hover:text-blue-700">
                            Login sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterOrtuPage;
