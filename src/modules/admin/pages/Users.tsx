import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Ban,
  MoreHorizontal,
  MapPin,
  Globe,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Filter,
  ChevronLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  Unlock,
  UserCheck,
  UserX,
  type LucideProps,
} from "lucide-react";
import type { User } from "../../../shared/types/user";
import useStore from "../store/userManagementStore";

const AdminUserModule = () => {
  const {
    users,
    loading,
    getUsers,
    getUserByEmail,
    getUserByUsername,
    getUserByRole,
    getUserByStatus,
    getUserByCountry,
    promoteUser,
    demoteUser,
    suspendUser,
    unsuspendUser,
    blockUser,
    unblockUser,
    deleteUser,
    verifyUser,
    unverifyUser,
    rateUser, // rateUser added per request
  } = useStore();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchType, setSearchType] = useState("username");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (!selectedUser) return;
    const updated = users.find((user) => user._id === selectedUser._id);
    if (updated && updated !== selectedUser) {
      setSelectedUser(updated);
    }
  }, [users, selectedUser?._id]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const executeSearch = () => {
    const value = searchTerm.trim();
    if (value.length <= 2) {
      getUsers();
      return;
    }

    switch (searchType) {
      case "email":
        void getUserByEmail(value);
        return;
      case "username":
        void getUserByUsername(value);
        return;
      case "role":
        void getUserByRole(value);
        return;
      case "status":
        void getUserByStatus(value);
        return;
      case "location":
        void getUserByCountry(value);
        return;
      case "verified":
      case "suspended":
      case "blocked":
      case "rating":
        return;
      default:
        void getUserByUsername(value);
        return;
    }
  };

  const isClientFilter =
    searchType === "verified" ||
    searchType === "suspended" ||
    searchType === "blocked" ||
    searchType === "rating";

  const displayedUsers = isClientFilter
    ? users.filter((user) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        switch (searchType) {
          case "verified":
            return user.isVerified
              ? q === "true" || q === "verified" || q === "active"
              : q === "false" || q === "unverified" || q === "inactive";
          case "suspended":
            return user.isSuspended?.status
              ? q === "true" || q === "yes" || q === "suspended"
              : q === "false" || q === "no" || q === "active";
          case "blocked":
            return user.isBlocked?.status
              ? q === "true" || q === "yes" || q === "blocked"
              : q === "false" || q === "no" || q === "active";
          case "rating":
            return String(user.trustScore || 0).startsWith(q);
          default:
            return true;
        }
      })
    : users;
  return (
    <div className="flex h-screen bg-[#0B0F1A] text-slate-300 overflow-hidden font-sans">
      {/* --- LEFT SIDEBAR: THE FULL COMMAND PROFILE (50%) --- */}
      <aside
        className={`transition-all duration-500 ease-in-out border-r border-slate-800 bg-[#0F172A] flex flex-col relative z-20 ${
          selectedUser ? "w-1/2 opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        {selectedUser && (
          <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar">
            <header className="flex justify-between items-center mb-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-2">
                <StatusBadge status={selectedUser.status} />
                <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-slate-700">
                  {selectedUser.role}
                </span>
              </div>
            </header>

            {/* Profile Identity & RATING SYSTEM */}
            <div className="flex items-start gap-6 mb-10 bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/50">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                {selectedUser.name?.charAt(0)}
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-black text-white">
                  {selectedUser.name}
                </h2>
                <p className="text-slate-500 text-sm font-mono italic">
                  {selectedUser.email}
                </p>

                {/* Annotator Rating Component */}
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase text-slate-600 mb-2 tracking-widest">
                    Rate Annotator Performance
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={`cursor-pointer transition-all ${star <= (selectedUser.trustScore ?? 0) ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
                        onClick={() => {
                          setSelectedUser({
                            ...selectedUser,
                            trustScore: star,
                          });
                          rateUser(selectedUser._id, star);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FULL ACTION GRID - EVERY METHOD FROM STORE */}
            <div className="grid grid-cols-1 gap-8">
              {/* Approval & Trust Actions */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                  Verification & Approval
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <ActionBtn
                    label="Approve User"
                    icon={<UserCheck />}
                    onClick={() => verifyUser(selectedUser._id)}
                    variant="success"
                  />
                  <ActionBtn
                    label="Reject User"
                    icon={<UserX />}
                    onClick={() => unverifyUser(selectedUser._id)}
                    variant="danger"
                  />
                </div>
              </section>

              {/* Authority & Role Promotion */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">
                  Rank & Promotion
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <ActionBtn
                    label="Promote to Reviewer"
                    icon={<Award />}
                    onClick={() => promoteUser(selectedUser._id)}
                    variant="primary"
                  />
                  <ActionBtn
                    label="Demote User"
                    icon={<ShieldAlert />}
                    onClick={() => demoteUser(selectedUser._id)}
                    variant="ghost"
                  />
                </div>
              </section>

              {/* Access Control (Block/Suspend) */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em]">
                  Security Penalties
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedUser.isSuspended.status ? (
                    <ActionBtn
                      label="Unsuspend"
                      icon={<Clock />}
                      onClick={() => {
                        setSelectedUser({
                          ...selectedUser,
                          isSuspended: { status: false, reason: "" },
                        });
                        unsuspendUser(
                          selectedUser._id,
                          selectedUser.isSuspended.reason,
                        );
                      }}
                      variant="secondary"
                    />
                  ) : (
                    <ActionBtn
                      label="Suspend 24h"
                      icon={<Clock />}
                      onClick={() => {
                        setSelectedUser({
                          ...selectedUser,
                          isSuspended: {
                            status: true,
                            reason: selectedUser.isSuspended.reason,
                          },
                        });
                        suspendUser(
                          selectedUser._id,
                          selectedUser.isSuspended.reason,
                        );
                      }}
                      variant="warning"
                    />
                  )}

                  {selectedUser.isBlocked?.status ? (
                    <ActionBtn
                      label="Unblock User"
                      icon={<Unlock />}
                      onClick={() => {
                        setSelectedUser({
                          ...selectedUser,
                          isBlocked: { status: false, reason: "" },
                        });
                        unblockUser(
                          selectedUser._id,
                          selectedUser.isBlocked?.reason || "",
                        );
                      }}
                      variant="secondary"
                    />
                  ) : (
                    <ActionBtn
                      label="Block Permanent"
                      icon={<Ban />}
                      onClick={() => {
                        setSelectedUser({
                          ...selectedUser,
                          isBlocked: {
                            status: true,
                            reason: selectedUser.isBlocked?.reason || "",
                          },
                        });
                        blockUser(
                          selectedUser._id,
                          selectedUser.isBlocked?.reason || "",
                        );
                      }}
                      variant="danger"
                    />
                  )}
                </div>
              </section>

              {/* Data & Destruction */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={16} />
                  <span className="text-xs">
                    {typeof selectedUser.userLocation === "string"
                      ? selectedUser.userLocation
                      : selectedUser.userLocation?.country || "Unknown"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    deleteUser(selectedUser._id, "Administrative Purge")
                  }
                  className="flex items-center gap-2 text-rose-500 hover:text-rose-400 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <UserMinus size={16} /> Purge Account
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* --- RIGHT SIDEBAR: THE REGISTRY (50%) --- */}
      <main
        className={`flex-1 flex flex-col transition-all duration-500 ${selectedUser ? "w-1/2" : "w-full"}`}
      >
        <header className="p-8 border-b border-slate-800 flex justify-between items-center bg-[#0B0F1A]/50 backdrop-blur-md">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            VeraLabel Registry
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-400 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer "
            >
              <option value="" disabled selected>
                Sort by
              </option>
              <option value="username">Username</option>
              <option value="email">Email</option>
              <option value="location">Location</option>
              <option value="role">Role</option>
              <option value="status">Status</option>
              <option value="verified">Verified</option>
              <option value="suspended">Suspended</option>
              <option value="blocked">Blocked</option>
              <option value="rating">Rating</option>
            </select>
            <div className="relative">
              <button
                type="button"
                onClick={executeSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                aria-label="Search users"
              >
                <Search size={16} />
              </button>
              <input
                type="text"
                value={searchTerm}
                placeholder={`Search by ${searchType}`}
                onChange={handleSearch}
                onKeyDown={(e) => {
                  if (e.key === "Enter") executeSearch();
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-64"
              />
            </div>
            <button className="bg-indigo-600 p-2.5 rounded-xl text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
              <UserPlus size={20} />
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-600 tracking-widest border-b border-slate-800">
                <th className="pb-4 px-2">Worker</th>
                {!selectedUser && <th className="pb-4 px-2">Location</th>}
                <th className="pb-4 px-2">Status</th>
                <th className="pb-4 px-2 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {displayedUsers.map((user: User) => (
                <tr
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`group cursor-pointer transition-colors ${selectedUser?._id === user._id ? "bg-indigo-500/10" : "hover:bg-slate-800/30"}`}
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {user.name?.slice(0, 2)}
                      </div>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-white">
                        {user.name}
                      </p>
                    </div>
                  </td>
                  {!selectedUser && (
                    <td className="py-4 px-2 text-xs text-slate-500">
                      {typeof user.userLocation === "string"
                        ? user.userLocation
                        : [user.userLocation?.country, user.userLocation?.city]
                            .filter(Boolean)
                            .join(" | ") || "Unknown"}
                    </td>
                  )}
                  <td className="py-4 px-2">
                    <StatusBadge
                      status={user.isVerified ? "active" : "unverified"}
                    />
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex items-center justify-end gap-1 text-amber-500 text-xs font-black">
                      <Star size={12} fill="currentColor" />{" "}
                      {user.trustScore || 0}
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

// --- RESTORED ACTION COMPONENTS ---

const ActionBtn = ({
  label,
  icon,
  onClick,
  variant,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: string;
}) => {
  const themes: any = {
    primary: "bg-indigo-600 text-white shadow-indigo-600/20",
    secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700",
    success:
      "bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600 hover:text-white",
    danger:
      "bg-rose-600/10 text-rose-500 border border-rose-600/20 hover:bg-rose-600 hover:text-white",
    warning:
      "bg-amber-600/10 text-amber-500 border border-amber-600/20 hover:bg-amber-600 hover:text-white",
    ghost:
      "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${themes[variant]}`}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 16 })} {label}
    </button>
  );
};

const StatusBadge = ({ status }: { status?: string }) => {
  const s = status?.toLowerCase() || "pending";
  const c: any = {
    active: "text-emerald-500 bg-emerald-500/10",
    blocked: "text-rose-500 bg-rose-500/10",
    suspended: "text-amber-500 bg-amber-500/10",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${c[s] || "bg-slate-800 text-slate-500"}`}
    >
      {s}
    </span>
  );
};

export default AdminUserModule;
