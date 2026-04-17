import axios from 'axios';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/admin/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const formatTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };
  return (
    <div className="p-10 max-w-[1000px] mx-auto bg-[#f5ece5] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1e293b] mb-2">Security Alerts</h1>
          <p className="text-slate-400 font-medium">High-priority security events requiring investigation</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search alerts..." 
                className="bg-white rounded-full pl-12 pr-6 py-3 w-64 text-sm focus:outline-none shadow-sm border border-slate-100"
              />
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {alerts.map((alert) => (
          <div 
            key={alert._id}
            className={cn(
              "bg-white rounded-[2.5rem] p-6 flex gap-6 shadow-soft group transition-all hover:translate-x-1 border border-transparent",
              alert.type === 'critical' ? 'hover:border-red-100' : 'hover:border-blue-100'
            )}
          >
            <div className={cn(
              "p-4 rounded-[1.5rem] h-fit",
              alert.type === 'critical' ? 'text-red-500 bg-red-50' :
              alert.type === 'error' ? 'text-orange-500 bg-orange-50' :
              alert.type === 'warning' ? 'text-yellow-600 bg-yellow-50' :
              'text-blue-500 bg-blue-50'
            )}>
              {alert.type === 'critical' ? <ShieldAlert className="h-7 w-7" /> :
               alert.type === 'error' ? <XCircle className="h-7 w-7" /> :
               alert.type === 'warning' ? <AlertTriangle className="h-7 w-7" /> :
               <Info className="h-7 w-7" />}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black text-[#1e293b]">{alert.title}</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatTime(alert.time)}</span>
              </div>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed mb-6">
                {alert.description}
              </p>
              <div className="flex gap-4">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                  Investigate
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-200 self-center" />
                <button className="text-[10px] font-black uppercase tracking-widest text-[#f15a24] hover:text-[#d4481b] transition-colors">
                  Dismiss Alert
                </button>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-soft border border-slate-50">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-[#1e293b] font-black text-2xl">Security Healthy</h3>
            <p className="text-slate-400 font-medium">No active security alerts found for your instance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
