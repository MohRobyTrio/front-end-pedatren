import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const FormUser = ({ register }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <>
            <div className="space-y-2">
                {/* Input Keterangan */}
                {/* Nama */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="name" className="md:w-1/4 text-black">
                        Nama pengguna *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md pl-1 border border-gray-500 bg-white">
                            <input
                                id="name"
                                type="text"
                                autoComplete="off"
                                placeholder="Masukkan Nama"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                maxLength={255}
                                {...register("modalUser.name", { required: true })}
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="email" className="md:w-1/4 text-black">
                        Email *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md pl-1 border border-gray-500 bg-white">
                            <input
                                id="email"
                                type="email"
                                placeholder="Masukkan Email"
                                autoComplete="off"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                maxLength={255}
                                {...register("modalUser.email", { required: true })}
                            />
                        </div>
                    </div>
                </div>

                {/* Password */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="password" className="md:w-1/4 text-black">
                        Password *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="relative flex items-center rounded-md shadow-md pl-1 border border-gray-500 bg-white">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan Password"
                                autoComplete="new-password"
                                className="w-full py-1.5 pr-10 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalUser.password", { required: true })}
                            />
                            <button
                                type="button"
                                className="absolute right-2 text-sm text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="confirm_password" className="md:w-1/4 text-black">
                        Confirm Password *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="relative flex items-center rounded-md shadow-md pl-1 border border-gray-500 bg-white">
                            <input
                                id="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Konfirmasi Password"
                                className="w-full py-1.5 pr-10 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register("modalUser.confirm_password", { required: true })}
                            />
                            <button
                                type="button"
                                className="absolute right-2 text-sm text-gray-500"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Role */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="role" className="md:w-1/4 text-black">
                        Role *
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md border border-gray-500 bg-white">
                            <select
                                id="role"
                                className="w-full py-1.5 pl-2 text-base text-gray-900 focus:outline-none sm:text-sm"
                                {...register("modalUser.role", { required: true })}
                            >
                                <option value="">Pilih Role</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="staff">Staff</option>
                                <option value="santri">Santri</option>
                                <option value="kamtib">Kamtib</option>
                                <option value="biktren">Biktren</option>
                                <option value="pengasuh">Pengasuh</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label className="md:w-1/4 text-black">Status *</label>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="1"
                                {...register("modalUser.status", { required: true })}
                            />
                            <span>Aktif</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="0"
                                {...register("modalUser.status", { required: true })}
                            />
                            <span>Tidak Aktif</span>
                        </label>
                    </div>
                </div>

            </div>

        </>
    )
};

export default FormUser;