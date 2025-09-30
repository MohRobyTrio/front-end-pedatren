import { Wallet, Eye, TrendingUp, Calendar } from 'lucide-react';

const BalanceCheck = ({ student, onClose }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cek Saldo</h2>
        <p className="text-slate-600">Informasi saldo terkini Anda</p>
      </div>

      <div className="space-y-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Saldo Tersedia</p>
              <p className="text-3xl font-bold">
                Rp {student.balance.toLocaleString('id-ID')}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              Per {new Date().toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Nama Rekening</p>
              <p className="font-medium text-slate-800">{student.name}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">NIS</p>
              <p className="font-medium text-slate-800">{student.nis}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-xl">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Saldo Aktif</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Selesai
      </button>
    </div>
  );
};

export default BalanceCheck;