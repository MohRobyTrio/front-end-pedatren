import { LucideLoader2 } from "lucide-react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../hooks/config";
import { toast } from "sonner";

const LoginOrtuPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (!phone.trim()) {
            setError("No HP harus diisi");
            return false;
        }
        if (!password.trim()) {
            setError("Password harus diisi");
            return false;
        }
        if (password.length < 8) {
            setError("Password minimal 8 karakter");
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}login-ortu`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    no_hp: phone,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login gagal, periksa No HP dan password");
                return;
            }

            // simpan token dan data user
            sessionStorage.setItem("auth_token_ortu", data.token);

            // simpan data orang tua
            sessionStorage.setItem("user_data", JSON.stringify({
                id: data.data.id,
                no_kk: data.data.no_kk,
                no_hp: data.data.no_hp,
                email: data.data.email,
                status: data.data.status,
                children: data.anak
            }));

            localStorage.setItem("ortu_first_visit", "false");
            toast.success("Berhasil Login");
            navigate("/wali"); // arahkan ke dashboard wali santri
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan, silakan coba lagi.");
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
                    <h1 className="text-xl font-bold text-emerald-800">Portal Wali Santri</h1>
                    <p className="text-sm text-emerald-600">Masuk untuk mengakses informasi santri</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5 mt-6">
                    {error && (
                        <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="phone" className="block text-emerald-700 text-sm font-medium">
                            No HP
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Masukkan No HP"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                            "Masuk"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Belum punya akun?{" "}
                        <Link to='/register-ortu' className="text-blue-600 font-semibold hover:text-blue-700">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginOrtuPage;
