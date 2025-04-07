import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRegister from "../hooks/Register";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const { register, isRegistering, registerError } = useRegister();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMsg("Konfirmasi password tidak cocok.");
            return;
        }

        try {
            await register({
                name,
                email,
                password,
                passwordConfirmation: confirmPassword,
            });
            navigate("/login");
        } catch (error) {
            setErrorMsg(error.message || "Terjadi kesalahan.");
        }
    };

    const Load = () => (
        <div className="col-span-3 flex justify-center items-left p-1">
            <i className="fas fa-spinner fa-spin text-2xl text-white"></i>
        </div>
    );

    return (
        <section className="relative min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="absolute top-10 flex flex-row items-center">
                <img
                    className="w-20 h-20"
                    src="https://play-lh.googleusercontent.com/AfPIZgh2gk3qe92PeBz9TLcQ6HzXWbScrgWGa7tr-pXS0tXm_g1duxHNBsDvlh-Q_Q=w480-h960-rw"
                    alt="logo"
                />
                <span className="mt-2 text-4xl font-bold text-gray-900">Pedatren</span>
            </div>

            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 m-4">
                <h1 className="text-xl font-bold text-center text-gray-900 md:text-2xl mb-6">
                    Buat akun baru
                </h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                            placeholder="Nama Anda"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                            placeholder="name@company.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Kata Sandi */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                            Kata Sandi
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
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        disabled={isRegistering}
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5 text-center"
                    >
                        {isRegistering ? <Load /> : "Daftar"}
                    </button>

                    {(errorMsg || registerError) && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {errorMsg || registerError}
                        </p>
                    )}

                    <p className="text-sm text-center text-gray-500 mt-2">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Masuk di sini
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
