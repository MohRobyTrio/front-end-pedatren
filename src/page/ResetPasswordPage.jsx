import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Ambil token dan email dari URL
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);

    const getFriendlyMessage = (apiMessage) => {
        const messageMap = {
            'passwords.token': 'Token kadaluarsa. Silakan minta link reset password baru.',
            'passwords.user': 'Email tidak ditemukan.',
            // Tambahkan mapping lain jika perlu
        };

        return messageMap[apiMessage] || apiMessage || 'Terjadi kesalahan.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !passwordConfirmation) {
            await Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                text: 'Password dan konfirmasi password wajib diisi.',
            });
            return;
        }

        if (password !== passwordConfirmation) {
            await Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                text: 'Password dan konfirmasi password tidak sama.',
            });
            return;
        }

        setLoading(true);

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang proses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await fetch('http://localhost:8000/api/reset', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });
            Swal.close();
            const data = await response.json();

             if (!response.ok) {
                 const friendlyMessage = getFriendlyMessage(data.message);
                 throw new Error(friendlyMessage);
             }

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Password berhasil direset. Silakan login kembali.',
                confirmButtonText: 'OK',
            });

            navigate('/login');


        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: err.message || 'Terjadi kesalahan saat reset password.',
            });

        } finally {
            setLoading(false);
        }
    };

    // Jika token atau email tidak ada, bisa tampilkan error atau redirect
    if (!token || !email) {
        (async () => {
            await Swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Link reset password tidak valid atau sudah kadaluarsa.',
                confirmButtonText: 'OK',
            });
            navigate("/login");
        })();
        return;
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Reset Kata Sandi</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                            Kata Sandi Baru
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 pr-10"
                                placeholder="Kata sandi"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                tabIndex={-1}
                            >
                                {showPassword ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
                            </button>
                        </div>
                    </div>

                    {/* Konfirmasi Kata Sandi */}
                    <div className="mb-4">
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">
                            Konfirmasi Kata Sandi
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 pr-10"
                                placeholder="Konfirmasi kata sandi"
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        {loading ? "Mengatur ulang..." : "Reset"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ResetPasswordPage;
