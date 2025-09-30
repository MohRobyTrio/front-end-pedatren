import { MessageCircle, User, Clock, Mail, MailOpen } from 'lucide-react';

const MessageList = ({ messages, onMessageRead, onBack }) => {
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
          <MessageCircle className="w-8 h-8 text-white" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {unreadCount}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pesan dari Orang Tua</h2>
        <p className="text-slate-600">
          {unreadCount > 0 ? `${unreadCount} pesan baru` : 'Semua pesan sudah dibaca'}
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
              message.read 
                ? 'border-slate-200 bg-slate-50' 
                : 'border-emerald-200 bg-emerald-50 hover:border-emerald-300'
            }`}
            onClick={() => !message.read && onMessageRead(message.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{message.from}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {message.timestamp.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {message.read ? (
                  <MailOpen className="w-5 h-5 text-slate-400" />
                ) : (
                  <Mail className="w-5 h-5 text-emerald-600" />
                )}
              </div>
            </div>
            
            <p className={`leading-relaxed ${message.read ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
              {message.content}
            </p>
            
            {!message.read && (
              <div className="mt-3 text-center">
                <span className="text-xs text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Klik untuk membaca
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Belum ada pesan</p>
          <p className="text-sm">Pesan dari orang tua akan tampil di sini</p>
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Kembali ke Menu Utama
      </button>
    </div>
  );
};

export default MessageList;