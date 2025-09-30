import { 
  Plus, 
  Minus, 
  Send, 
  CreditCard, 
  Heart, 
  Building,
  Clock
} from 'lucide-react';

const RecentTransactions = ({ transactions }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return Plus;
      case 'withdrawal': return Minus;
      case 'transfer': return Send;
      case 'payment': return CreditCard;
      case 'infaq': return Heart;
      case 'wakaf': return Building;
      default: return Clock;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return 'text-green-600 bg-green-100';
      case 'withdrawal': return 'text-orange-600 bg-orange-100';
      case 'transfer': return 'text-purple-600 bg-purple-100';
      case 'payment': return 'text-blue-600 bg-blue-100';
      case 'infaq': return 'text-pink-600 bg-pink-100';
      case 'wakaf': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getAmountColor = (type) => {
    return type === 'deposit' ? 'text-green-600' : 'text-red-600';
  };

  const getAmountPrefix = (type) => {
    return type === 'deposit' ? '+' : '-';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Transaksi Terakhir</h3>
        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => {
          const IconComponent = getTransactionIcon(transaction.type);
          const colorClass = getTransactionColor(transaction.type);
          const amountColor = getAmountColor(transaction.type);
          const amountPrefix = getAmountPrefix(transaction.type);

          return (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{transaction.description}</p>
                  <p className="text-sm text-slate-500">
                    {transaction.timestamp.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${amountColor}`}>
                  {amountPrefix}Rp {transaction.amount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada transaksi</p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;