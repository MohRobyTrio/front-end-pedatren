import { 
  Eye, 
  Settings,
  Plus, 
  Minus, 
  Send, 
  Heart, 
  Building, 
  CreditCard,
  MessageCircle 
} from 'lucide-react';

const QuickActions = ({ onAction, unreadMessages }) => {
  const actions = [
    {
      id: 'balance',
      label: 'Ganti PIN',
      icon: Settings,
      color: 'from-blue-500 to-blue-600',
      description: 'Ubah PIN Anda'
    },
    {
      id: 'deposit',
      label: 'Setor Tunai',
      icon: Plus,
      color: 'from-green-500 to-green-600',
      description: 'Tambah saldo'
    },
    {
      id: 'withdraw',
      label: 'Tarik Tunai',
      icon: Minus,
      color: 'from-orange-500 to-orange-600',
      description: 'Ambil uang tunai'
    },
    {
      id: 'transfer',
      label: 'Transfer',
      icon: Send,
      color: 'from-purple-500 to-purple-600',
      description: 'Kirim ke santri lain'
    },
    {
      id: 'infaq',
      label: 'Infaq',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      description: 'Sedekah infaq'
    },
    {
      id: 'wakaf',
      label: 'Wakaf',
      icon: Building,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Wakaf untuk masjid'
    },
    {
      id: 'payment',
      label: 'Pembayaran',
      icon: CreditCard,
      color: 'from-teal-500 to-teal-600',
      description: 'Bayar SPP & biaya'
    },
    {
      id: 'messages',
      label: 'Pesan',
      icon: MessageCircle,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Pesan dari orang tua',
      badge: unreadMessages > 0 ? unreadMessages : undefined
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 group flex flex-col items-center text-center"
          >
            <div className={`bg-gradient-to-r ${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="font-semibold text-slate-800 mb-1">{action.label}</h3>
            <p className="text-xs text-slate-500">{action.description}</p>
            
            {action.badge && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {action.badge}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;