import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Terminal, AlertTriangle } from 'lucide-react';

const AdminActionModal = ({ isOpen, onClose, onConfirm, actionType, userName }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

const themes = {
    BLOCK_USER: { color: 'text-rose-500', border: 'border-rose-500/50', bg: 'bg-rose-500/5' },
    UNBLOCK_USER: { color: 'text-emerald-500', border: 'border-emerald-500/50', bg: 'bg-emerald-500/5' },
    UNSUSPEND_USER: { color: 'text-emerald-500', border: 'border-emerald-500/50', bg: 'bg-emerald-500/5' },
    SUSPEND_USER: { color: 'text-amber-500', border: 'border-amber-500/50', bg: 'bg-amber-500/5' },
    PURGE_USER: { color: 'text-zinc-400', border: 'border-zinc-500/50', bg: 'bg-zinc-500/5' },
    CANCEL_PAYMENT: { color: 'text-rose-600', border: 'border-rose-600/50', bg: 'bg-rose-600/5' }, // More aggressive than standard reject
    CANCEL_TASKS: { color: 'text-rose-600', border: 'border-rose-600/50', bg: 'bg-rose-600/5' },
    PROMOTE_USER: { color: 'text-indigo-500', border: 'border-indigo-500/50', bg: 'bg-indigo-500/5' },
    DEMOTE_USER: { color: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-500/5' },
    REWARD_BONUS: { color: 'text-violet-500', border: 'border-violet-500/50', bg: 'bg-violet-500/5' },
    VERIFY_USER: { color: 'text-emerald-500', border: 'border-emerald-500/50', bg: 'bg-emerald-500/5' },
    UNVERIFY_USER: { color: 'text-zinc-500', border: 'border-zinc-500/50', bg: 'bg-zinc-500/5' },
};

  const currentTheme = themes[actionType] || themes.BLOCK_USER;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-md bg-[#050505] border ${currentTheme.border} shadow-2xl overflow-hidden`}>
        
        {/* Modal Header */}
        <header className="p-4 border-b border-zinc-900 flex justify-between items-center bg-black">
          <div className="flex items-center gap-3">
            <ShieldAlert size={16} className={currentTheme.color} />
            <h2 className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${currentTheme.color}`}>
              Protocol_Execution: {actionType}
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </header>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className={`p-4 ${currentTheme.bg} border border-zinc-900`}>
            <p className="text-zinc-400 text-xs leading-relaxed">
              You are initiating a <span className={`font-bold ${currentTheme.color}`}>{actionType}</span> action against node: 
              <span className="text-white font-mono block mt-1 underline tracking-widest">{userName}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
              <Terminal size={12} /> // Required_Justification
            </label>
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter technical justification for audit logs..."
              className="w-full h-32 bg-black border border-zinc-900 p-4 text-sm text-zinc-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-800 resize-none font-mono"
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-zinc-950 border border-zinc-900">
            <AlertTriangle size={14} className="text-zinc-700 shrink-0" />
            <p className="text-[8px] text-zinc-600 font-mono uppercase leading-tight">
              Action will be timestamped and attributed to your Admin_UUID. This cannot be undone via standard UI.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="p-4 bg-black border-t border-zinc-900 flex gap-px">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-900 transition-all"
          >
            [Abort_Process]
          </button>
          <button 
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
            className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
              !reason.trim() ? 'opacity-20 grayscale cursor-not-allowed' : `bg-white text-black hover:${currentTheme.bg.replace('/5', '')}`
            }`}
          >
            [Execute_Action]
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminActionModal;