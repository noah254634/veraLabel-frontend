import React, { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck, Trash2 } from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAllRead, markOneRead, clearAll } =
    useNotificationStore();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div ref={dropdownRef} className="relative">

      <button
        id="notification-bell-btn"
        onClick={handleOpen}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-sm hover:bg-zinc-900"
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_8px_rgba(99,102,241,0.7)] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>


      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-[#050505] border border-zinc-900 rounded-sm shadow-2xl shadow-black/60 z-[200] overflow-hidden"
          style={{ animation: "slideDown 0.15s ease-out" }}
        >

          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-indigo-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-sm text-[9px] font-bold text-indigo-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    id="notif-mark-all-read-btn"
                    onClick={markAllRead}
                    title="Mark all as read"
                    className="p-1.5 text-zinc-500 hover:text-indigo-400 transition-colors rounded-sm hover:bg-zinc-900"
                  >
                    <CheckCheck size={14} />
                  </button>
                  <button
                    id="notif-clear-all-btn"
                    onClick={clearAll}
                    title="Clear all"
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-sm hover:bg-zinc-900"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-sm hover:bg-zinc-900"
              >
                <X size={14} />
              </button>
            </div>
          </div>


          <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-3 text-zinc-600">
                <Bell size={28} strokeWidth={1} />
                <p className="text-xs font-mono uppercase tracking-widest">No notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-900/60">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => markOneRead(notif.id)}
                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-zinc-900/50 ${
                      notif.read ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5">

                      <div className="mt-1.5 shrink-0">
                        {!notif.read ? (
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-transparent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-200 truncate">
                          {notif.title}
                        </p>
                        {notif.body && (
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                            {notif.body}
                          </p>
                        )}
                        <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                          {formatTime(notif.receivedAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>


          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-zinc-900 text-center">
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                Real-time only · Not persisted
              </span>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
