import React, { useState, useEffect } from 'react';

interface Job {
  id: string;
  job_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  last_error?: string;
  updated_at: string;
}

interface SyncStatusProps {
  userId: string;
  variant?: 'compact' | 'detailed';
}

const SyncStatus: React.FC<SyncStatusProps> = ({ userId, variant = 'compact' }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/user/${userId}/sync-status`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch sync status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [userId]);

  const handleRetry = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/retry`, { method: 'POST' });
      // Instant visual feedback
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'processing' } : j));
      setTimeout(fetchStatus, 1000);
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  if (loading && jobs.length === 0) return null;

  // Overall status logic
  const hasFailed = jobs.some(j => j.status === 'failed');
  const isProcessing = jobs.some(j => j.status === 'processing');
  
  const overallStatus = hasFailed ? 'failed' : isProcessing ? 'processing' : 'completed';

  const getJobIcon = (type: string) => {
    switch (type) {
      case 'calendar_sync': return '📅';
      case 'grocery_sync': return '🛒';
      case 'expense_sync': return '💰';
      case 'email_sync': return '📧';
      default: return '🔗';
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all hover:bg-white ${
        overallStatus === 'failed' ? 'bg-[#FED7D7] border-[#FEB2B2]' :
        overallStatus === 'processing' ? 'bg-[#E0F2F4] border-[#B2E2E6]' :
        'bg-gray-50 border-gray-100 hover:border-gray-200'
      }`}>
        <div className="relative flex items-center justify-center">
          {overallStatus === 'processing' ? (
            <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-[#0A7E8C] rounded-full animate-spin" />
          ) : overallStatus === 'failed' ? (
            <span className="text-[10px]">⚠️</span>
          ) : (
            <span className="text-[10px] text-[#38A169]">✓</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-gray-700 leading-none truncate">
            {overallStatus === 'processing' ? 'Syncing...' : overallStatus === 'failed' ? 'Sync Error' : 'All Synced'}
          </div>
          <div className="text-[9px] text-gray-400 mt-0.5 leading-none uppercase font-bold tracking-tight">
            {jobs.length} Services
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <h3 className="text-[14px] font-bold text-gray-800 flex items-center gap-2">
          <span className="text-lg">🔗</span> Integration Sync Status
        </h3>
        <div className="flex items-center gap-2">
           {isProcessing && <div className="w-3 h-3 border-2 border-gray-100 border-t-[#0A7E8C] rounded-full animate-spin" />}
           <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Live Status</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        {jobs.length === 0 ? (
          <div className="text-[13px] text-gray-400 text-center py-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
            No active sync jobs found.
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className={`flex items-center gap-3.5 p-3.5 border rounded-xl transition-all group ${
              job.status === 'failed' ? 'border-[#FED7D7] bg-[#FFF5F5]' : 'border-gray-100 hover:border-[#E0F2F4] hover:shadow-xs'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors ${
                job.status === 'failed' ? 'bg-[#FED7D7]' :
                job.status === 'processing' ? 'bg-[#E0F2F4]' :
                'bg-[#F1F3F5] group-hover:bg-[#E6F7EC]'
              }`}>
                {getJobIcon(job.job_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-gray-800 capitalize">
                    {job.job_type.replace('_', ' ').replace('sync', '')}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                    job.status === 'completed' ? 'bg-[#E6F7EC] text-[#38A169]' :
                    job.status === 'processing' ? 'bg-[#E0F2F4] text-[#0A7E8C]' :
                    'bg-[#FED7D7] text-[#E53E3E]'
                  }`}>
                    {job.status === 'completed' ? 'Healthy' : job.status}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5 truncate flex items-center gap-1.5">
                  {job.status === 'failed' ? (
                    <span className="text-[#E53E3E] font-medium italic">⚠️ {job.last_error || 'Sync failed'}</span>
                  ) : (
                    <>
                      <span className="flex-none">✓ Last check</span>
                      <span className="font-medium text-gray-700">{new Date(job.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                {job.status === 'failed' ? (
                  <button 
                    onClick={() => handleRetry(job.id)}
                    className="px-3.5 py-1.5 bg-[#E53E3E] text-white text-[11px] font-bold rounded-lg hover:bg-[#C53030] shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <span>↻</span> Retry
                  </button>
                ) : (
                  <button 
                    onClick={() => handleRetry(job.id)}
                    disabled={job.status === 'processing'}
                    className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {job.status === 'processing' ? 'Syncing...' : 'Sync Now'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#38A169] animate-pulse"></div>
        <span className="text-[10px] text-gray-500 font-medium italic">Engine active and monitoring.</span>
      </div>
    </div>
  );
};

export default SyncStatus;
