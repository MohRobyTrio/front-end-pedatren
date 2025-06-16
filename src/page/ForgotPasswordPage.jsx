import { useState } from "react";
import { Link } from "react-router-dom";
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
                title: 'Mohon tunggu...',
                html: 'Sedang proses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
      const response = await fetch(`${API_BASE_URL}forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      Swal.close();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan.");
      }

      Swal.fire({
        icon: "success",
        title: "Permintaan Dikirim",
        text: data.message || "Silakan cek email Anda untuk reset password.",
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
    <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 overflow-y-auto">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          Lupa Password
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Masukkan email Anda untuk menerima tautan reset password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Kirim Tautan Reset
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
