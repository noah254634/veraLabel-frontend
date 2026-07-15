import { useState, useEffect, useRef } from 'react';
import { requestNotificationPermission, onForegroundMessage } from './firebase';
import { api } from './shared/types/api';

interface UserOption {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const NotificationTester = () => {
  const [activeTab, setActiveTab] = useState<'push' | 'email'>('push');
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<string>('Idle');
  
  // Push states
  const [sendTitle, setSendTitle] = useState('Test Push');
  const [sendBody, setSendBody] = useState('Hello from VeraLabel 👋');
  const [lastReceived, setLastReceived] = useState<string | null>(null);

  // Structured Email states
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('VeraLabel System Notification');
  const [emailHeading, setEmailHeading] = useState('System Announcement');
  const [emailBodyText, setEmailBodyText] = useState(
    'We have updated the protocol guidelines for the ongoing dataset curation projects.\n\n' +
    'Please review the updated templates inside your Protocol templates registry to ensure task submissions meet the new quality compliance rules.'
  );
  const [emailSignOff, setEmailSignOff] = useState('Yours sincerely,\nThe VeraLabel Admin Team');
  const [emailAttachments, setEmailAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSending, setIsSending] = useState(false);

  // ── Recipient Combobox State ──
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const recipientInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch users on mount (or when email tab is first opened)
  useEffect(() => {
    if (activeTab === 'email' && allUsers.length === 0 && !usersLoading) {
      setUsersLoading(true);
      api.get('/users')
        .then((res: any) => {
          const data = res?.data?.data ?? res?.data ?? res;
          const users = Array.isArray(data) ? data : [];
          setAllUsers(users.map((u: any) => ({
            _id: u._id,
            name: u.name || u.username || '',
            email: u.email || '',
            role: u.role || '',
          })));
        })
        .catch(() => {
          // Silently fail — user can still type manually
        })
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab]);

  // Filter users based on typed input
  const filteredUsers = emailTo.trim().length > 0
    ? allUsers.filter((u) => {
        const q = emailTo.toLowerCase();
        return (
          u.email.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      })
    : allUsers;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        recipientInputRef.current && !recipientInputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRecipientKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredUsers.length === 0) {
      if (e.key === 'ArrowDown' && allUsers.length > 0) {
        setShowDropdown(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredUsers.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredUsers.length) {
        setEmailTo(filteredUsers[highlightedIndex].email);
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const selectUser = (user: UserOption) => {
    setEmailTo(user.email);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    recipientInputRef.current?.focus();
  };

  // Role badge color helper
  const getRoleBadge = (role: string) => {
    const r = role.toLowerCase();
    if (r === 'admin' || r === 'superadmin') return { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' };
    if (r === 'reviewer') return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' };
    if (r === 'buyer' || r === 'seller') return { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    return { bg: 'bg-zinc-500/15', text: 'text-zinc-400', border: 'border-zinc-500/30' };
  };

  useEffect(() => {
    const unsub = onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? '(no title)';
      const body  = payload.notification?.body  ?? '';
      setLastReceived(`🔔 ${title}${body ? ` — ${body}` : ''}`);
    });
    return () => unsub();
  }, []);

  const handleRequestToken = async () => {
    setStatus('Requesting permission & fetching token…');
    const tok = await requestNotificationPermission();
    if (tok) {
      setToken(tok);
      setStatus('✓ Token registered with backend');
    } else {
      setStatus('✗ Permission denied or token unavailable');
    }
  };

  const handleBroadcast = async () => {
    if (!sendTitle || !sendBody) return;
    try {
      setStatus('Sending broadcast…');
      const res = await api.post('/notifications/broadcast', {
        title: sendTitle,
        body: sendBody,
      });
      setStatus(`✓ Broadcast sent — ${JSON.stringify(res.data)}`);
    } catch (err: any) {
      setStatus(`✗ ${err?.response?.data?.message ?? err.message}`);
    }
  };

  const handleSendSelf = async () => {
    if (!token) { setStatus('✗ Generate a token first'); return; }
    try {
      setStatus('Sending to self…');
      await api.post('/notifications/broadcast', {
        title: sendTitle,
        body: sendBody,
      });
      setStatus('✓ Notification sent — watch for the toast!');
    } catch (err: any) {
      setStatus(`✗ ${err?.response?.data?.message ?? err.message}`);
    }
  };

  const handleAddAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setEmailAttachments((prev) => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 5);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    setEmailAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSendEmail = async () => {
    if (!emailTo || !emailSubject || !emailHeading || !emailBodyText) {
      setStatus('✗ Recipient email, subject, heading, and body are required');
      return;
    }
    
    try {
      setIsSending(true);
      setStatus('Dispatching email…');

      const formData = new FormData();
      formData.append('to', emailTo);
      formData.append('subject', emailSubject);
      formData.append('heading', emailHeading);
      formData.append('bodyText', emailBodyText);
      formData.append('signOff', emailSignOff);

      emailAttachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await api.post('/notifications/send-email', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus(`✓ Email sent successfully — ${JSON.stringify(res.data)}`);
      setEmailAttachments([]);
    } catch (err: any) {
      setStatus(`✗ ${err?.response?.data?.message ?? err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Highlight matching text in search results
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-indigo-300 font-bold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="p-6 bg-[#050505] border border-zinc-900 rounded-sm space-y-5 font-mono text-xs max-w-xl">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-white font-bold uppercase tracking-widest text-sm">
          // System Dispatch Center
        </h3>
        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-bold text-indigo-400 rounded-sm uppercase tracking-wider">
          v4.0_Core
        </span>
      </div>
      <div className="flex gap-2 border-b border-zinc-900 pb-2">
        <button
          onClick={() => {
            setActiveTab('push');
            setStatus('Idle');
          }}
          className={`px-3 py-1.5 font-bold uppercase tracking-widest transition-all rounded-sm ${
            activeTab === 'push'
              ? 'bg-zinc-900 text-indigo-400 border border-zinc-800'
              : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          Push_Notifications
        </button>
        <button
          onClick={() => {
            setActiveTab('email');
            setStatus('Idle');
          }}
          className={`px-3 py-1.5 font-bold uppercase tracking-widest transition-all rounded-sm ${
            activeTab === 'email'
              ? 'bg-zinc-900 text-indigo-400 border border-zinc-800'
              : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          Email_Dispatcher
        </button>
      </div>
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-sm flex items-center justify-between">
        <div>
          <span className="text-zinc-500">status: </span>
          <span className="text-indigo-400">{status}</span>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
      </div>

      {activeTab === 'push' ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-zinc-500 uppercase tracking-wider font-bold">// Step 1 — Register Device Token</p>
            <button
              id="fcm-request-token-btn"
              onClick={handleRequestToken}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest rounded-sm transition-all"
            >
              Request Permission &amp; Get Token
            </button>
            {token && (
              <div className="p-3 bg-black border border-zinc-800 text-emerald-400 break-all select-all text-[10px] mt-2">
                {token}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-zinc-500 uppercase tracking-wider font-bold">// Step 2 — Compose Notification</p>
            <input
              id="notif-title"
              value={sendTitle}
              onChange={e => setSendTitle(e.target.value)}
              placeholder="Notification Title"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
            />
            <input
              id="notif-body"
              value={sendBody}
              onChange={e => setSendBody(e.target.value)}
              placeholder="Notification Body"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <p className="text-zinc-500 uppercase tracking-wider font-bold">// Step 3 — Dispatch</p>
            <div className="flex gap-2">
              <button
                id="notif-send-self-btn"
                onClick={handleSendSelf}
                className="flex-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest rounded-sm transition-all"
              >
                Send to Self
              </button>
              <button
                id="notif-broadcast-btn"
                onClick={handleBroadcast}
                className="flex-1 px-4 py-2 bg-violet-700 hover:bg-violet-600 text-white font-bold uppercase tracking-widest rounded-sm transition-all"
              >
                Broadcast All
              </button>
            </div>
          </div>

          {lastReceived && (
            <div className="p-3 bg-zinc-950 border border-emerald-800 rounded-sm text-emerald-400 animate-pulse">
              {lastReceived}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="space-y-3">
            <p className="text-zinc-500 uppercase tracking-wider font-bold">// Compose Structured Email</p>
            
            {/* ── Recipient Combobox ── */}
            <div className="space-y-1 relative">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Recipient Address (to):</span>
              <div className="relative">
                <input
                  ref={recipientInputRef}
                  id="email-to"
                  value={emailTo}
                  onChange={(e) => {
                    setEmailTo(e.target.value);
                    setShowDropdown(true);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={handleRecipientKeyDown}
                  placeholder={usersLoading ? 'Loading users…' : 'Search users or type an email…'}
                  autoComplete="off"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500 pr-8"
                />
                {/* Chevron indicator */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    recipientInputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-150 ${showDropdown ? 'rotate-180' : ''}`}>
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 left-0 right-0 top-full mt-1 bg-[#0a0a0a] border border-zinc-800 rounded-sm shadow-2xl shadow-black/60 max-h-52 overflow-y-auto"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a transparent' }}
                >
                  {usersLoading ? (
                    <div className="px-3 py-4 text-center text-zinc-600 text-[10px] uppercase tracking-wider">
                      <span className="inline-block animate-pulse">Loading users…</span>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    <>
                      {/* Typed email as custom option (if it looks like an email and isn't in the list) */}
                      {emailTo.includes('@') && !filteredUsers.some(u => u.email.toLowerCase() === emailTo.toLowerCase()) && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowDropdown(false);
                            setHighlightedIndex(-1);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-indigo-500/10 border-b border-zinc-900 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 text-[10px]">✉</span>
                            <span className="text-white text-[11px]">{emailTo}</span>
                            <span className="text-[9px] text-zinc-600 ml-auto uppercase tracking-wider">Custom</span>
                          </div>
                        </button>
                      )}
                      {filteredUsers.slice(0, 20).map((user, idx) => {
                        const isHighlighted = idx === highlightedIndex;
                        const badge = getRoleBadge(user.role);
                        return (
                          <button
                            key={user._id}
                            type="button"
                            onClick={() => selectUser(user)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`w-full text-left px-3 py-2 transition-colors border-b border-zinc-900/50 last:border-b-0 ${
                              isHighlighted ? 'bg-indigo-500/10' : 'hover:bg-zinc-900/60'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {/* Avatar circle */}
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-zinc-700 flex items-center justify-center shrink-0">
                                <span className="text-[8px] text-indigo-300 font-bold uppercase">
                                  {user.name.charAt(0) || user.email.charAt(0)}
                                </span>
                              </div>
                              {/* Name + Email */}
                              <div className="min-w-0 flex-1">
                                <div className="text-zinc-200 text-[11px] truncate leading-tight">
                                  {highlightMatch(user.name || '(unnamed)', emailTo)}
                                </div>
                                <div className="text-zinc-500 text-[10px] truncate leading-tight">
                                  {highlightMatch(user.email, emailTo)}
                                </div>
                              </div>
                              {/* Role badge */}
                              <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}>
                                {user.role}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                      {filteredUsers.length > 20 && (
                        <div className="px-3 py-1.5 text-center text-zinc-600 text-[9px] uppercase tracking-wider">
                          +{filteredUsers.length - 20} more — keep typing to narrow
                        </div>
                      )}
                    </>
                  ) : emailTo.trim().length > 0 ? (
                    <div className="px-3 py-3 space-y-2">
                      <div className="text-zinc-600 text-[10px] uppercase tracking-wider text-center">No matching users</div>
                      {emailTo.includes('@') && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowDropdown(false);
                            setHighlightedIndex(-1);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-indigo-500/10 rounded-sm transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 text-[10px]">✉</span>
                            <span className="text-white text-[11px]">Use "{emailTo}" as-is</span>
                            <span className="text-[9px] text-zinc-600 ml-auto uppercase tracking-wider">Custom</span>
                          </div>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="px-3 py-2.5 text-zinc-600 text-[10px] uppercase tracking-wider text-center">
                      Type to search or select a user
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Email Subject:</span>
              <input
                id="email-subject"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                placeholder="Subject Line"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Email Heading (Header inside card):</span>
              <input
                id="email-heading"
                value={emailHeading}
                onChange={e => setEmailHeading(e.target.value)}
                placeholder="Notice / System Announcement"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Message Body (Plain Text):</span>
              <textarea
                id="email-body"
                value={emailBodyText}
                onChange={e => setEmailBodyText(e.target.value)}
                placeholder="Write message paragraphs here..."
                rows={6}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Sign-off / Sender Note:</span>
              <textarea
                id="email-signoff"
                value={emailSignOff}
                onChange={e => setEmailSignOff(e.target.value)}
                placeholder={'Yours sincerely,\nThe VeraLabel Admin Team'}
                rows={3}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500 font-mono text-[11px] resize-y"
              />
            </div>

            {/* ── Attachments Section ── */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Attachments (max 5 files, 10MB each):</span>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleAddAttachments}
                className="hidden"
                id="email-attachment-input"
              />
              
              <button
                id="email-add-attachment-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={emailAttachments.length >= 5}
                className={`w-full px-3 py-2 border border-dashed rounded-sm font-bold uppercase tracking-widest text-[10px] transition-all ${
                  emailAttachments.length >= 5
                    ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                    : 'border-zinc-700 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5'
                }`}
              >
                {emailAttachments.length >= 5 ? 'Max Attachments Reached' : '+ Attach Documents'}
              </button>

              {emailAttachments.length > 0 && (
                <div className="space-y-1">
                  {emailAttachments.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-sm group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-indigo-400 text-[10px] shrink-0">📎</span>
                        <span className="text-zinc-300 text-[10px] truncate">{file.name}</span>
                        <span className="text-zinc-600 text-[9px] shrink-0">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-zinc-600 hover:text-red-400 text-[10px] font-bold ml-2 transition-colors shrink-0"
                        title="Remove attachment"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            id="email-dispatch-btn"
            onClick={handleSendEmail}
            disabled={isSending}
            className={`w-full px-4 py-2.5 text-white font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 ${
              isSending
                ? 'bg-indigo-600/50 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isSending && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isSending ? 'Dispatching…' : 'Dispatch Email'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationTester;
