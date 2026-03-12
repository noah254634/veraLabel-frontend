import React, { useEffect, useState } from "react";
import {
  Users, Search, UserMinus, UserPlus, Ban, MapPin, 
  Award, Clock, ChevronLeft, Star, ShieldAlert, 
  Unlock, UserCheck, UserX, Terminal, Activity,
  Filter, MoreHorizontal, Globe,
  type LucideProps,
} from "lucide-react";
import type { User } from "../../../shared/types/user";
import useStore from "../store/userManagementStore";

const AdminUserModule = () => {
  const {
    users, loading, getUsers, getUserByEmail, getUserByUsername, getUserByRole,
    getUserByStatus, getUserByCountry, promoteUser, demoteUser, suspendUser,
    unsuspendUser, blockUser, unblockUser, deleteUser, verifyUser, unverifyUser, rateUser,
  } = useStore();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchType, setSearchType] = useState("username");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { getUsers(); }, [getUsers]);

  // Restored: Re-sync selected user when store updates
  useEffect(() => {
    if (!selectedUser) return;
    const updated = users.find((user) => user._id === selectedUser._id);
    if (updated && updated !== selectedUser) { setSelectedUser(updated); }
  }, [users, selectedUser?._id]);

  // Restored: Complete Search Logic
  const executeSearch = () => {
    const value = searchTerm.trim();
    if (value.length <= 2) { getUsers(); return; }

    switch (searchType) {
      case "email": void getUserByEmail(value); break;
      case "username": void getUserByUsername(value); break;
      case "role": void getUserByRole(value); break;
      case "status": void getUserByStatus(value); break;
      case "location": void getUserByCountry(value); break;
      default: void getUserByUsername(value);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row w-full h-[calc(100vh-140px)] bg-[#020203] text-zinc-400 overflow-hidden border border-zinc-900 shadow-2xl animate-in fade-in duration-500">
      
      {/* --- LEFT: CONTEXTUAL PROFILE (Restored Detail View) --- */}
      <aside
        className={`
          fixed inset-0 z-50 w-full bg-[#050505] 
          md:relative md:inset-auto md:z-20 md:w-1/2 md:border-r md:border-zinc-900 
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${selectedUser ? "translate-x-0 opacity-100" : "-translate-x-full md:hidden opacity-0"}
        `}
      >
        {selectedUser && (
          <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-8">
            <header className="flex justify-between items-center mb-8 shrink-0">
              <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest hover:text-white transition-all">
                <ChevronLeft size={16} /> [Return_to_Registry]
              </button>
              <div className="flex gap-2">
                <StatusBadge status={selectedUser.isVerified ? "active" : "unverified"} />
                <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest">
                  {selectedUser.role}
                </span>
              </div>
            </header>

            <div className="space-y-10">
              {/* Identity Header */}
              <div className="flex items-start gap-8 p-8 bg-black border border-zinc-900 rounded-sm">
                <div className="h-24 w-24 shrink-0 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white text-4xl font-bold">
                  {selectedUser.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 text-indigo-500">
                    <Terminal size={14} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold">Node_Identity</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tighter truncate">{selectedUser.name}</h2>
                  <p className="text-zinc-500 text-xs font-mono truncate">{selectedUser.email}</p>
                  
                  {/* Performance Rating */}
                  <div className="mt-6 pt-4 border-t border-zinc-900">
                    <p className="text-[9px] font-mono font-bold uppercase text-zinc-600 mb-3 tracking-widest">// Quality_Trust_Score</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`cursor-pointer transition-all ${star <= (selectedUser.trustScore ?? 0) ? "text-amber-500 fill-amber-500" : "text-zinc-800"}`}
                          onClick={() => rateUser(selectedUser._id, star)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RESTORED: Full Action Grid */}
              <div className="grid grid-cols-1 gap-8">
                <ActionGroup label="Verification_Protocols" color="text-indigo-500">
                  <ActionBtn label="Approve User" icon={<UserCheck />} onClick={() => verifyUser(selectedUser._id)} variant="success" />
                  <ActionBtn label="Reject User" icon={<UserX />} onClick={() => unverifyUser(selectedUser._id)} variant="ghost" />
                </ActionGroup>

                <ActionGroup label="Rank_Promotion" color="text-emerald-500">
                  <ActionBtn label="Promote to Reviewer" icon={<Award />} onClick={() => promoteUser(selectedUser._id)} variant="primary" />
                  <ActionBtn label="Demote User" icon={<ShieldAlert />} onClick={() => demoteUser(selectedUser._id)} variant="ghost" />
                </ActionGroup>

                <ActionGroup label="Security_Penalties" color="text-rose-500">
                  <ActionBtn 
                    label={selectedUser.isSuspended?.status ? "Lift_Suspension" : "Suspend_24H"} 
                    icon={<Clock />} 
                    onClick={() => selectedUser.isSuspended?.status ? unsuspendUser(selectedUser._id, "") : suspendUser(selectedUser._id, "Policy")} 
                    variant="warning" 
                  />
                  <ActionBtn 
                    label={selectedUser.isBlocked?.status ? "Unblock_Node" : "Block_Permanent"} 
                    icon={selectedUser.isBlocked?.status ? <Unlock /> : <Ban />} 
                    onClick={() => selectedUser.isBlocked?.status ? unblockUser(selectedUser._id, "") : blockUser(selectedUser._id, "Violation")} 
                    variant="danger" 
                  />
                </ActionGroup>
              </div>

              <div className="pt-8 border-t border-zinc-900 flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-600 font-mono text-[10px]">
                  <MapPin size={14} />
                  <span>LOC: {(selectedUser.userLocation && typeof selectedUser.userLocation === 'object' && selectedUser.userLocation.country) || "GLOBAL_NODE"}</span>
                </div>
                <button onClick={() => deleteUser(selectedUser._id, "Purge")} className="text-rose-500 hover:text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all">
                  [Purge_Record]
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* --- RIGHT: THE REGISTRY (Restored Search & Add Features) --- */}
      <main className={`flex-1 flex flex-col min-w-0 ${selectedUser ? "hidden md:flex" : "flex"}`}>
        <header className="p-8 md:p-10 border-b border-zinc-900 bg-black shrink-0">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-500 mb-2">
                 <Activity size={14} />
                 <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Registry_v4.0_Personnel</span>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tighter italic">Global Operators</h1>
            </div>

            {/* RESTORED: Full Search & Add Interface */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="bg-zinc-950 border border-zinc-900 p-1 flex flex-1 xl:w-[450px]">
                 <select
                   value={searchType}
                   onChange={(e) => setSearchType(e.target.value)}
                   className="bg-transparent text-[9px] font-mono font-bold text-zinc-500 uppercase px-3 outline-none cursor-pointer border-r border-zinc-900"
                 >
                   <option value="username">User</option>
                   <option value="email">Email</option>
                   <option value="location">Loc</option>
                   <option value="role">Role</option>
                   <option value="status">Stat</option>
                 </select>
                 <input
                   type="text"
                   placeholder={`Query by ${searchType}...`}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && executeSearch()}
                   className="bg-black px-4 py-2 text-xs text-white outline-none flex-1 placeholder:text-zinc-800"
                 />
                 <button onClick={executeSearch} className="px-4 text-zinc-600 hover:text-indigo-500 transition-colors">
                   <Search size={16}/>
                 </button>
              </div>
              <button className="bg-white p-3 text-black hover:bg-indigo-50 transition-all rounded-sm shadow-xl shadow-indigo-500/10 shrink-0">
                <UserPlus size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0A0A0A] border-b border-zinc-900">
              <tr className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest italic">
                <th className="p-6">// Identity_Node</th>
                {!selectedUser && <th className="p-6 hidden lg:table-cell">// Geo_Location</th>}
                <th className="p-6">// Status</th>
                <th className="p-6 text-right">// Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {users.map((user: User) => (
                <tr
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`group cursor-pointer transition-all ${selectedUser?._id === user._id ? "bg-indigo-500/10" : "hover:bg-zinc-950"}`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 border border-zinc-900 bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-700 group-hover:text-white group-hover:border-zinc-700 transition-all">
                        {user.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">{user.name}</p>
                    </div>
                  </td>
                  {!selectedUser && (
                    <td className="p-6 text-[11px] text-zinc-600 font-light hidden lg:table-cell uppercase tracking-tight">
                      {(user.userLocation && typeof user.userLocation === 'object' && user.userLocation.country) || "UNKNOWN"}
                    </td>
                  )}
                  <td className="p-6"><StatusBadge status={user.isVerified ? "active" : "unverified"} /></td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-amber-500/40 group-hover:text-amber-500 font-mono font-bold text-[10px] transition-colors">
                      <Star size={10} fill="currentColor" /> {user.trustScore || 0}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// --- RESTORED TECHNICAL HELPERS ---

const ActionGroup = ({ label, color, children }: { label: string; color: string; children: React.ReactNode }) => (
  <section className="space-y-4">
    <h3 className={`text-[9px] font-mono font-bold uppercase ${color} tracking-[0.3em]`}>// {label}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 shadow-2xl">{children}</div>
  </section>
);

interface ActionBtnProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
}

const ActionBtn = ({ label, icon, onClick, variant }: ActionBtnProps) => {
  const themes: Record<ActionBtnProps['variant'], string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500",
    secondary: "bg-zinc-950 text-zinc-400 hover:text-white",
    success: "bg-[#0A0A0A] text-emerald-500 hover:bg-emerald-600 hover:text-white",
    danger: "bg-[#0A0A0A] text-rose-500 hover:bg-rose-600 hover:text-white",
    warning: "bg-[#0A0A0A] text-amber-500 hover:bg-amber-600 hover:text-white",
    ghost: "bg-[#0A0A0A] text-zinc-700 hover:text-white",
  };
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-3 py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all ${themes[variant]}`}>
      {React.cloneElement(icon, { size: 14 })} {label}
    </button>
  );
};

const StatusBadge = ({ status }: { status?: string }) => {
  const s = status?.toLowerCase() || "pending";
  const colors: Record<string, string> = { 
    active: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5", 
    blocked: "text-rose-500 border-rose-500/20 bg-rose-500/5", 
    suspended: "text-amber-500 border-amber-500/20 bg-amber-500/5" 
  };
  return (
    <span className={`px-2 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-tighter ${colors[s] || "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
      {s}
    </span>
  );
};

export default AdminUserModule;