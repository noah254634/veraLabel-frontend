const AdminActionModal = () => {
  if (!actionModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0B0F1A]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20">
            <ShieldAlert size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Confirm {actionModal.type} Action
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              You are about to {actionModal.type} this user. This action will be logged in the system audit trails.
            </p>
          </div>

          <div className="w-full space-y-2 text-left mt-4">
            <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">
              Reason for Intervention
            </label>
            <textarea 
              autoFocus
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 focus:ring-2 focus:ring-rose-500 outline-none transition-all h-32 resize-none placeholder:text-slate-700"
              placeholder="e.g., Consistent low-accuracy labels or suspected bot activity..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full pt-4">
            <button 
              onClick={() => setActionModal({ isOpen: false, type: null, userId: null })}
              className="py-4 px-6 bg-slate-800 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={executeAdminAction}
              disabled={!reason.trim() || loading}
              className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                !reason.trim() ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500'
              }`}
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActionModal;