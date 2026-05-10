import { useState, useEffect } from 'react';
import { requestNotificationPermission, onForegroundMessage } from './firebase';
import { api } from './shared/types/api';

const NotificationTester = () => {
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<string>('Idle');
  const [sendTitle, setSendTitle] = useState('Test Push');
  const [sendBody, setSendBody] = useState('Hello from VeraLabel 👋');
  const [lastReceived, setLastReceived] = useState<string | null>(null);


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

  return (
    <div className="p-6 bg-[#050505] border border-zinc-900 rounded-sm space-y-5 font-mono text-xs max-w-xl">
      <h3 className="text-white font-bold uppercase tracking-widest text-sm">
        // Push Notification Tester
      </h3>


      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-sm">
        <span className="text-zinc-500">status: </span>
        <span className="text-indigo-400">{status}</span>
      </div>


      <div className="space-y-2">
        <p className="text-zinc-500 uppercase tracking-wider">Step 1 — Register Device</p>
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
        <p className="text-zinc-500 uppercase tracking-wider">Step 2 — Compose</p>
        <input
          id="notif-title"
          value={sendTitle}
          onChange={e => setSendTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
        />
        <input
          id="notif-body"
          value={sendBody}
          onChange={e => setSendBody(e.target.value)}
          placeholder="Body"
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-sm outline-none focus:border-indigo-500"
        />
      </div>


      <div className="space-y-2">
        <p className="text-zinc-500 uppercase tracking-wider">Step 3 — Send</p>
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
  );
};

export default NotificationTester;
