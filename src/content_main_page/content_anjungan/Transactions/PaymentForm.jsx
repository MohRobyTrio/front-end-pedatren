import React, { useState } from 'react';
import { CreditCard, Check, BookOpen, Utensils, GraduationCap, Calendar } from 'lucide-react';

const PaymentForm = ({ payments, onPayment, onCancel }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'spp': return GraduationCap;
      case 'makan': return Utensils;
      case 'kitab': return BookOpen;
      case 'kegiatan': return Calendar;
      default: return CreditCard;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'spp': return 'from-blue-500 to-blue-600';
      case 'makan': return 'from-orange-500 to-orange-600';
      case 'kitab': return 'from-green-500 to-green-600';
      case 'kegiatan': return 'from-purple-500 to-purple-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onPayment(selectedPayment.id, selectedPayment.amount);
  };

  if (selectedPayment) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Konfirmasi Pembayaran</h2>
          <p className="text-slate-600">Pastikan detail pembayaran sudah benar</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              {React.createElement(getCategoryIcon(selectedPayment.category), {
                className: "w-6 h-6 text-slate-600"
              })}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{selectedPayment.name}</h3>
                <p className="text-sm text-slate-600">{selectedPayment.description}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-slate-800">
                  Rp {selectedPayment.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 rounded-xl p-4">
            <div className="flex items-center gap-3 text-teal-700">
              <Check className="w-5 h-5" />
              <p className="text-sm font-medium">
                Pembayaran akan diproses secara otomatis dan bukti pembayaran akan tersedia setelah transaksi selesai.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setSelectedPayment(null)}
            className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
          >
            Kembali
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Memproses...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Bayar Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pembayaran</h2>
        <p className="text-slate-600">Pilih jenis pembayaran yang ingin dilakukan</p>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => {
          const IconComponent = getCategoryIcon(payment.category);
          const colorClass = getCategoryColor(payment.category);

          return (
            <button
              key={payment.id}
              onClick={() => setSelectedPayment(payment)}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-r ${colorClass} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{payment.name}</h3>
                    <p className="text-sm text-slate-600">{payment.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">
                    Rp {payment.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Tidak ada tagihan</p>
          <p className="text-sm">Semua pembayaran sudah lunas</p>
        </div>
      )}

      <button
        onClick={onCancel}
        className="w-full mt-8 bg-slate-100 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
      >
        Kembali ke Menu Utama
      </button>
    </div>
  );
};

export default PaymentForm;