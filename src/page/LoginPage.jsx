"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useLogin from "../hooks/Login"
import logo from "../assets/logoku.png"
import Swal from "sweetalert2"

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

      navigate("/dashboard")
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
      {/* Rich Deep Night Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black"></div>

      {/* Additional Sky Layers for Richness */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/10 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 via-transparent to-purple-900/20"></div>

      {/* Moving Cloud Layers */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-0 w-96 h-24 bg-gray-600 rounded-full blur-3xl animate-cloud-drift"></div>
        <div
          className="absolute top-40 right-0 w-80 h-20 bg-gray-700 rounded-full blur-3xl animate-cloud-drift-reverse"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-60 left-1/4 w-64 h-16 bg-gray-500 rounded-full blur-3xl animate-cloud-drift-slow"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Rich Star Field with Multiple Layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Distant Background Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle-distant opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}

        {/* Medium Stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`med-star-${i}`}
            className="absolute w-1 h-1 bg-blue-100 rounded-full animate-twinkle-medium opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}

        {/* Large Bright Stars */}
        <div className="absolute top-16 left-20 w-3 h-3 bg-yellow-200 rounded-full animate-twinkle-bright shadow-lg shadow-yellow-200/50">
          <div className="absolute inset-0 bg-yellow-200 rounded-full animate-ping opacity-75"></div>
        </div>
        <div
          className="absolute top-24 right-32 w-2.5 h-2.5 bg-white rounded-full animate-twinkle-bright shadow-lg shadow-white/50"
          style={{ animationDelay: "1s" }}
        >
          <div
            className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div
          className="absolute top-40 left-1/4 w-2 h-2 bg-blue-200 rounded-full animate-twinkle-bright shadow-lg shadow-blue-200/50"
          style={{ animationDelay: "2s" }}
        >
          <div
            className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-75"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Moving Stars */}
        <div
          className="absolute top-32 right-20 w-2 h-2 bg-yellow-100 rounded-full animate-star-orbit shadow-md shadow-yellow-100/40"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-20 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-star-orbit-reverse shadow-md shadow-white/40"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-48 right-1/4 w-2 h-2 bg-purple-200 rounded-full animate-star-spiral shadow-md shadow-purple-200/40"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Multiple Shooting Stars */}
        <div className="absolute top-12 left-0 w-1 h-1 bg-white rounded-full animate-shooting-star opacity-0">
          <div className="absolute -left-12 top-0 w-12 h-0.5 bg-gradient-to-r from-transparent to-white opacity-60"></div>
        </div>
        <div
          className="absolute top-1/3 right-0 w-1 h-1 bg-yellow-200 rounded-full animate-shooting-star-reverse opacity-0"
          style={{ animationDelay: "8s" }}
        >
          <div className="absolute -right-12 top-0 w-12 h-0.5 bg-gradient-to-l from-transparent to-yellow-200 opacity-60"></div>
        </div>
        <div
          className="absolute top-1/4 left-0 w-1 h-1 bg-blue-200 rounded-full animate-shooting-star-diagonal opacity-0"
          style={{ animationDelay: "15s" }}
        >
          <div className="absolute -left-10 -top-2 w-10 h-0.5 bg-gradient-to-r from-transparent to-blue-200 opacity-60 rotate-12"></div>
        </div>

        {/* Star Constellations */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-constellation-pulse"></div>
            <div
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-constellation-pulse"
              style={{ left: "12px", top: "6px", animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 bg-blue-100 rounded-full animate-constellation-pulse"
              style={{ left: "6px", top: "12px", animationDelay: "1s" }}
            ></div>
            <div
              className="absolute w-1 h-1 bg-yellow-100 rounded-full animate-constellation-pulse"
              style={{ left: "18px", top: "18px", animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-constellation-pulse"
              style={{ left: "24px", top: "8px", animationDelay: "2s" }}
            ></div>

            {/* Constellation Lines */}
            <svg className="absolute top-0 left-0 w-32 h-32 opacity-20">
              <line x1="4" y1="4" x2="16" y2="10" stroke="#fbbf24" strokeWidth="0.5" className="animate-pulse" />
              <line x1="16" y1="10" x2="22" y2="22" stroke="#f3f4f6" strokeWidth="0.5" className="animate-pulse" />
              <line x1="10" y1="16" x2="28" y2="12" stroke="#dbeafe" strokeWidth="0.5" className="animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Nebula Effect */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-5 animate-nebula-drift"></div>
        <div
          className="absolute top-1/2 left-1/5 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-5 animate-nebula-drift-reverse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Large Crescent Moon with Enhanced Details */}
      <div className="absolute top-8 right-12 animate-moon-float">
        <div className="relative">
          {/* Moon Glow */}
          <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-30 scale-150 animate-pulse"></div>

          {/* Main Moon */}
          <svg width="100" height="100" className="relative text-yellow-100 drop-shadow-2xl">
            <defs>
              <filter id="moonGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="moonGradient" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="70%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
            </defs>

            {/* Crescent Moon Shape */}
            <path
              d="M 50 15 Q 70 25 75 50 Q 70 75 50 85 Q 65 75 70 50 Q 65 25 50 15"
              fill="url(#moonGradient)"
              filter="url(#moonGlow)"
              opacity="0.95"
            />

            {/* Moon Surface Details */}
            <circle cx="58" cy="35" r="3" fill="#f59e0b" opacity="0.4" />
            <circle cx="62" cy="50" r="2" fill="#f59e0b" opacity="0.3" />
            <circle cx="56" cy="65" r="2.5" fill="#f59e0b" opacity="0.35" />
            <circle cx="64" cy="42" r="1.5" fill="#f59e0b" opacity="0.25" />

            {/* Bright Edge Highlight */}
            <path d="M 50 15 Q 52 25 52 50 Q 52 75 50 85 Q 51 75 51.5 50 Q 51 25 50 15" fill="#fef9c3" opacity="0.8" />
          </svg>

          {/* Enhanced Moon Rays */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-yellow-200 opacity-20 animate-pulse"
                style={{
                  height: `${20 + Math.random() * 20}px`,
                  transform: `rotate(${i * 45}deg) translateY(-${50 + Math.random() * 20}px)`,
                  animationDelay: `${i * 0.3}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Spectacular Fireworks with Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* First Firework from Left (Kaaba) - PUSDATREN */}
        <div className="absolute bottom-48 left-1/4 transform -translate-x-1/2">
          {/* Launch Trail */}
          <div className="animate-firework-launch-1 opacity-0">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-t from-yellow-500 via-orange-400 to-red-400 rounded-full shadow-2xl shadow-yellow-400/60 animate-pulse"></div>
              {/* Rocket Trail */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-yellow-400 to-transparent opacity-80 animate-pulse"></div>
            </div>
          </div>

          {/* Burst Explosion */}
          <div
            className="absolute bottom-0 left-0 animate-firework-burst-1 opacity-0"
            style={{ animationDelay: "1.5s" }}
          >
            {/* Main Burst Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full animate-firework-particle-1 shadow-lg shadow-yellow-400/50"
                style={{
                  transform: `rotate(${i * 18}deg) translateY(-40px)`,
                  animationDelay: `${i * 0.03}s`,
                }}
              ></div>
            ))}

            {/* Secondary Burst */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`sec-${i}`}
                className="absolute w-1 h-1 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full animate-firework-particle-1-secondary shadow-md"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-25px)`,
                  animationDelay: `${0.2 + i * 0.04}s`,
                }}
              ></div>
            ))}

            {/* Sparkle Effects */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-sparkle"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-35px)`,
                  animationDelay: `${0.3 + i * 0.05}s`,
                }}
              ></div>
            ))}
          </div>

          {/* PUSDATREN Text */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-text-appear-1 opacity-0"
            style={{ animationDelay: "2.2s" }}
          >
            <div className="relative">
              {/* Text Shadow/Glow Background */}
              <div className="absolute inset-0 text-2xl md:text-3xl font-bold text-yellow-400 blur-sm opacity-60 animate-text-glow-pulse">
                PUSDATREN
              </div>
              {/* Main Text */}
              <div className="relative text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 bg-clip-text drop-shadow-xl animate-text-glow tracking-wide transform hover:scale-105 transition-transform duration-300">
                PUSDATREN
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
              <div
                className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce opacity-70"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute -bottom-0.5 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Second Firework from Right (Medina) - PUSAT DATA PESANTREN */}
        <div className="absolute bottom-44 right-1/4 transform translate-x-1/2">
          {/* Launch Trail */}
          <div className="animate-firework-launch-2 opacity-0" style={{ animationDelay: "5s" }}>
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-t from-emerald-500 via-green-400 to-teal-400 rounded-full shadow-2xl shadow-emerald-400/60 animate-pulse"></div>
              {/* Rocket Trail */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent opacity-80 animate-pulse"></div>
            </div>
          </div>

          {/* Burst Explosion */}
          <div
            className="absolute bottom-0 left-0 animate-firework-burst-2 opacity-0"
            style={{ animationDelay: "6.5s" }}
          >
            {/* Main Burst Particles */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full animate-firework-particle-2 shadow-lg shadow-emerald-400/50"
                style={{
                  transform: `rotate(${i * 15}deg) translateY(-45px)`,
                  animationDelay: `${i * 0.025}s`,
                }}
              ></div>
            ))}

            {/* Secondary Burst */}
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={`sec-${i}`}
                className="absolute w-1 h-1 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full animate-firework-particle-2-secondary shadow-md"
                style={{
                  transform: `rotate(${i * 22.5}deg) translateY(-30px)`,
                  animationDelay: `${0.15 + i * 0.03}s`,
                }}
              ></div>
            ))}

            {/* Sparkle Effects */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-sparkle"
                style={{
                  transform: `rotate(${i * 36}deg) translateY(-40px)`,
                  animationDelay: `${0.25 + i * 0.04}s`,
                }}
              ></div>
            ))}
          </div>

          {/* PUSAT DATA PESANTREN Text */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-text-appear-2 opacity-0"
            style={{ animationDelay: "7.2s" }}
          >
            <div className="relative text-center">
              {/* Text Shadow/Glow Background */}
              <div className="absolute inset-0 text-lg md:text-xl font-semibold text-emerald-400 blur-sm opacity-60 animate-text-glow-pulse-2">
                <div>PUSAT DATA</div>
                <div>PESANTREN</div>
              </div>
              {/* Main Text */}
              <div className="relative text-base md:text-lg font-semibold text-transparent bg-gradient-to-r from-emerald-300 via-green-300 to-teal-400 bg-clip-text drop-shadow-xl animate-text-glow-2 tracking-wide transform hover:scale-105 transition-transform duration-300">
                <div className="mb-0.5">PUSAT DATA</div>
                <div>PESANTREN</div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce opacity-80"></div>
              <div
                className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-green-400 rounded-full animate-bounce opacity-70"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute -bottom-0.5 right-1/4 w-1 h-1 bg-teal-400 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Additional Decorative Fireworks */}
        <div className="absolute bottom-52 left-1/3">
          <div className="animate-firework-launch-3 opacity-0" style={{ animationDelay: "9s" }}>
            <div className="w-2 h-2 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50"></div>
          </div>
          <div
            className="absolute bottom-0 left-0 animate-firework-burst-3 opacity-0"
            style={{ animationDelay: "10s" }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-firework-particle-3 shadow-md"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-25px)`,
                  animationDelay: `${i * 0.08}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-50 right-1/3">
          <div className="animate-firework-launch-4 opacity-0" style={{ animationDelay: "11s" }}>
            <div className="w-2 h-2 bg-gradient-to-t from-pink-400 to-purple-400 rounded-full shadow-lg shadow-pink-400/50"></div>
          </div>
          <div
            className="absolute bottom-0 left-0 animate-firework-burst-4 opacity-0"
            style={{ animationDelay: "12s" }}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-firework-particle-4 shadow-md"
                style={{
                  transform: `rotate(${i * 25.7}deg) translateY(-28px)`,
                  animationDelay: `${i * 0.06}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Large Kaaba Silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-48 opacity-25">
        <svg viewBox="0 0 800 192" className="w-full h-full text-slate-800">
          {/* Main Kaaba Structure */}
          <rect x="320" y="80" width="160" height="112" fill="currentColor" />

          {/* Kaaba Covering (Kiswah) Details */}
          <rect x="330" y="90" width="140" height="6" fill="rgba(251, 191, 36, 0.4)" />
          <rect x="330" y="110" width="140" height="4" fill="rgba(251, 191, 36, 0.3)" />
          <rect x="330" y="130" width="140" height="4" fill="rgba(251, 191, 36, 0.3)" />
          <rect x="330" y="150" width="140" height="6" fill="rgba(251, 191, 36, 0.4)" />
          <rect x="330" y="170" width="140" height="4" fill="rgba(251, 191, 36, 0.3)" />

          {/* Kaaba Door */}
          <rect x="380" y="120" width="20" height="40" fill="rgba(251, 191, 36, 0.6)" />
          <rect x="385" y="125" width="10" height="30" fill="rgba(251, 191, 36, 0.8)" />

          {/* Surrounding Grand Mosque Buildings */}
          <rect x="180" y="100" width="120" height="92" fill="currentColor" opacity="0.8" />
          <rect x="500" y="100" width="120" height="92" fill="currentColor" opacity="0.8" />
          <rect x="240" y="90" width="60" height="102" fill="currentColor" opacity="0.9" />
          <rect x="500" y="90" width="60" height="102" fill="currentColor" opacity="0.9" />

          {/* Tall Minarets */}
          <rect x="120" y="40" width="20" height="152" fill="currentColor" opacity="0.7" />
          <ellipse cx="130" cy="40" rx="15" ry="8" fill="currentColor" opacity="0.7" />
          <rect x="660" y="40" width="20" height="152" fill="currentColor" opacity="0.7" />
          <ellipse cx="670" cy="40" rx="15" ry="8" fill="currentColor" opacity="0.7" />

          {/* Additional Minarets */}
          <rect x="200" y="60" width="15" height="132" fill="currentColor" opacity="0.6" />
          <ellipse cx="207.5" cy="60" rx="10" ry="6" fill="currentColor" opacity="0.6" />
          <rect x="585" y="60" width="15" height="132" fill="currentColor" opacity="0.6" />
          <ellipse cx="592.5" cy="60" rx="10" ry="6" fill="currentColor" opacity="0.6" />

          {/* Domes */}
          <ellipse cx="240" cy="100" rx="30" ry="18" fill="currentColor" opacity="0.8" />
          <ellipse cx="560" cy="100" rx="30" ry="18" fill="currentColor" opacity="0.8" />

          {/* Arches and Details */}
          <path d="M 180 150 Q 210 140 240 150 L 240 192 L 180 192 Z" fill="currentColor" opacity="0.6" />
          <path d="M 560 150 Q 590 140 620 150 L 620 192 L 560 192 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      {/* Large Medina Silhouette */}
      <div className="absolute bottom-0 right-0 w-full h-44 opacity-20">
        <svg viewBox="0 0 800 176" className="w-full h-full text-slate-700">
          {/* Main Mosque Structure */}
          <rect x="520" y="90" width="180" height="86" fill="currentColor" />

          {/* Famous Green Dome (Larger) */}
          <ellipse cx="610" cy="90" rx="40" ry="25" fill="#059669" opacity="0.9" />
          <ellipse cx="610" cy="88" rx="35" ry="20" fill="#10b981" opacity="0.7" />
          <circle cx="610" cy="85" r="3" fill="#fbbf24" opacity="0.8" />

          {/* Main Minarets */}
          <rect x="480" y="30" width="18" height="146" fill="currentColor" />
          <ellipse cx="489" cy="30" rx="12" ry="8" fill="currentColor" />
          <rect x="720" y="30" width="18" height="146" fill="currentColor" />
          <ellipse cx="729" cy="30" rx="12" ry="8" fill="currentColor" />

          {/* Secondary Minarets */}
          <rect x="540" y="50" width="15" height="126" fill="currentColor" opacity="0.9" />
          <ellipse cx="547.5" cy="50" rx="10" ry="6" fill="currentColor" opacity="0.9" />
          <rect x="665" y="50" width="15" height="126" fill="currentColor" opacity="0.9" />
          <ellipse cx="672.5" cy="50" rx="10" ry="6" fill="currentColor" opacity="0.9" />

          {/* Supporting Buildings */}
          <rect x="420" y="110" width="80" height="66" fill="currentColor" opacity="0.8" />
          <rect x="720" y="110" width="80" height="66" fill="currentColor" opacity="0.8" />

          {/* Additional Structures */}
          <rect x="380" y="130" width="60" height="46" fill="currentColor" opacity="0.7" />
          <rect x="760" y="130" width="60" height="46" fill="currentColor" opacity="0.7" />

          {/* Smaller Domes */}
          <ellipse cx="460" cy="110" rx="25" ry="15" fill="currentColor" opacity="0.8" />
          <ellipse cx="760" cy="110" rx="25" ry="15" fill="currentColor" opacity="0.8" />

          {/* Architectural Details */}
          <path d="M 520 140 Q 550 130 580 140 L 580 176 L 520 176 Z" fill="currentColor" opacity="0.6" />
          <path d="M 640 140 Q 670 130 700 140 L 700 176 L 640 176 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      {/* Enhanced Floating Light Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float-particle-complex opacity-${30 + Math.random() * 50}`}
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ["#fbbf24", "#60a5fa", "#a78bfa", "#34d399"][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Aurora Borealis Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-400 via-blue-400 to-transparent animate-aurora"></div>
        <div
          className="absolute top-0 right-0 w-full h-24 bg-gradient-to-b from-purple-400 via-pink-400 to-transparent animate-aurora-reverse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-md">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 animate-fade-in-down">
          <div className="relative mb-3 sm:mb-4">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse"></div>
            <img
              src={logo || "/placeholder.svg"}
              alt="Pusdatren Logo"
              className="relative w-12 h-12 sm:w-16 sm:h-16 drop-shadow-2xl transform hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-1 sm:mb-2 animate-fade-in drop-shadow-lg">
            PUSDATREN
          </h1>
          <p className="text-yellow-100 text-xs sm:text-sm md:text-base tracking-wide font-medium opacity-90 animate-fade-in-up drop-shadow-md">
            Pusat Data Pesantren
          </p>
          <div
            className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent mt-2 sm:mt-3 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        {/* Form Card */}
        <div
          className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/30 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="group">
              <label
                htmlFor="email"
                className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors"
              >
                <i className="fas fa-envelope mr-1.5 sm:mr-2 text-indigo-600"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                className="
                  w-full px-3 py-2.5 sm:px-4 sm:py-3 
                  rounded-lg sm:rounded-xl border-2 border-gray-200
                  bg-white text-gray-900 placeholder-gray-400
                  shadow-sm focus:shadow-lg
                  focus:border-indigo-500 focus:ring-2 sm:focus:ring-4 focus:ring-indigo-100
                  transition-all duration-300
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
                className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors"
              >
                <i className="fas fa-lock mr-1.5 sm:mr-2 text-indigo-600"></i>
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
                    shadow-sm focus:shadow-lg
                    focus:border-indigo-500 focus:ring-2 sm:focus:ring-4 focus:ring-indigo-100
                    transition-all duration-300
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
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1"
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`
                w-full rounded-lg sm:rounded-xl px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold shadow-lg
                transform transition-all duration-300
                ${
                  isLoggingIn
                    ? "bg-gray-400 cursor-not-allowed text-white scale-95"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer text-white hover:scale-105 hover:shadow-xl active:scale-95"
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
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-indigo-600 hover:underline font-medium transition-colors duration-200 group"
              >
                <i className="fas fa-question-circle text-xs sm:text-sm group-hover:animate-pulse"></i>
                Bantuan
              </button>

              {/* Forgot Password */}
              <Link
                to="/forgot"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors duration-200 group"
              >
                <i className="fas fa-unlock-alt text-xs sm:text-sm group-hover:animate-bounce"></i>
                Lupa sandi?
              </Link>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3 animate-shake">
                <p className="text-red-600 text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 sm:gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  {loginError}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <p className="text-yellow-100/80 text-xs drop-shadow-md">
            © 2025 Pusdatren. Sistem Informasi Pesantren Modern
          </p>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes moon-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }

        @keyframes star-orbit {
          0% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(15px) translateY(-8px) rotate(90deg);
          }
          50% {
            transform: translateX(8px) translateY(-15px) rotate(180deg);
          }
          75% {
            transform: translateX(-8px) translateY(-8px) rotate(270deg);
          }
          100% {
            transform: translateX(0px) translateY(0px) rotate(360deg);
          }
        }

        @keyframes star-orbit-reverse {
          0% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(-15px) translateY(8px) rotate(-90deg);
          }
          50% {
            transform: translateX(-8px) translateY(15px) rotate(-180deg);
          }
          75% {
            transform: translateX(8px) translateY(8px) rotate(-270deg);
          }
          100% {
            transform: translateX(0px) translateY(0px) rotate(-360deg);
          }
        }

        @keyframes star-spiral {
          0% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateX(20px) translateY(-20px) rotate(180deg) scale(1.2);
          }
          100% {
            transform: translateX(0px) translateY(0px) rotate(360deg) scale(1);
          }
        }

        @keyframes twinkle-bright {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes twinkle-medium {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes twinkle-distant {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }

        @keyframes constellation-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.3);
          }
        }

        @keyframes shooting-star {
          0% {
            opacity: 0;
            transform: translateX(-100px) translateY(0px);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(800px) translateY(-200px);
          }
        }

        @keyframes shooting-star-reverse {
          0% {
            opacity: 0;
            transform: translateX(100px) translateY(0px);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(-800px) translateY(-150px);
          }
        }

        @keyframes shooting-star-diagonal {
          0% {
            opacity: 0;
            transform: translateX(-100px) translateY(100px);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(800px) translateY(-300px);
          }
        }

        /* Enhanced Firework 1 Animations - PUSDATREN */
        @keyframes firework-launch-1 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(1.8);
          }
        }

        @keyframes firework-burst-1 {
          0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
          }
          30% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(3) rotate(360deg);
          }
        }

        @keyframes firework-particle-1 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-30px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0);
          }
        }

        @keyframes firework-particle-1-secondary {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes text-appear-1 {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.5);
          }
          30% {
            opacity: 1;
            transform: translateY(-15px) scale(1.2);
          }
          70% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(251, 191, 36, 0.8), 
              0 0 20px rgba(251, 191, 36, 0.6), 
              0 0 30px rgba(251, 191, 36, 0.4),
              0 0 40px rgba(251, 191, 36, 0.2);
          }
          50% {
            text-shadow: 
              0 0 20px rgba(251, 191, 36, 1), 
              0 0 30px rgba(251, 191, 36, 0.8), 
              0 0 40px rgba(251, 191, 36, 0.6),
              0 0 50px rgba(251, 191, 36, 0.4);
          }
        }

        @keyframes text-glow-pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Enhanced Firework 2 Animations - PUSAT DATA PESANTREN */
        @keyframes firework-launch-2 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-130px) scale(1.8);
          }
        }

        @keyframes firework-burst-2 {
          0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
          }
          30% {
            opacity: 1;
            transform: scale(1.8) rotate(-180deg);
          }
          100% {
            opacity: 0;
            transform: scale(3.5) rotate(-360deg);
          }
        }

        @keyframes firework-particle-2 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-35px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-70px) scale(0);
          }
        }

        @keyframes firework-particle-2-secondary {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-45px) scale(0);
          }
        }

        @keyframes text-appear-2 {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.5);
          }
          30% {
            opacity: 1;
            transform: translateY(-15px) scale(1.2);
          }
          70% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
          }
        }

        @keyframes text-glow-2 {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(16, 185, 129, 0.8), 
              0 0 20px rgba(16, 185, 129, 0.6), 
              0 0 30px rgba(16, 185, 129, 0.4),
              0 0 40px rgba(16, 185, 129, 0.2);
          }
          50% {
            text-shadow: 
              0 0 20px rgba(16, 185, 129, 1), 
              0 0 30px rgba(16, 185, 129, 0.8), 
              0 0 40px rgba(16, 185, 129, 0.6),
              0 0 50px rgba(16, 185, 129, 0.4);
          }
        }

        @keyframes text-glow-pulse-2 {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Decorative Firework Animations */
        @keyframes firework-launch-3 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-80px) scale(1.3);
          }
        }

        @keyframes firework-burst-3 {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.8);
          }
        }

        @keyframes firework-particle-3 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0);
          }
        }

        @keyframes firework-launch-4 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-85px) scale(1.4);
          }
        }

        @keyframes firework-burst-4 {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.9);
          }
        }

        @keyframes firework-particle-4 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-45px) scale(0);
          }
        }

        @keyframes float-particle-complex {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }

        @keyframes cloud-drift {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        @keyframes cloud-drift-reverse {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100px);
          }
        }

        @keyframes cloud-drift-slow {
          0% {
            transform: translateX(-50px);
          }
          100% {
            transform: translateX(calc(100vw + 50px));
          }
        }

        @keyframes nebula-drift {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(30px) translateY(-20px) rotate(180deg);
          }
        }

        @keyframes nebula-drift-reverse {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-30px) translateY(20px) rotate(-180deg);
          }
        }

        @keyframes aurora {
          0%, 100% {
            opacity: 0.05;
            transform: translateX(0px) scaleX(1);
          }
          50% {
            opacity: 0.15;
            transform: translateX(20px) scaleX(1.1);
          }
        }

        @keyframes aurora-reverse {
          0%, 100% {
            opacity: 0.05;
            transform: translateX(0px) scaleX(1);
          }
          50% {
            opacity: 0.15;
            transform: translateX(-20px) scaleX(1.1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        /* Animation Classes */
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-moon-float {
          animation: moon-float 8s ease-in-out infinite;
        }

        .animate-star-orbit {
          animation: star-orbit 8s ease-in-out infinite;
        }

        .animate-star-orbit-reverse {
          animation: star-orbit-reverse 10s ease-in-out infinite;
        }

        .animate-star-spiral {
          animation: star-spiral 12s ease-in-out infinite;
        }

        .animate-twinkle-bright {
          animation: twinkle-bright 2s ease-in-out infinite;
        }

        .animate-twinkle-medium {
          animation: twinkle-medium 2.5s ease-in-out infinite;
        }

        .animate-twinkle-distant {
          animation: twinkle-distant 3s ease-in-out infinite;
        }

        .animate-constellation-pulse {
          animation: constellation-pulse 2.5s ease-in-out infinite;
        }

        .animate-shooting-star {
          animation: shooting-star 6s linear infinite;
        }

        .animate-shooting-star-reverse {
          animation: shooting-star-reverse 8s linear infinite;
        }

        .animate-shooting-star-diagonal {
          animation: shooting-star-diagonal 7s linear infinite;
        }

        /* Enhanced Firework Animation Classes */
        .animate-firework-launch-1 {
          animation: firework-launch-1 1.5s ease-out forwards;
        }

        .animate-firework-burst-1 {
          animation: firework-burst-1 2.5s ease-out forwards;
        }

        .animate-firework-particle-1 {
          animation: firework-particle-1 3s ease-out forwards;
        }

        .animate-firework-particle-1-secondary {
          animation: firework-particle-1-secondary 2.5s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .animate-text-appear-1 {
          animation: text-appear-1 4s ease-out forwards;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-text-glow-pulse {
          animation: text-glow-pulse 3s ease-in-out infinite;
        }

        .animate-firework-launch-2 {
          animation: firework-launch-2 1.5s ease-out forwards;
        }

        .animate-firework-burst-2 {
          animation: firework-burst-2 2.5s ease-out forwards;
        }

        .animate-firework-particle-2 {
          animation: firework-particle-2 3s ease-out forwards;
        }

        .animate-firework-particle-2-secondary {
          animation: firework-particle-2-secondary 2.5s ease-out forwards;
        }

        .animate-text-appear-2 {
          animation: text-appear-2 4s ease-out forwards;
        }

        .animate-text-glow-2 {
          animation: text-glow-2 2s ease-in-out infinite;
        }

        .animate-text-glow-pulse-2 {
          animation: text-glow-pulse-2 3s ease-in-out infinite;
        }

        /* Decorative Firework Animations */
        @keyframes firework-launch-3 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-80px) scale(1.3);
          }
        }

        @keyframes firework-burst-3 {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.8);
          }
        }

        @keyframes firework-particle-3 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0);
          }
        }

        @keyframes firework-launch-4 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-85px) scale(1.4);
          }
        }

        @keyframes firework-burst-4 {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.9);
          }
        }

        @keyframes firework-particle-4 {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-45px) scale(0);
          }
        }

        @keyframes float-particle-complex {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }

        @keyframes cloud-drift {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        @keyframes cloud-drift-reverse {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100px);
          }
        }

        @keyframes cloud-drift-slow {
          0% {
            transform: translateX(-50px);
          }
          100% {
            transform: translateX(calc(100vw + 50px));
          }
        }

        @keyframes nebula-drift {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(30px) translateY(-20px) rotate(180deg);
          }
        }

        @keyframes nebula-drift-reverse {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-30px) translateY(20px) rotate(-180deg);
          }
        }

        @keyframes aurora {
          0%, 100% {
            opacity: 0.05;
            transform: translateX(0px) scaleX(1);
          }
          50% {
            opacity: 0.15;
            transform: translateX(20px) scaleX(1.1);
          }
        }

        @keyframes aurora-reverse {
          0%, 100% {
            opacity: 0.05;
            transform: translateX(0px) scaleX(1);
          }
          50% {
            opacity: 0.15;
            transform: translateX(-20px) scaleX(1.1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        /* Animation Classes */
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-moon-float {
          animation: moon-float 8s ease-in-out infinite;
        }

        .animate-star-orbit {
          animation: star-orbit 8s ease-in-out infinite;
        }

        .animate-star-orbit-reverse {
          animation: star-orbit-reverse 10s ease-in-out infinite;
        }

        .animate-star-spiral {
          animation: star-spiral 12s ease-in-out infinite;
        }

        .animate-twinkle-bright {
          animation: twinkle-bright 2s ease-in-out infinite;
        }

        .animate-twinkle-medium {
          animation: twinkle-medium 2.5s ease-in-out infinite;
        }

        .animate-twinkle-distant {
          animation: twinkle-distant 3s ease-in-out infinite;
        }

        .animate-constellation-pulse {
          animation: constellation-pulse 2.5s ease-in-out infinite;
        }

        .animate-shooting-star {
          animation: shooting-star 6s linear infinite;
        }

        .animate-shooting-star-reverse {
          animation: shooting-star-reverse 8s linear infinite;
        }

        .animate-shooting-star-diagonal {
          animation: shooting-star-diagonal 7s linear infinite;
        }

        /* Enhanced Firework Animation Classes */
        .animate-firework-launch-1 {
          animation: firework-launch-1 1.5s ease-out forwards;
        }

        .animate-firework-burst-1 {
          animation: firework-burst-1 2.5s ease-out forwards;
        }

        .animate-firework-particle-1 {
          animation: firework-particle-1 3s ease-out forwards;
        }

        .animate-firework-particle-1-secondary {
          animation: firework-particle-1-secondary 2.5s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .animate-text-appear-1 {
          animation: text-appear-1 4s ease-out forwards;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-text-glow-pulse {
          animation: text-glow-pulse 3s ease-in-out infinite;
        }

        .animate-firework-launch-2 {
          animation: firework-launch-2 1.5s ease-out forwards;
        }

        .animate-firework-burst-2 {
          animation: firework-burst-2 2.5s ease-out forwards;
        }

        .animate-firework-particle-2 {
          animation: firework-particle-2 3s ease-out forwards;
        }

        .animate-firework-particle-2-secondary {
          animation: firework-particle-2-secondary 2.5s ease-out forwards;
        }

        .animate-text-appear-2 {
          animation: text-appear-2 4s ease-out forwards;
        }

        .animate-text-glow-2 {
          animation: text-glow-2 2s ease-in-out infinite;
        }

        .animate-text-glow-pulse-2 {
          animation: text-glow-pulse-2 3s ease-in-out infinite;
        }

        .animate-firework-launch-3 {
          animation: firework-launch-3 1s ease-out forwards;
        }

        .animate-firework-burst-3 {
          animation: firework-burst-3 1.5s ease-out forwards;
        }

        .animate-firework-particle-3 {
          animation: firework-particle-3 2s ease-out forwards;
        }

        .animate-firework-launch-4 {
          animation: firework-launch-4 1s ease-out forwards;
        }

        .animate-firework-burst-4 {
          animation: firework-burst-4 1.5s ease-out forwards;
        }

        .animate-firework-particle-4 {
          animation: firework-particle-4 2s ease-out forwards;
        }

        .animate-float-particle-complex {
          animation: float-particle-complex 8s ease-in-out infinite;
        }

        .animate-cloud-drift {
          animation: cloud-drift 60s linear infinite;
        }

        .animate-cloud-drift-reverse {
          animation: cloud-drift-reverse 80s linear infinite;
        }

        .animate-cloud-drift-slow {
          animation: cloud-drift-slow 100s linear infinite;
        }

        .animate-nebula-drift {
          animation: nebula-drift 20s ease-in-out infinite;
        }

        .animate-nebula-drift-reverse {
          animation: nebula-drift-reverse 25s ease-in-out infinite;
        }

        .animate-aurora {
          animation: aurora 15s ease-in-out infinite;
        }

        .animate-aurora-reverse {
          animation: aurora-reverse 18s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}

export default LoginPage
