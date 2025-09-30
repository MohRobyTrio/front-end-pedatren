import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentState, setCurrentState] = useState('scan');
  const [studentData, setStudentData] = useState({
    name: 'Ahmad Fauzi',
    studentId: 'S2024001',
    class: 'Kelas 3 Aliyah',
    dormitory: 'Asrama Baitul Hikmah',
    balance: 250000,
    lastTransaction: '2024-01-15',
    status: 'Aktif',
    profileImage: 'https://images.unsplash.com/photo-1634451784126-b9f7282edb1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNsaW0lMjBzdHVkZW50JTIwcHJvZmlsZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODU5Mzc5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  });
  const [unreadMessages, setUnreadMessages] = useState(2);
  const [theme, setTheme] = useState('light');
  const [sessionData, setSessionData] = useState({
    cardNumber: null,
    loginTime: null,
    lastActivity: null
  });

  // Navigation handlers
  const navigateTo = (state) => {
    setCurrentState(state);
    setSessionData(prev => ({ ...prev, lastActivity: new Date() }));
  };

  const logout = () => {
    setCurrentState('scan');
    setSessionData({
      cardNumber: null,
      loginTime: null,
      lastActivity: null
    });
  };

  // Data handlers
  const updateBalance = (newBalance) => {
    setStudentData(prev => ({ ...prev, balance: newBalance }));
  };

  const markAllMessagesRead = () => {
    setUnreadMessages(0);
  };

  const handleCardScanned = (cardNumber) => {
    setSessionData({
      cardNumber,
      loginTime: new Date(),
      lastActivity: new Date()
    });
    navigateTo('pin');
  };

  const handlePinCorrect = () => {
    navigateTo('dashboard');
  };

  // Feature flags for future extensibility
  const features = {
    biometricAuth: false,
    qrPayments: false,
    mobileTopup: true,
    parentNotifications: true,
    attendanceTracking: false,
    gradeViewing: false,
    libraryIntegration: false
  };

  const value = {
    // State
    currentState,
    studentData,
    unreadMessages,
    theme,
    sessionData,
    features,
    
    // Navigation
    navigateTo,
    logout,
    
    // Data handlers
    updateBalance,
    markAllMessagesRead,
    handleCardScanned,
    handlePinCorrect,
    setTheme,
    setStudentData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};