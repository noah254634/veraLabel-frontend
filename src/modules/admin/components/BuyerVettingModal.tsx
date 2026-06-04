import React, { useState, useEffect } from "react";
import { ShieldAlert, X, Terminal, Globe, Linkedin, Users2, Loader2 } from "lucide-react";
import useStore from "../store/userManagementStore";

interface BuyerVettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onStatusUpdated: () => void;
}

export const BuyerVettingModal: React.FC<BuyerVettingModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  onStatusUpdated,
}) => {
  const { getBuyerByUserId, approveBuyer, rejectBuyer } = useStore();
  const [buyer, setBuyer] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      setBuyer(null);
      setAdminNotes("");
      getBuyerByUserId(userId)
        .then((res) => {
          setBuyer(res);
          if (res?.adminNotes) {
            setAdminNotes(res.adminNotes);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId, getBuyerByUserId]);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!buyer) return;
    setActionLoading(true);
    try {
      await approveBuyer(buyer._id);
      onStatusUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!buyer) return;
    if (!adminNotes.trim()) {
      alert("Please provide justification notes before rejecting.");
      return;
    }
    setActionLoading(true);
    try {
      await rejectBuyer(buyer._id, adminNotes);
      onStatusUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#050505] border border-zinc-900 shadow-2xl overflow-hidden rounded-sm relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500" />
        <header className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black">
          <div className="flex items-center gap-3">
            <Terminal size={16} className="text-indigo-400" />
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white">
              Protocol_Execution: BUYER_VETTING
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors" disabled={actionLoading}>
            <X size={18} />
          </button>
        </header>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-indigo-500" size={24} />
              <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Querying_Secure_Ledger...</span>
            </div>
          ) : !buyer ? (
            <div className="py-12 text-center">
              <ShieldAlert className="mx-auto text-zinc-800 mb-3" size={32} />
              <p className="text-sm text-zinc-500 font-light">No buyer registration info found for {userName}.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-sm">
                <p className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1">// Selected_Node</p>
                <span className="text-white text-base font-bold tracking-tight">{userName}</span>
                <span className="text-zinc-500 text-xs block font-mono mt-1">{buyer.userId?.email}</span>
                
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">Verification_Status:</span>
                  <span className={`px-2 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-tighter ${
                    buyer.verificationStatus === "approved"
                      ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                      : buyer.verificationStatus === "rejected"
                      ? "text-red-500 border-red-500/20 bg-red-500/5"
                      : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                  }`}>
                    {buyer.verificationStatus || "unsubmitted"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    Company Name
                  </label>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-xs text-zinc-300 font-light">
                    {buyer.companyName || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    Industry Sector
                  </label>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-xs text-zinc-300 font-light">
                    {buyer.industry || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    Company Website
                  </label>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-xs text-indigo-400 flex items-center gap-2 truncate">
                    <Globe size={12} className="text-zinc-600 flex-shrink-0" />
                    {buyer.website ? (
                      <a href={buyer.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {buyer.website.replace(/^https?:\/\//i, "")}
                      </a>
                    ) : (
                      <span className="text-zinc-600">N/A</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    LinkedIn Company Page
                  </label>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-xs text-indigo-400 flex items-center gap-2 truncate">
                    <Linkedin size={12} className="text-zinc-600 flex-shrink-0" />
                    {buyer.linkedin ? (
                      <a href={buyer.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn Profile
                      </a>
                    ) : (
                      <span className="text-zinc-600">N/A</span>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    Company Size
                  </label>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-xs text-zinc-300 font-light flex items-center gap-2">
                    <Users2 size={12} className="text-zinc-600" />
                    {buyer.companySize || "N/A"}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    Intended Use Case / Data Requirements
                  </label>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-xs text-zinc-300 font-light leading-relaxed whitespace-pre-wrap font-mono">
                    {buyer.intendedUseCase || "No use case description provided."}
                  </div>
                </div>
              </div>
              <div className="space-y-2 border-t border-zinc-900 pt-6">
                <label className="block text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal size={12} /> // Vetting_Justification_Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter comments (required for rejection, optional for approval)..."
                  rows={3}
                  className="w-full bg-black border border-zinc-900 p-3 text-xs text-zinc-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-800 resize-none font-mono"
                />
              </div>
            </div>
          )}
        </div>
        <footer className="p-4 bg-black border-t border-zinc-900 flex gap-px shrink-0">
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="flex-1 py-3 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-900 transition-all border border-zinc-900 hover:border-zinc-800"
          >
            [Abort_Process]
          </button>
          
          {buyer && (
            <>
              <button
                disabled={actionLoading || !adminNotes.trim()}
                onClick={handleReject}
                className={`flex-1 py-3 text-[9px] font-mono font-bold uppercase tracking-widest transition-all ${
                  actionLoading || !adminNotes.trim()
                    ? "opacity-25 cursor-not-allowed"
                    : "bg-red-950 text-red-500 hover:bg-red-600 hover:text-white"
                }`}
              >
                [Reject_Buyer]
              </button>

              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="flex-1 py-3 text-[9px] font-mono font-bold uppercase tracking-widest bg-white text-black hover:bg-indigo-600 hover:text-white transition-all"
              >
                {actionLoading ? (
                  <Loader2 size={12} className="animate-spin mx-auto" />
                ) : (
                  "[Approve_Buyer]"
                )}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};
