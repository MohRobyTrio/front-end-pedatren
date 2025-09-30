import { useState } from 'react';
import { Plus, Banknote } from 'lucide-react';

const DepositForm = ({ onDeposit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [50000, 100000, 250000, 500000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const depositAmount = parseInt(amount);
    
    if (depositAmount < 10000) {
      alert('Minimum setoran adalah Rp 10.000');
      return;
    }

    setLoading(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    onDeposit(depositAmount);
  };

  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/\D/g, ''));
    return isNaN(number) ? '' : number.toString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Setor Tunai</h2>
        <p className="text-slate-600">Tambahkan saldo ke rekening Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Jumlah Setoran
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-500">Rp</span>
            </div>
            <input
              type="text"
              value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
              onChange={(e) => setAmount(formatCurrency(e.target.value))}
              className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-lg font-semibold"
              placeholder="0"
              required
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Minimum setoran Rp 10.000</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Pilih Cepat</p>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className="p-3 border border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-sm font-medium"
              >
                Rp {quickAmount.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!amount || loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Memproses...
              </>
            ) : (
              <>
                <Banknote className="w-5 h-5" />
                Setor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositForm;