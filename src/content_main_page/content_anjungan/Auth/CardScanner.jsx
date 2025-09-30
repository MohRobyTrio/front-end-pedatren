import { useState } from 'react';
import { CreditCard, Scan } from 'lucide-react';

const CardScanner = ({ onCardScanned }) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScanClick = () => {
    setScanning(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          // Simulate card scan success
          setTimeout(() => onCardScanned('CARD001'), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
        <p className="text-slate-600">Scan kartu santri Anda untuk memulai</p>
      </div>

      <div className="mb-8">
        <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center relative overflow-hidden">
          {scanning && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100 to-transparent animate-pulse"
              style={{ width: `${progress}%` }}
            />
          )}
          <Scan className={`w-12 h-12 mx-auto mb-4 ${scanning ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
          <p className="text-slate-500 mb-4">
            {scanning ? 'Memindai kartu...' : 'Tempelkan kartu di sini'}
          </p>
          {scanning && (
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleScanClick}
        disabled={scanning}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {scanning ? 'Memindai...' : 'Mulai Scan Kartu'}
      </button>

      <p className="text-xs text-slate-500 text-center mt-4">
        * Untuk demo, klik tombol di atas untuk simulasi scan kartu
      </p>
    </div>
  );
};

export default CardScanner;