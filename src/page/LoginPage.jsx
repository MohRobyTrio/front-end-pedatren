import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/Login";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoggingIn, loginError } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });
      // Simpan token bila perlu: localStorage.setItem("token", userData.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message); // Atau tampilkan ke UI
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
    <section className="relative min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="absolute top-10 flex flex-col items-center">
        <img
          className="w-20 h-20"
          src="https://play-lh.googleusercontent.com/AfPIZgh2gk3qe92PeBz9TLcQ6HzXWbScrgWGa7tr-pXS0tXm_g1duxHNBsDvlh-Q_Q=w480-h960-rw"
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
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-500">
              <input type="checkbox" className="mr-2" /> Ingat saya
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Lupa kata sandi?
            </a>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5 text-center"
          >
            {isLoggingIn ? <Load/> : "Login"}
          </button>
          {loginError && <p className="text-red-500 text-sm mt-2 text-center">{loginError}</p>}
          <p className="text-sm text-center text-gray-500 mt-4">
            Belum punya akun?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Register
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
