"use client"

import { useState, useRef, useEffect } from "react"
import { Eye, EyeOff, CheckCircle, Shield, Lock } from "lucide-react"

const ChangePinPage = () => {
  const [step, setStep] = useState("current")
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")

  const correctCurrentPin = "123456"

  const inputRefs = useRef(Array.from({ length: 6 }, () => null))

  const getActivePin = () => (step === "current" ? currentPin : step === "new" ? newPin : confirmPin)
  const setActivePin = (updater) => {
    const next = typeof updater === "function" ? updater(getActivePin()) : updater
    if (step === "current") setCurrentPin(next)
    else if (step === "new") setNewPin(next)
    else setConfirmPin(next)
  }

  const clearPin = () => {
    setActivePin("")
    setError("")
    inputRefs.current?.[0]?.focus()
  }

  const handleNumberClick = (number) => {
    const activePin = step === "current" ? currentPin : step === "new" ? newPin : confirmPin
    const setActivePin = step === "current" ? setCurrentPin : step === "new" ? setNewPin : setConfirmPin

    if (activePin.length < 6) {
      setActivePin((prev) => prev + number)
      setError("")
    }
  }

  const handleClear = () => {
    if (step === "current") setCurrentPin("")
    else if (step === "new") setNewPin("")
    else setConfirmPin("")
    setError("")
  }

  const handleNext = () => {
    if (step === "current") {
      if (currentPin.length !== 6) {
        setError("PIN harus 6 digit")
        return
      }
      if (currentPin !== correctCurrentPin) {
        setError("PIN lama salah")
        setCurrentPin("")
        return
      }
      setStep("new")
    } else if (step === "new") {
      if (newPin.length !== 6) {
        setError("PIN baru harus 6 digit")
        return
      }
      if (newPin === correctCurrentPin) {
        setError("PIN baru harus berbeda dari PIN lama")
        setNewPin("")
        return
      }
      setStep("confirm")
    } else if (step === "confirm") {
      if (confirmPin.length !== 6) {
        setError("Konfirmasi PIN harus 6 digit")
        return
      }
      if (confirmPin !== newPin) {
        setError("PIN tidak cocok")
        setConfirmPin("")
        return
      }
      setStep("success")
    }
  }

  const handleBack = () => {
    if (step === "current") {
      alert("Kembali ke dashboard") // ganti sesuai kebutuhan
    } else if (step === "new") {
      setStep("current")
      setNewPin("")
    } else if (step === "confirm") {
      setStep("new")
      setConfirmPin("")
    }
    setError("")
  }

  const getCurrentPin = () => {
    switch (step) {
      case "current":
        return currentPin
      case "new":
        return newPin
      case "confirm":
        return confirmPin
      default:
        return ""
    }
  }

  const getTitle = () => {
    switch (step) {
      case "current":
        return "Verifikasi PIN Lama"
      case "new":
        return "Buat PIN Baru"
      case "confirm":
        return "Konfirmasi PIN Baru"
      case "success":
        return "PIN Berhasil Diubah"
    }
  }

  const getSubtitle = () => {
    switch (step) {
      case "current":
        return "Masukkan PIN lama untuk verifikasi keamanan"
      case "new":
        return "Buat PIN baru yang aman (6 digit)"
      case "confirm":
        return "Masukkan ulang PIN baru untuk konfirmasi"
      case "success":
        return "PIN Anda telah berhasil diperbarui"
    }
  }

  const handleInputChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const active = getActivePin()
    // jika empty: hapus karakter di posisi index (fallback: hapus terakhir)
    if (value === "") {
      let next = active
      if (index < active.length) {
        next = active.slice(0, index) + active.slice(index + 1)
      } else if (active.length > 0) {
        next = active.slice(0, -1)
      }
      setActivePin(next)
      const prev = Math.max(0, index - 1)
      inputRefs.current?.[prev]?.focus()
      return
    }
    // isi 1 digit
    if (active.length >= 6) return
    let next = ""
    if (index === active.length) {
      next = active + value
    } else if (index < active.length) {
      next = active.slice(0, index) + value + active.slice(index + 1)
    } else {
      // jika user klik kotak di depan, isi di akhir agar urut
      next = active + value
    }
    setActivePin(next)
    const nextIdx = Math.min(5, index + 1)
    inputRefs.current?.[nextIdx]?.focus()
    setError("")
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const active = getActivePin()
      if (active.length === 0) return
      if (index === 0 && active.length > 0) {
        setActivePin(active.slice(0, -1))
        inputRefs.current?.[0]?.focus()
      } else {
        handleInputChange(index, "")
      }
      e.preventDefault()
    }
    if (e.key === "ArrowLeft") {
      inputRefs.current?.[Math.max(0, index - 1)]?.focus()
      e.preventDefault()
    }
    if (e.key === "ArrowRight") {
      inputRefs.current?.[Math.min(5, index + 1)]?.focus()
      e.preventDefault()
    }
    if (e.key === "Enter") {
      if (getActivePin().length === 6) handleNext()
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (["current", "new", "confirm"].includes(step) && getActivePin().length === 6) {
      const t = setTimeout(() => handleNext(), 200)
      return () => clearTimeout(t)
    }
  }, [step, currentPin, newPin, confirmPin])

  useEffect(() => {
    inputRefs.current?.[0]?.focus()
  }, [step])

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl mb-3 text-green-600">PIN Berhasil Diubah!</h2>
          <p className="text-gray-600 mb-8">
            PIN Anda telah berhasil diperbarui. Gunakan PIN baru untuk transaksi selanjutnya.
          </p>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6 flex items-center justify-center text-green-600">
            <Shield className="w-5 h-5 mr-2" />
            <span className="text-sm">Keamanan akun meningkat</span>
          </div>
          <button
            onClick={() => alert("Kembali ke dashboard")}
            className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        {/* <div className="flex items-center mb-6">
          <button onClick={handleBack} className="text-white mr-4" aria-label="Kembali">
            ←
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">{getTitle()}</h1>
            <p className="text-sm text-blue-200">{getSubtitle()}</p>
          </div>
        </div> */}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{getTitle()}</h2>
            <p className="text-slate-600">{getSubtitle()}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            {["current", "new", "confirm"].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    step === stepName
                      ? "bg-blue-600"
                      : ["current", "new", "confirm"].indexOf(step) > index
                        ? "bg-green-500"
                        : "bg-gray-300"
                  }`}
                />
                {index < 2 && <div className="w-8 h-0.5 bg-gray-300 mx-1" />}
              </div>
            ))}
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">Keamanan Tinggi</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="sr-only" htmlFor="pin-input-0">
              Masukkan PIN 6 digit
            </label>
            <div className="flex justify-center gap-4 mb-4">
              {[...Array(6)].map((_, index) => {
                const active = getActivePin()
                const value = active[index] ?? ""
                return (
                  <input
                    key={index}
                    id={`pin-input-${index}`}
                    ref={(el) => (inputRefs.current[index] = el)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    type={showPin ? "text" : "password"}
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value.slice(-1))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200"
                    aria-label={`Digit PIN ${index + 1}`}
                  />
                )
              })}
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors duration-200"
                aria-pressed={showPin}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          </div>

          {/* sebelumnya: grid angka 3 kolom dengan Clear, 0, OK */}

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={clearPin}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              Hapus
            </button>
            <button
              onClick={handleBack}
              className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-semibold hover:bg-red-200 transition-colors duration-200"
            >
              Batal
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-xs text-yellow-800 text-center bg-yellow-50 p-3 rounded-lg flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1" />
            PIN baru harus berbeda dari PIN lama dan mudah diingat namun sulit ditebak
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePinPage
