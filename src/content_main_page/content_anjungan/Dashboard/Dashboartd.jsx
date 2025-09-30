import { useState } from 'react';
import { 
  User, 
  Wallet, 
  Settings, 
  MessageCircle, 
  ArrowRightLeft, 
  LogOut,
  Bell,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);

  // Data dummy untuk tampilan
  const studentData = {
    name: 'Ahmad Fauzi',
    class: 'XII IPA 1',
    studentId: '20240001',
    dormitory: 'Asrama Al-Falah',
    status: 'Aktif',
    lastTransaction: '15 Jan 2024',
    balance: 1250000,
    profileImage: '/default-avatar.png'
  };

  const unreadMessages = 3;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const recentActivities = [
    { 
      type: 'Kantin', 
      amount: -15000, 
      date: '2024-01-15', 
      time: '12:30', 
      category: 'food',
      description: 'Kantin Pusat - Makan Siang'
    },
    { 
      type: 'Top Up', 
      amount: 100000, 
      date: '2024-01-14', 
      time: '08:15', 
      category: 'topup',
      description: 'Transfer dari Orang Tua'
    },
    { 
      type: 'Buku', 
      amount: -25000, 
      date: '2024-01-13', 
      time: '14:20', 
      category: 'education',
      description: 'Toko Buku - Kitab Hadits'
    },
  ];

  const quickActions = [
    {
      title: 'Transaksi',
      icon: ArrowRightLeft,
      color: 'from-blue-500 to-indigo-500',
      description: 'Kelola transaksi'
    },
    {
      title: 'Ganti PIN',
      icon: Settings,
      color: 'from-purple-500 to-pink-500',
      description: 'Ubah keamanan'
    },
    {
      title: 'Pesan',
      icon: Bell,
      color: 'from-green-500 to-emerald-500',
      description: 'Dari orang tua',
      badge: unreadMessages
    }
  ];

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

  // Komponen Badge
  const Badge = ({ variant = 'default', className = '', children, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium';
    
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800',
      destructive: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
        {children}
      </span>
    );
  };

  // Komponen ProfileImage
  const ProfileImage = ({ src, alt, size = 'md', className = '', ...props }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`} {...props}>
        <img 
          src={src || '/default-avatar.png'} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  // Komponen Card
  const Card = ({ className = '', children, delay = 0, onClick, ...props }) => {
    return (
      <div 
        className={`rounded-xl transition-all duration-300 hover:shadow-lg ${className}`}
        style={{ 
          animationDelay: `${delay}ms`,
          animation: 'fadeInUp 0.6s ease-out forwards'
        }}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  };

  // Komponen PageHeader
  const PageHeader = ({ title, subtitle, showBack = true, actions }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-blue-200 mt-1">{subtitle}</p>
        </div>
        {actions && (
          <div className="flex space-x-3">
            {actions}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative z-10">
        <PageHeader 
          title={`Selamat Datang, ${studentData.name.split(' ')[0]}`}
          subtitle="ATM Santri - Pondok Pesantren"
          showBack={false}
          actions={
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                size="sm"
                className="relative bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Pesan
                {unreadMessages > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 px-1 min-w-5 h-5 text-xs"
                  >
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Student Info Card */}
          <div className="xl:col-span-7">
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <ProfileImage 
                      src={studentData.profileImage}
                      alt={studentData.name}
                      size="lg"
                      className="ring-4 ring-blue-100"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl">Informasi Santri</h3>
                    <p className="text-gray-600 text-sm">Data pribadi dan akademik</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                      <p className="font-medium text-lg">{studentData.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Kelas</p>
                      <p className="font-medium">{studentData.class}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">NIS</p>
                      <p className="font-medium">{studentData.studentId}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Asrama</p>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                        <p className="font-medium">{studentData.dormitory}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800 border border-green-200">
                        {studentData.status}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Transaksi terakhir: {studentData.lastTransaction}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Balance Card */}
          <div className="xl:col-span-5">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl" delay={100}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Wallet className="w-6 h-6 mr-3" />
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
                    {showBalance ? formatCurrency(studentData.balance) : '••••••••'}
                  </div>
                  <div className="flex items-center text-green-100">
                    <TrendingUp className="w-4 h-4 mr-1" />
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
                      style={{ width: `${Math.min((studentData.balance / 500000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={action.title}
              className="bg-white/95 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl cursor-pointer group"
              delay={200 + index * 100}
            >
              <div className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg mb-1">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
                {action.badge && action.badge > 0 && (
                  <Badge variant="destructive" className="mt-2">
                    {action.badge} baru
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card className="mt-6 bg-white/95 backdrop-blur-xl border-0 shadow-2xl" delay={500}>
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              <h3 className="text-xl">Aktivitas Terbaru</h3>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      activity.category === 'food' ? 'bg-orange-100' :
                      activity.category === 'topup' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <div className={`w-6 h-6 rounded-full ${
                        activity.category === 'food' ? 'bg-orange-500' :
                        activity.category === 'topup' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{activity.date}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right font-medium ${activity.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <p>{activity.amount > 0 ? '+' : ''}{formatCurrency(activity.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;