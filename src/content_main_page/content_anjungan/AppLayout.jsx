import { useState, useEffect } from 'react';
import ATMLayout from './Layout/ATMLayout';
import CardScanner from './Auth/CardScanner';
import PinInput from './Auth/PinInput';
import StudentProfile from './Dashboard/StudentProfile';
import QuickActions from './Dashboard/QuickActions';
import RecentTransactions from './Dashboard/RecentTransactions';
import DepositForm from './Transactions/DepositForm';
import BalanceCheck from './Transactions/BalanceCheck';
import InfaqForm from './Transactions/InfaqForm';
import PaymentForm from './Transactions/PaymentForm';
import MessageList from './Message/MessageList';
import Dashboard from './Dashboard/Dashboartd';
import ChangePinPage from './Dashboard/ChangePinPage';

// Mock Data
const mockStudent = {
    id: '1',
    nis: '2024001',
    name: 'Ahmad Fauzi Rahman',
    class: 'Kelas 3 Aliyah',
    photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    balance: 750000,
    pin: '1234',
    cardId: 'CARD001',
    lastTransaction: new Date('2024-12-10T10:00:00'), 
};

const mockTransactions = [
    {
        id: '1',
        type: 'deposit',
        amount: 100000,
        description: 'Setoran dari Orang Tua',
        timestamp: new Date('2024-12-10T10:00:00'),
    },
    {
        id: '2',
        type: 'payment',
        amount: 50000,
        description: 'Pembayaran SPP Bulan Desember',
        timestamp: new Date('2024-12-09T14:30:00'),
    },
    {
        id: '3',
        type: 'infaq',
        amount: 25000,
        description: 'Infaq Jumat',
        timestamp: new Date('2024-12-08T13:00:00'),
    }
];

const mockMessages = [
    {
        id: '1',
        from: 'Ayah',
        content: 'Nak, jangan lupa sholat 5 waktu dan rajin mengaji. Semoga sehat selalu di pesantren.',
        timestamp: new Date('2024-12-10T08:00:00'),
        read: false
    },
    {
        id: '2',
        from: 'Ibu',
        content: 'Assalamualaikum anakku, ibu sudah kirim uang saku tambahan. Jaga kesehatan ya.',
        timestamp: new Date('2024-12-09T19:00:00'),
        read: true
    }
];

const mockPayments = [
    {
        id: '1',
        name: 'SPP Bulan Januari',
        amount: 150000,
        description: 'Biaya Sekolah Per Bulan',
        category: 'spp'
    },
    {
        id: '2',
        name: 'Makan Siang - 1 Minggu',
        amount: 35000,
        description: 'Biaya Konsumsi Pesantren',
        category: 'makan'
    },
    {
        id: '3',
        name: 'Kitab Fiqh Al-Manhaj',
        amount: 75000,
        description: 'Buku Pelajaran Semester Baru',
        category: 'kitab'
    },
    {
        id: '4',
        name: 'Kegiatan Muhadharah',
        amount: 25000,
        description: 'Biaya Kegiatan Ekstrakurikuler',
        category: 'kegiatan'
    }
];

