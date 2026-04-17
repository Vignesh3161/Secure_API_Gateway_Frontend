import axios from 'axios';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/admin/logs');
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-10 max-w-[1400px] mx-auto bg-[#f5ece5] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1e293b] mb-2">Audit Logs</h1>
          <p className="text-slate-400 font-medium">Deep dive into gateway traffic and security events</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white text-slate-600 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all font-bold text-sm">
            <Download className="h-4 w-4 text-[#f15a24]" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-slate-50">
        <div className="flex justify-between items-center mb-8">
           <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by IP, Path or Method..."
                className="bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-3.5 w-full text-sm focus:ring-2 focus:ring-[#f15a24]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-slate-50 text-slate-500 px-5 py-3 rounded-2xl hover:bg-slate-100 transition-colors font-bold text-xs uppercase cursor-pointer">
                <Calendar className="h-4 w-4" />
                Date Range
              </button>
              <button className="flex items-center gap-2 bg-[#111111] text-white px-5 py-3 rounded-2xl hover:bg-[#222222] transition-colors font-bold text-xs uppercase cursor-pointer">
                <Filter className="h-4 w-4 text-[#f15a24]" />
                Filters
              </button>
           </div>
        </div>

        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest px-6">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Path</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Latency</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Security</th>
              <th className="px-6 py-4 pb-4"></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="text-slate-700 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 text-xs font-bold text-slate-400 leading-none bg-slate-50/30 first:rounded-l-2xl">
                   {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-5 font-bold bg-slate-50/30">
                  <span className={cn(
                    "px-2.5 py-1 rounded text-[10px] uppercase font-black",
                    log.method === 'GET' ? 'bg-green-100 text-green-600' :
                    log.method === 'POST' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  )}>
                    {log.method}
                  </span>
                </td>
                <td className="px-6 py-5 font-mono text-xs font-bold bg-slate-50/30">{log.url}</td>
                <td className="px-6 py-5 text-center bg-slate-50/30">
                  <span className={cn("font-black", log.status >= 400 ? 'text-red-500' : 'text-green-500')}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-400 bg-slate-50/30">{log.duration}</td>
                <td className="px-6 py-5 text-xs font-bold text-slate-400 bg-slate-50/30">{log.ip}</td>
                <td className="px-6 py-5 bg-slate-50/30">
                   <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full", log.status < 400 ? 'bg-green-500' : 'bg-red-500')} />
                      <span className={cn("text-[10px] font-black uppercase", log.status < 400 ? 'text-green-600' : 'text-red-500')}>
                        {log.status < 400 ? 'Verified' : 'Blocked'}
                      </span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right bg-slate-50/30 last:rounded-r-2xl">
                   <button className="text-slate-300 hover:text-slate-600 p-1 rounded-lg transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-10 flex justify-between items-center text-slate-400 text-xs font-bold">
          <span>Showing 1-5 of 1,243 logs</span>
          <div className="flex gap-4">
            <button className="px-5 py-2 hover:text-[#1e293b] transition-colors disabled:opacity-30" disabled>Previous</button>
            <button className="px-5 py-2 hover:text-[#1e293b] transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
