import { useEffect, useState, useCallback } from 'react';
import { 
  Globe, Shield, AlertTriangle, ShieldCheck, Activity, 
  RefreshCw, Search, AlertOctagon, HelpCircle 
} from 'lucide-react';
import { securityService } from '../services/securityService';
import type { GeoAccessLog, GeoAnalytics, GeoRequestAudit } from '../services/securityService';
import toast from 'react-hot-toast';

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
};

const SecurityPage = () => {
  const [logs, setLogs] = useState<GeoAccessLog[]>([]);
  const [audits, setAudits] = useState<GeoRequestAudit[]>([]);
  const [analytics, setAnalytics] = useState<GeoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'aggregated' | 'waf'>('aggregated');

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [logsData, analyticsData, auditsData] = await Promise.all([
        securityService.fetchGeoAccessLogs(),
        securityService.fetchGeoAnalytics(),
        securityService.fetchGeoRequestAudits()
      ]);
      setLogs(logsData);
      setAnalytics(analyticsData);
      setAudits(auditsData);
      if (isSilent) {
        toast.success("Geographic telemetry updated");
      }
    } catch (err: any) {
      console.error("Failed to fetch security logs", err);
      toast.error(err?.response?.data?.message || "Failed to sync geographic shield data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter logs based on search term (IP, Country, City, Path)
  const filteredLogs = logs.filter(log => {
    const search = searchTerm.toLowerCase();
    return (
      log.ip.toLowerCase().includes(search) ||
      log.country.toLowerCase().includes(search) ||
      (log.city || '').toLowerCase().includes(search) ||
      (log.lastPath || '').toLowerCase().includes(search)
    );
  });

  // Filter audits based on search term (IP, Country, City, Path, User Email/Name)
  const filteredAudits = audits.filter(audit => {
    const search = searchTerm.toLowerCase();
    return (
      audit.ip.toLowerCase().includes(search) ||
      audit.country.toLowerCase().includes(search) ||
      (audit.city || '').toLowerCase().includes(search) ||
      (audit.path || '').toLowerCase().includes(search) ||
      (audit.userId?.email || '').toLowerCase().includes(search) ||
      (audit.userId?.name || '').toLowerCase().includes(search)
    );
  });

  const blockedStats = analytics?.blockStatusBreakdown.find(b => b._id === true);
  const allowedStats = analytics?.blockStatusBreakdown.find(b => b._id === false);

  const blockedHits = blockedStats?.totalHits || 0;
  const allowedHits = allowedStats?.totalHits || 0;
  const totalHits = blockedHits + allowedHits;

  const blockedUnique = blockedStats?.uniqueVisitors || 0;
  const allowedUnique = allowedStats?.uniqueVisitors || 0;
  const totalUnique = analytics?.totalUniqueVisitors || 0;

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center font-mono text-zinc-500 uppercase tracking-widest gap-4">
        <Activity size={32} className="text-indigo-500 animate-spin" />
        <span>Syncing_Geographic_Buffer...</span>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-700 pb-20 selection:bg-indigo-500/30">
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-l-2 border-indigo-500 pl-6 md:pl-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-4">
            <Shield size={14} className="animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold underline underline-offset-8">Security_Core_v4.2</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none italic">
            Geographic Shield
          </h1>
          <p className="text-zinc-500 font-light text-sm mt-4">
            Auditing and logging client requests originating from outside Kenya boundaries.
          </p>
        </div>
        
        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center gap-3 bg-[#0A0A0A] border border-zinc-900 px-6 py-3 font-mono text-[9px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin text-indigo-400" : ""} />
          {refreshing ? "Refreshing..." : "Query_Live_Buffer"}
        </button>
      </header>

      {/* Telemetry overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 mb-16 shadow-2xl">
        <StatCard 
          icon={<Globe size={18} />} 
          label="Unique_Outside_IPs" 
          value={totalUnique} 
          color="text-indigo-500" 
          subText="7-day rolling window"
        />
        <StatCard 
          icon={<AlertTriangle size={18} />} 
          label="Blocked_Attempts" 
          value={blockedUnique} 
          color="text-rose-500" 
          subText={`${blockedHits} total requests denied`}
        />
        <StatCard 
          icon={<ShieldCheck size={18} />} 
          label="Allowed_Attempts" 
          value={allowedUnique} 
          color="text-emerald-500" 
          subText={`${allowedHits} regional bypasses`}
        />
        <StatCard 
          icon={<Activity size={18} />} 
          label="Total_Shield_Hits" 
          value={totalHits} 
          color="text-amber-500" 
          subText="Cumulative IP lookup counts"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mb-16">
        {/* Country Breakdown list */}
        <div className="xl:col-span-1 space-y-6">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-600">// Country_Breakdown</h3>
          </div>
          
          <div className="bg-[#050505] border border-zinc-900 p-6 space-y-4">
            {analytics?.countryBreakdown && analytics.countryBreakdown.length > 0 ? (
              <div className="space-y-4 font-mono">
                {analytics.countryBreakdown.map((item) => {
                  const pct = totalUnique > 0 ? Math.round((item.uniqueVisitors / totalUnique) * 100) : 0;
                  return (
                    <div key={item._id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base select-none">{getFlagEmoji(item._id)}</span>
                          <span className="text-white font-bold">{item._id}</span>
                          <span className="text-[10px] text-zinc-600">({item.totalHits} hits)</span>
                        </div>
                        <span className="text-indigo-400 font-bold">{item.uniqueVisitors} IPs ({pct}%)</span>
                      </div>
                      <div className="h-[3px] bg-zinc-900 overflow-hidden w-full">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                No foreign traffic detected.
              </div>
            )}
          </div>
        </div>

        {/* Live log table / WAF */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('aggregated')}
                className={`font-mono text-[9px] uppercase tracking-widest px-4 py-2 border-b-2 transition-all ${
                  activeTab === 'aggregated'
                    ? 'border-indigo-500 text-white font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Aggregated_IPs
              </button>
              <button
                onClick={() => setActiveTab('waf')}
                className={`font-mono text-[9px] uppercase tracking-widest px-4 py-2 border-b-2 transition-all ${
                  activeTab === 'waf'
                    ? 'border-indigo-500 text-white font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Live_WAF_Audits
              </button>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter IP, country, path..."
                className="w-full pl-9 pr-4 py-2 bg-black border border-zinc-900 text-xs text-white placeholder-zinc-700 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700" />
            </div>
          </div>

          <div className="bg-[#050505] border border-zinc-900 overflow-x-auto shadow-2xl">
            {activeTab === 'aggregated' ? (
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-600 uppercase tracking-widest">
                    <th className="p-4 font-bold">Origin_Client</th>
                    <th className="p-4 font-bold">Access_Details</th>
                    <th className="p-4 font-bold text-center">Hits</th>
                    <th className="p-4 font-bold">Verdict</th>
                    <th className="p-4 font-bold text-right">Last_Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                      const timeAgo = formatTimeAgo(log.lastAccess);
                      return (
                        <tr key={log._id} className="hover:bg-[#070709] transition-colors group">
                          <td className="p-4">
                            <p className="text-white font-bold group-hover:text-indigo-400 transition-colors">{log.ip}</p>
                            <p className="text-zinc-600 text-[8px] flex items-center gap-1.5 mt-0.5">
                              <span>{getFlagEmoji(log.country)} {log.country}</span>
                              <span>•</span>
                              <span className="truncate max-w-[100px]">{log.city || 'Unknown'}</span>
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1 py-0.5 text-[8px] font-bold ${
                                log.lastMethod === 'GET' ? 'text-indigo-400 bg-indigo-500/5' : 'text-amber-400 bg-amber-500/5'
                              }`}>
                                {log.lastMethod}
                              </span>
                              <span className="text-zinc-400 select-all">{log.lastPath}</span>
                            </div>
                            <p className="text-[8px] text-zinc-700 truncate max-w-[200px] mt-0.5" title={log.userAgent}>
                              {log.userAgent}
                            </p>
                          </td>
                          <td className="p-4 text-center text-zinc-300 font-bold tabular-nums">
                            {log.hits}
                          </td>
                          <td className="p-4">
                            {log.isBlocked ? (
                              <span className="px-2 py-0.5 border border-rose-500/20 bg-rose-500/5 text-rose-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit">
                                <AlertOctagon size={8} /> Blocked_403
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit">
                                <ShieldCheck size={8} /> Allowed_Bypass
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right text-zinc-500 tabular-nums">
                            {timeAgo}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-700 uppercase tracking-widest">
                        [ No access log records match search filter ]
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-600 uppercase tracking-widest">
                    <th className="p-4 font-bold">Time</th>
                    <th className="p-4 font-bold">Client</th>
                    <th className="p-4 font-bold">Request</th>
                    <th className="p-4 font-bold">Identity</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredAudits.length > 0 ? (
                    filteredAudits.map((audit) => {
                      const timeAgo = formatTimeAgo(audit.timestamp);
                      const isErr = audit.statusCode >= 400;
                      const isSuccess = audit.statusCode >= 200 && audit.statusCode < 300;
                      return (
                        <tr key={audit._id} className="hover:bg-[#070709] transition-colors group">
                          <td className="p-4 text-zinc-500 tabular-nums">
                            {timeAgo}
                          </td>
                          <td className="p-4">
                            <p className="text-white font-bold group-hover:text-indigo-400 transition-colors">{audit.ip}</p>
                            <p className="text-zinc-600 text-[8px] flex items-center gap-1.5 mt-0.5">
                              <span>{getFlagEmoji(audit.country)} {audit.country}</span>
                              <span>•</span>
                              <span className="truncate max-w-[100px]">{audit.city || 'Unknown'}</span>
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1 py-0.5 text-[8px] font-bold ${
                                audit.method === 'GET' ? 'text-indigo-400 bg-indigo-500/5' : 'text-amber-400 bg-amber-500/5'
                              }`}>
                                {audit.method}
                              </span>
                              <span className="text-zinc-400 select-all">{audit.path}</span>
                            </div>
                            <p className="text-[8px] text-zinc-700 truncate max-w-[200px] mt-0.5" title={audit.userAgent}>
                              {audit.userAgent}
                            </p>
                          </td>
                          <td className="p-4">
                            {audit.userId ? (
                              <div>
                                <p className="text-zinc-300 font-bold">{audit.userId.name}</p>
                                <p className="text-zinc-500 text-[8px]">{audit.userId.email} ({audit.userId.role})</p>
                              </div>
                            ) : (
                              <span className="text-zinc-600 italic">Anonymous</span>
                            )}
                          </td>
                          <td className="p-4 text-center tabular-nums font-bold">
                            <span className={`px-2 py-0.5 ${
                              isSuccess ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/10' :
                              isErr ? 'text-rose-400 bg-rose-500/5 border border-rose-500/10' :
                              'text-amber-400 bg-amber-500/5 border border-amber-500/10'
                            }`}>
                              {audit.statusCode || '---'}
                            </span>
                          </td>
                          <td className="p-4">
                            {audit.isBlocked ? (
                              <span className="px-2 py-0.5 border border-rose-500/20 bg-rose-500/5 text-rose-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit">
                                <AlertOctagon size={8} /> Blocked_403
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit">
                                <ShieldCheck size={8} /> Allowed_Bypass
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-700 uppercase tracking-widest">
                        [ No request audits match search filter ]
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Info notification */}
      <div className="bg-[#050505] border border-zinc-900 p-8 flex gap-4 items-start shadow-xl relative overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500" />
        <HelpCircle className="text-indigo-500 shrink-0 mt-0.5" size={18} />
        <div className="space-y-2 max-w-3xl font-mono text-[9px] uppercase tracking-widest text-zinc-500 leading-relaxed">
          <p className="text-zinc-300 font-bold">Geographic Shield Protocol (GEO_SHIELD):</p>
          <p>This panel audits traffic arriving from outside Kenya. Allowed non-KE traffic corresponds to authorized regional partner states (Uganda, Tanzania, Rwanda, Burundi, South Sudan) and system integrations (Paystack Webhooks). All USA, European, and Asian requests are automatically rejected with a 403 Forbidden response.</p>
          <p className="text-zinc-600">Note: Entries are stored as single unique logs per client IP address and are automatically purged from database collection storage after 7 days of inactivity to optimize capacity.</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, subText }: any) => (
  <div className="bg-[#050505] p-8 flex items-center gap-6 group hover:bg-black transition-colors">
    <div className={`p-3 bg-zinc-950 border border-zinc-900 transition-colors group-hover:border-zinc-700 ${color}`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-[9px] font-mono font-bold text-zinc-700 uppercase tracking-[0.2em] mb-1">// {label}</p>
      <p className="text-3xl font-bold text-white tracking-tighter tabular-nums leading-none">{value}</p>
      <p className="text-[8px] font-mono text-zinc-600 mt-2 uppercase tracking-wide truncate">{subText}</p>
    </div>
  </div>
);

const formatTimeAgo = (dateStr: string) => {
  try {
    const past = new Date(dateStr).getTime();
    const diff = Date.now() - past;
    
    if (diff < 60000) return 'Just now';
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return 'Unknown';
  }
};

export default SecurityPage;
