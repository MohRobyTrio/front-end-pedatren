
const ATMLayout = ({ children, title, showBack, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-bold">{title || 'ATM Santri'}</h1>
          </div>
          <div className="text-sm opacity-90">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="bg-slate-800 text-slate-300 p-3 text-center">
        <p className="text-sm">© 2024 ATM Santri - Pesantren Digital Banking System</p>
      </div> */}
    </div>
  );
};

export default ATMLayout;