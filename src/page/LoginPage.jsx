"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useLogin from "../hooks/Login"
import logo from "../assets/logoku.png"
import Swal from "sweetalert2"
import { getRolesString } from "../utils/getRolesString"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { login, isLoggingIn, loginError } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userData = await login({ email, password })

      if (userData.success === false) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: userData.message || "Terjadi kesalahan saat login.",
        })
        return
      }
      const roles = getRolesString();
      const lowerRoles = String(roles) // pastikan jadi string dulu
        .split(",")                   // ubah jadi array
        .map(role => role.trim().toLowerCase());
      if (lowerRoles.includes("ustadz")) {
        sessionStorage.setItem("dataPokok", "true");
        return navigate("/tahfidz", { replace: true });
      } else if (lowerRoles.includes("biktren")) {
        sessionStorage.setItem("kepesantrenan", "true");
        return navigate("/perizinan", { replace: true });
      } else {
        return navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Terjadi kesalahan.",
      })
    }
  }

  useEffect(() => {
    window.sessionExpiredShown = false
  }, [])

  // Handler Bantuan Pop Up
  const handleHelp = (e) => {
    e.preventDefault()
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
          <a href="mailto:pusdatren@gmail.com" style="color:#2563eb;font-weight:500;text-decoration:underline;">pusdatren@gmail.com</a>
        </div>
      </div>
    `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      showCloseButton: true,
      width: 400,
      customClass: {
        popup: "rounded-2xl shadow-lg",
        confirmButton: "bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700",
      },
    })
  }

  const Load = () => (
    <div className="flex justify-center items-center">
      <i className="fas fa-spinner fa-spin text-base text-white"></i>
    </div>
  )

  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900"></div>

      <div className="absolute inset-0 opacity-5 hidden sm:block pointer-events-none">
        {/* Simple mosque silhouette - static */}
        <div className="absolute bottom-0 left-0 w-64 h-48 opacity-40">
          <svg viewBox="0 0 256 192" className="w-full h-full text-blue-800/20" fill="currentColor">
            <ellipse cx="128" cy="96" rx="48" ry="32" />
            <rect x="32" y="64" width="16" height="128" />
            <ellipse cx="40" cy="64" rx="12" ry="8" />
            <rect x="208" y="72" width="14" height="120" />
            <ellipse cx="215" cy="72" rx="10" ry="6" />
            <rect x="64" y="128" width="128" height="64" />
          </svg>
        </div>

        {/* Simple crescent moon - static */}
        <div className="absolute top-16 right-16 opacity-30">
          <svg width="40" height="40" className="text-amber-200">
            <path d="M 20 8 Q 28 16 28 20 Q 28 24 20 32 Q 24 28 28 20 Q 24 12 20 8" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        {/* Simple stars - static */}
        <div className="absolute top-20 left-24 opacity-25">
          <svg width="12" height="12" className="text-white">
            <polygon points="6,1 7,4 10,4 7.5,6 8.5,9 6,7 3.5,9 4.5,6 1,4 4,4" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-32 right-32 opacity-20">
          <svg width="8" height="8" className="text-blue-200">
            <polygon points="4,0.5 4.5,3 7,3 5,4.5 6,7 4,5.5 2,7 3,4.5 1,3 3.5,3" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Simplified grid pattern - static and lighter */}
      <div className="absolute inset-0 opacity-2 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-md">
        <div className="flex flex-col items-center mb-6 sm:mb-8 animate-fade-in">
          <div className="relative mb-3 sm:mb-4">
            <img
              src={logo || "/placeholder.svg"}
              alt="Pusdatren Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-1 sm:mb-2">
            PUSDATREN
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm md:text-base tracking-wide font-medium opacity-90">
            Pusat Data Pesantren
          </p>
          <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent mt-2 sm:mt-3"></div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20 animate-fade-in">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="group">
              <label
                htmlFor="email"
                className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors duration-200"
              >
                <i className="fas fa-envelope mr-1.5 sm:mr-2 text-blue-600"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                className="
                  w-full px-3 py-2.5 sm:px-4 sm:py-3 
                  rounded-lg sm:rounded-xl border-2 border-gray-200
                  bg-white text-gray-900 placeholder-gray-400
                  shadow-sm focus:shadow-md
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                  transition-all duration-200
                  outline-none
                  hover:border-gray-300
                  text-sm sm:text-base
                "
                placeholder="nama@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            {/* Password Field */}
            <div className="group">
              <label
                htmlFor="password"
                className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors duration-200"
              >
                <i className="fas fa-lock mr-1.5 sm:mr-2 text-blue-600"></i>
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="
                    w-full px-3 py-2.5 pr-10 sm:px-4 sm:py-3 sm:pr-12
                    rounded-lg sm:rounded-xl border-2 border-gray-200
                    bg-white text-gray-900 placeholder-gray-400
                    shadow-sm focus:shadow-md
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                    transition-all duration-200
                    outline-none
                    hover:border-gray-300
                    text-sm sm:text-base
                  "
                  placeholder="Masukkan kata sandi"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200 p-1"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <i className="fas fa-eye text-sm sm:text-lg"></i>
                  ) : (
                    <i className="fas fa-eye-slash text-sm sm:text-lg"></i>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`
                w-full rounded-lg sm:rounded-xl px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold shadow-lg
                transition-all duration-200
                ${isLoggingIn
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer text-white hover:shadow-xl"
                }
              `}
            >
              {isLoggingIn ? (
                <Load />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-sign-in-alt"></i>
                  Masuk
                </span>
              )}
            </button>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-1 sm:pt-2">
              {/* Help Button */}
              <button
                type="button"
                onClick={handleHelp}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-blue-600 hover:underline font-medium transition-colors duration-200"
              >
                <i className="fas fa-question-circle text-xs sm:text-sm"></i>
                Bantuan
              </button>

              {/* Forgot Password */}
              <Link
                to="/forgot"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
              >
                <i className="fas fa-unlock-alt text-xs sm:text-sm"></i>
                Lupa sandi?
              </Link>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3">
                <p className="text-red-600 text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 sm:gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  {loginError}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-blue-100/80 text-xs">© 2025 Pusdatren. Sistem Informasi Pesantren Modern</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

export default LoginPage
