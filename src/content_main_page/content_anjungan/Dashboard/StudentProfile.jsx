import { MapPin, Calendar, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';

// Card reusable
const Card = ({ className = '', children, delay = 0, onClick, ...props }) => {
    return (
        <div
            className={`rounded-xl transition-all duration-300 hover:shadow-lg ${className}`}
            style={{
                animationDelay: `${delay}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
            }}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

// Komponen Button
const Button = ({ variant = 'primary', size = 'md', onClick, className = '', children, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    };

    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

// Badge sederhana
const Badge = ({ className = '', children }) => {
    return (
        <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${className}`}
        >
            {children}
        </span>
    );
};

// Profile Image (bisa diganti dengan Avatar lib lain kalau perlu)
const ProfileImage = ({ src, alt, size = 'lg', className = '' }) => {
    const sizeMap = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
    };

    return (
        <img
            src={src}
            alt={alt}
            className={`${sizeMap[size]} rounded-full object-cover ${className}`}
        />
    );
};

const StudentProfile = ({ student }) => {
    const [showBalance, setShowBalance] = useState(true);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Student Info Card */}
            <div className="xl:col-span-7">
                <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                            <div className="mr-4">
                                <ProfileImage
                                    src={student.photo || '/default-avatar.png'}
                                    alt={student.name}
                                    size="lg"
                                    className="ring-4 ring-blue-100"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Informasi Santri</h3>
                                <p className="text-gray-600 text-sm">Data pribadi dan akademik</p>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                                    <p className="font-medium text-lg">{student.name || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Kelas</p>
                                    <p className="font-medium">{student.class || '-'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">NIS</p>
                                    <p className="font-medium">{student.nis || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Asrama</p>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                                        <p className="font-medium">{student.dormitory || 'Belum terdaftar'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                                <Badge className="bg-green-100 text-green-800 border border-green-200">
                                    {student.status || 'Aktif'}
                                </Badge>
                                <div className="text-sm text-gray-600 flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Transaksi terakhir: {student.lastTransaction || '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Saldo Card */}
            <div className="xl:col-span-5">
                {/* <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl">
                    <div className="p-6 flex flex-col justify-between h-full">
                        <div>
                            <p className="text-emerald-100 text-sm mb-1">Saldo Tersedia</p>
                            <p className="text-3xl font-bold">
                                Rp {student.balance?.toLocaleString('id-ID') || '0'}
                            </p>
                        </div>
                        <div className="mt-4 text-right text-sm opacity-90">
                            Update terakhir: {student.lastTransaction || '-'}
                        </div>
                    </div>
                </Card> */}
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl" delay={100}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <FaWallet className="w-6 h-6 mr-3" />
                                <h3 className="text-lg">Saldo Aktif</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowBalance(!showBalance)}
                                className="text-white hover:bg-white/20 p-2"
                            >
                                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="mb-4">
                            <div className="text-3xl mb-2">
                                {showBalance
                                    ? "Rp " + (student.balance?.toLocaleString("id-ID") || "0")
                                    : "••••••••"}
                            </div>
                            <div className="flex items-center text-green-100">
                                <FiTrendingUp className="w-4 h-4 mr-1" />
                                <span className="text-sm">Tersedia untuk transaksi</span>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-green-100">Limit harian</span>
                                <span>Rp 500.000</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div
                                    className="bg-white rounded-full h-2 transition-all duration-500"
                                    style={{ width: `${Math.min((student.balance / 500000) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentProfile;
