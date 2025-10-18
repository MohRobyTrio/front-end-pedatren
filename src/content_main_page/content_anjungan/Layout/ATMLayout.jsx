const ATMLayout = ({ children, title, showBack, onBack, onLogout }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
            {/* Header */}
            {/* Tambahkan kelas sticky, top-0, dan z-50 di sini */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 shadow-lg">
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

                    {/* Grup untuk item di sebelah kanan */}
                    <div className="flex items-center gap-4">
                        <div className="text-sm opacity-90 hidden sm:block"> {/* Sembunyikan tanggal di layar kecil jika perlu */}
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        
                        {/* Tombol Logout akan muncul jika showLogout bernilai true */}
                        {/* {showLogout && ( */}
                            <button
                                onClick={onLogout}
                                title="Logout"
                                className="flex items-center gap-2 bg-red-500/90 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200"
                            >
                                {/* Ikon Logout (SVG) */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                <span className="hidden md:inline">Keluar</span> {/* Teks hanya muncul di layar medium ke atas */}
                            </button>
                        {/* )} */}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    {children}
                </div>
            </div>

            {/* Footer */}
            {/* ... */}
        </div>
    );
};

export default ATMLayout;