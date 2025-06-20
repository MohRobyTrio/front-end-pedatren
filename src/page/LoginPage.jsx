import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/Login";
import logo from "../assets/logoku.png";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login, isLoggingIn, loginError } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });

      if (userData.success === false) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: userData.message || "Terjadi kesalahan saat login.",
        });
        return;
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

  useEffect(() => {
    window.sessionExpiredShown = false;
  }, []);

  // Handler Bantuan Pop Up
  const handleHelp = (e) => {
    e.preventDefault();
    Swal.fire({
      title: `<span style="font-size: 1.12rem; font-weight:600; color: #1e293b;"><i class="fas fa-headset" style="color:#2563eb;margin-right:8px;"></i>Kontak Admin</span>`,
      html: `
      <div style="font-size:1rem;color:#334155;line-height:1.7;">
        <p>
          Jika Anda mengalami masalah login atau membutuhkan bantuan teknis,
          silakan hubungi Admin Pesantren melalui email berikut:
        </p>
        <div style="margin-top:1.1em; display:flex;align-items:center;gap:.7em;padding:.8em 1em;background:#f4f7fe;border-radius:8px;">
          <i class="fas fa-envelope" style="color:#2563eb;"></i>
          <a href="mailto:sipatren@gmail.com" style="color:#2563eb;font-weight:500;text-decoration:underline;">sipatren@gmail.com</a>
        </div>
      </div>
    `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      showCloseButton: true,
      width: 400,
      customClass: {
        popup: "rounded-2xl shadow-lg",
        confirmButton: "bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700"
      }
    });
  };


  const Load = () => (
    <div className="flex justify-center items-center">
      <i className="fas fa-spinner fa-spin text-base text-white"></i>
    </div>
  );

  return (
   <section className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 flex flex-col items-center justify-center px-2 py-6">
  {/* Logo & Brand */}
  <div className="flex flex-col items-center mb-6">
    <img
      src={logo}
      alt="Sipatren Logo"
      className="w-14 h-14 mb-2 drop-shadow"
    />
    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
      SIPATREN
    </span>
    <span className="mt-1 text-sm sm:text-base text-gray-400 tracking-wide font-medium">
      Sistem Informasi Pesantren
    </span>
  </div>

  {/* Form Card */}
  <div className="w-full max-w-xs sm:max-w-sm bg-gray-900/95 rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-800">
    <form className="space-y-5" onSubmit={handleSubmit}>
     <div>
  <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-300">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="
      w-full px-3 py-2 
      rounded-lg border border-gray-300
      bg-white/80 text-gray-900 placeholder-gray-500
      shadow-sm focus:shadow-lg
      focus:border-blue-600 focus:ring-2 focus:ring-blue-300
      transition-all duration-200
      outline-none
    " // CHANGES HERE
    placeholder="name@gmail.com"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    autoFocus
  />
</div>
<div>
  <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-300">
    Kata Sandi
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      className="
        w-full px-3 py-2 
        rounded-lg border border-gray-300
        bg-white/80 text-gray-900 placeholder-gray-500
        shadow-sm focus:shadow-lg
        focus:border-blue-600 focus:ring-2 focus:ring-blue-300
        transition-all duration-200
        pr-10
        outline-none
      " // CHANGES HERE
      placeholder="Password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
      tabIndex={-1}
      aria-label="Toggle password visibility"
    >
      {showPassword ? (
        <i className="fas fa-eye text-base"></i>
      ) : (
        <i className="fas fa-eye-slash text-base"></i>
      )}
    </button>
  </div>
</div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoggingIn}
        className={`w-full rounded-md px-4 py-2 text-base font-semibold shadow-sm transition 
          ${isLoggingIn ? "bg-blue-300 cursor-not-allowed text-white" : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"}
        `}
      >
        {isLoggingIn ? <Load /> : "Login"}
      </button>
      {/* Footer actions */}
      <div className="flex items-center justify-between mt-3">
        {/* Help Button */}
        <button
          type="button"
          onClick={handleHelp}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 hover:underline font-medium transition"
        >
          <i className="fas fa-question-circle text-[13px]"></i>
          Bantuan
        </button>
        {/* Forgot Password */}
        <Link
          to="/forgot"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-500 hover:underline font-medium transition"
        >
          <i className="fas fa-unlock-alt text-[13px]"></i>
          Lupa sandi?
        </Link>
      </div>

      {/* Error */}
      {loginError && <p className="text-red-400 text-xs mt-2 text-center">{loginError}</p>}
    </form>
  </div>
</section>

  );
};

export default LoginPage;