const AppAnjungan = () => {
    const [currentState, setCurrentState] = useState('card-scanner');
    const [currentStudent, setCurrentStudent] = useState(null);
    // const [transactions, setTransactions] = useState(mockTransactions);
    const [messages, setMessages] = useState(mockMessages);
    const [idleTimer, setIdleTimer] = useState(null);

    // Auto-logout after 5 minutes of inactivity
    const resetIdleTimer = () => {
        if (idleTimer) clearTimeout(idleTimer);

        const timer = setTimeout(() => {
            if (currentState !== 'card-scanner') {
                setCurrentState('card-scanner');
                setCurrentStudent(null);
                alert('Sesi telah berakhir karena tidak ada aktivitas. Silakan scan kartu kembali.');
            }
        }, 300000000); // 5 minutes

        setIdleTimer(timer);
    };

    useEffect(() => {
        if (currentStudent) {
            resetIdleTimer();

            // Reset timer on any user activity
            const handleActivity = () => resetIdleTimer();

            document.addEventListener('click', handleActivity);
            document.addEventListener('keypress', handleActivity);
            document.addEventListener('touchstart', handleActivity);

            return () => {
                document.removeEventListener('click', handleActivity);
                document.removeEventListener('keypress', handleActivity);
                document.removeEventListener('touchstart', handleActivity);
            };
        }
    }, [currentStudent]);

    const handleCardScanned = (cardId) => {
        // Simulate finding student by card ID
        setCurrentStudent(mockStudent);
        setCurrentState('pin-input');
    };

    const handlePinComplete = (pin) => {
        if (currentStudent && pin === currentStudent.pin) {
            setCurrentState('dashboard');
        } else {
            alert('PIN salah! Silakan coba lagi.');
        }
    };

    const handleQuickAction = (action) => {
        setCurrentState(action);
    };

    const handleTransaction = (type, amount, description, purpose) => {
        if (!currentStudent) return;

        const newTransaction = {
            id: Date.now().toString(),
            type,
            amount,
            description,
            timestamp: new Date(),
            purpose
        };

        setTransactions(prev => [newTransaction, ...prev]);

        // Update student balance
        const updatedStudent = { ...currentStudent };
        if (type === 'deposit') {
            updatedStudent.balance += amount;
        } else {
            updatedStudent.balance -= amount;
        }

        updatedStudent.lastTransaction = newTransaction.timestamp;

        setCurrentStudent(updatedStudent);

        setCurrentState('dashboard');

        // Show success message
        setTimeout(() => {
            alert(`${description} berhasil! Saldo terkini: Rp ${updatedStudent.balance.toLocaleString('id-ID')}`);
        }, 500);
    };

    const handleDeposit = (amount) => {
        handleTransaction('deposit', amount, `Setoran Tunai Rp ${amount.toLocaleString('id-ID')}`);
    };

    const handleInfaq = (amount, purpose) => {
        handleTransaction('infaq', amount, `Infaq - ${purpose}`, purpose);
    };

    const handlePayment = (paymentId, amount) => {
        const payment = mockPayments.find(p => p.id === paymentId);
        if (payment) {
            handleTransaction('payment', amount, `Pembayaran ${payment.name}`);
        }
    };

    const handleMessageRead = (messageId) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === messageId ? { ...msg, read: true } : msg
            )
        );
    };

    const handleLogout = () => {
        setCurrentState('card-scanner');
        setCurrentStudent(null);
        setTransactions(mockTransactions);
        setMessages(mockMessages);
        if (idleTimer) clearTimeout(idleTimer);
    };

    const getPageTitle = () => {
        switch (currentState) {
            case 'card-scanner': return 'Selamat Datang';
            case 'pin-input': return 'Verifikasi PIN';
            case 'dashboard': return `Selamat datang, ${currentStudent?.name}`;
            case 'balance': return 'Cek Saldo';
            case 'deposit': return 'Setor Tunai';
            case 'infaq': return 'Infaq';
            case 'payment': return 'Pembayaran';
            case 'messages': return 'Pesan Orang Tua';
            default: return 'ATM Santri';
        }
    };

    const unreadMessages = messages.filter(m => !m.read).length;

    return (
        <ATMLayout
            title={getPageTitle()}
            showBack={currentState !== 'card-scanner' && currentState !== 'dashboard'}
            onBack={() => setCurrentState('dashboard')}
            onLogout={handleLogout}
        >
            {currentState === 'card-scanner' && (
                <CardScanner onCardScanned={handleCardScanned} />
            )}

            {currentState === 'pin-input' && (
                <PinInput
                    onPinComplete={handlePinComplete}
                    onCancel={handleLogout}
                />
            )}

            {currentState === 'dashboard' && currentStudent && (
                <div className="space-y-6">
                    {/* <div className="flex justify-between items-center">
                        <div />
                        <button
                            onClick={handleLogout}
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                        >
                            Keluar
                        </button>
                    </div> */}

                    <StudentProfile student={currentStudent} />
                    <QuickActions onAction={handleQuickAction} unreadMessages={unreadMessages} />
                    {/* <RecentTransactions transactions={transactions} /> */}
                    {/* <Dashboard student={currentStudent} transactions={transactions} unreadMessages={unreadMessages} onAction={handleQuickAction} onLogout={handleLogout} /> */}
                </div>
            )}

            {currentState === 'balance' && currentStudent && (
                <ChangePinPage
                    student={currentStudent}
                    onClose={() => setCurrentState('dashboard')}
                />
                // <Dashboard
                //     student={currentStudent}
                //     transactions={transactions}
                //     unreadMessages={unreadMessages} 
                // />
            )}

            {currentState === 'deposit' && (
                <DepositForm
                    onDeposit={handleDeposit}
                    onCancel={() => setCurrentState('dashboard')}
                />
            )}

            {currentState === 'infaq' && (
                <InfaqForm
                    onInfaq={handleInfaq}
                    onCancel={() => setCurrentState('dashboard')}
                />
            )}

            {currentState === 'payment' && (
                <PaymentForm
                    payments={mockPayments}
                    onPayment={handlePayment}
                    onCancel={() => setCurrentState('dashboard')}
                />
            )}

            {currentState === 'messages' && (
                <MessageList
                    messages={messages}
                    onMessageRead={handleMessageRead}
                    onBack={() => setCurrentState('dashboard')}
                />
            )}
        </ATMLayout>
    );
}

export default AppAnjungan;