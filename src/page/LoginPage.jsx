import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/Login";
import logo from "../assets/logo.png";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggingIn, loginError } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password, rememberMe });

      if (userData.success === false) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: userData.message || "Terjadi kesalahan saat login.",
        });
        return; // jangan lanjut ke navigate
      }

      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Terjadi kesalahan.",
      });
    }
  };

  const Load = () => {
    return (
      <div className="col-span-3 flex justify-center items-left p-1">
        <i className="fas fa-spinner fa-spin text-2xl text-white"></i>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 overflow-y-auto">
      {/* Logo dan teks Pedatren di luar box form */}
      <div className="flex flex-col items-center mb-6">
        <img
          className="w-20 h-20"
          src={logo}
          alt="logo"
        />
        <span className="mt-2 text-4xl font-bold text-gray-900">Pedatren</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 m-4">
        <h1 className="text-xl font-bold text-center text-gray-900 md:text-2xl mb-6">
          Masuk ke akun anda
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              placeholder="name@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Kata Sandi
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 pr-10"
                placeholder="Password"
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
                {showPassword ? (
                  <i className="fas fa-eye"></i>
                ) : (
                  <i className="fas fa-eye-slash"></i>
                )}
              </button>
            </div>
          </div>



          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-500">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> Ingat saya
            </label>


            <a href="#" className="text-sm text-blue-600 hover:underline">
              Lupa kata sandi?
            </a>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full text-white rounded-lg px-5 py-2.5 text-center ${isLoggingIn ? "bg-blue-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
          >
            {isLoggingIn ? <Load /> : "Login"}
          </button>
          {loginError && <p className="text-red-500 text-sm mt-2 text-center">{loginError}</p>}
          <p className="text-sm text-center text-gray-500 mt-2">
            Belum punya akun?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
