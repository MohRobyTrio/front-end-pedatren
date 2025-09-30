import { useState } from 'react';
import { Heart, HandHeart } from 'lucide-react';

const InfaqForm = ({ onInfaq, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [10000, 25000, 50000, 100000];
  const purposes = [
    'Infaq Umum',
    'Infaq Jumat',
    'Bantuan Yatim Piatu',
    'Infaq Pembangunan',
    'Infaq Kegiatan'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const infaqAmount = parseInt(amount);
    
    if (infaqAmount < 5000) {
      alert('Minimum infaq adalah Rp 5.000');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onInfaq(infaqAmount, purpose);
  };

  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/\D/g, ''));
    return isNaN(number) ? '' : number.toString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Infaq</h2>
        <p className="text-slate-600">Berbagi kebaikan melalui infaq</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Jumlah Infaq
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-500">Rp</span>
            </div>
            <input
              type="text"
              value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
              onChange={(e) => setAmount(formatCurrency(e.target.value))}
              className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-lg font-semibold"
              placeholder="0"
              required
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Minimum infaq Rp 5.000</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Pilih Cepat</p>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className="p-3 border border-slate-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 text-sm font-medium"
              >
                Rp {quickAmount.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tujuan Infaq
          </label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none font-medium"
            required
          >
            <option value="">Pilih tujuan infaq</option>
            {purposes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="bg-pink-50 rounded-xl p-4">
          <div className="flex items-center gap-3 text-pink-700">
            <HandHeart className="w-5 h-5" />
            <p className="text-sm font-medium">
              Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir benih yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji. - QS Al-Baqarah: 261
            </p>
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
            disabled={!amount || !purpose || loading}
            className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Memproses...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Berinfaq
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfaqForm;