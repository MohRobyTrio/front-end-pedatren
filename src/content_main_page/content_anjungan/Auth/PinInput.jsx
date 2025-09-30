import { useState, useRef, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PinInput = ({ 
  onPinComplete, 
  onCancel, 
  title = "Masukkan PIN",
  subtitle = "Masukkan 4 digit PIN Anda"
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every(digit => digit !== '') && newPin.join('').length === 4) {
      setTimeout(() => onPinComplete(newPin.join('')), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearPin = () => {
    setPin(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600">{subtitle}</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-center gap-4 mb-4">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type={showPin ? 'text' : 'password'}
              value={digit}
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              maxLength={1}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200"
            />
          ))}
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowPin(!showPin)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors duration-200"
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearPin}
          className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
        >
          Hapus
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-semibold hover:bg-red-200 transition-colors duration-200"
        >
          Batal
        </button>
      </div>

      <p className="text-xs text-slate-500 text-center mt-4">
        * PIN demo: 1234
      </p>
    </div>
  );
};

export default PinInput;