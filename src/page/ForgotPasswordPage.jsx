import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; // Icon panah kiri
import logo from "../assets/logoku.png";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../hooks/config";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email wajib diisi",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      Swal.fire({
        background: "transparent",    // tanpa bg putih box
        showConfirmButton: false,     // tanpa tombol
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
        }
      });
      const response = await fetch(`${API_BASE_URL}forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      Swal.close();
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Terjadi kesalahan.");

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: data.message || "Cek email untuk reset password.",
      });
      setEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-sm bg-gray-900/95 border border-gray-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-14 mb-2" />
          <h2 className="text-xl font-bold mb-1 text-white">Lupa Sandi</h2>
          <p className="text-xs text-gray-400 text-center">Masukkan email anda</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="
      w-full px-3 py-2
      rounded-lg border border-gray-300
      bg-white/80 text-gray-900 placeholder-gray-500
      shadow-sm focus:shadow-lg
      focus:border-blue-600 focus:ring-2 focus:ring-blue-300
      transition-all duration-200
      outline-none text-sm
    "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-500 hover:underline"
          >
            <FiArrowLeft className="text-base" />
            Kembali ke login
          </Link>
        </div>
      </div>
    </section>

  );
};

export default ForgotPasswordPage;
