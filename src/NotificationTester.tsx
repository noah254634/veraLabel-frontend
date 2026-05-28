import { useState, useEffect } from 'react';
import { requestNotificationPermission, onForegroundMessage } from './firebase';
import { api } from './shared/types/api';

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

  const generateEmailHtml = (heading: string, bodyText: string, signOff: string) => {
    const formattedParagraphs = bodyText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => `<p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">${p}</p>`)
      .join('');

    const formattedSignOff = signOff
      ? `<p style="font-size: 14px; line-height: 1.5; color: #475569; font-style: italic; margin-top: 24px; border-top: 1px dashed #e2e8f0; padding-top: 16px; white-space: pre-line;">${signOff}</p>`
      : '';

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 800; tracking-tight: -0.025em; line-height: 1.2;">${heading}</h2>
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin: 5px 0 0 0; font-weight: 600;">Official Transmission</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          ${formattedParagraphs}
          ${formattedSignOff}
        </div>
        
        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 500;">
          <p style="margin: 0 0 5px 0;">This is an authorized administrator transmission from the VeraLabel platform.</p>
          <p style="margin: 0;">VeraLabel Operations Gateway © 2026</p>
        </div>
      </div>
    `;
  };

  const handleSendEmail = async () => {
    if (!emailTo || !emailSubject || !emailHeading || !emailBodyText) {
      setStatus('✗ Recipient email, subject, heading, and body are required');
      return;
    }
    
    try {
      setStatus('Compiling template and sending email…');
      const compiledHtml = generateEmailHtml(emailHeading, emailBodyText, emailSignOff);

      const res = await api.post('/notifications/send-email', {
        to: emailTo,
        subject: emailSubject,
        html: compiledHtml,
      });
      setStatus(`✓ Email sent successfully — ${JSON.stringify(res.data)}`);
    } catch (err: any) {
      setStatus(`✗ ${err?.response?.data?.message ?? err.message}`);
    }
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
            
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Recipient Address (to):</span>
              <input
                id="email-to"
                value={emailTo}
                onChange={e => setEmailTo(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
              />
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
              <input
                id="email-signoff"
                value={emailSignOff}
                onChange={e => setEmailSignOff(e.target.value)}
                placeholder="Yours sincerely, / Sent from Admin directly"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            id="email-dispatch-btn"
            onClick={handleSendEmail}
            className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest rounded-sm transition-all"
          >
            Dispatch Email
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
