import React, { useEffect, useState } from 'react';

interface Applicant {
  id: string;
  name: string;
  email: string;
  cohort: string;
  score: number;
  status: string;
  created_at: string;
}

const BetaAdmin: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/beta/applicants')
      .then(res => res.json())
      .then(data => {
        setApplicants(data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Beta Applicant Dashboard</h2>
          <p className="text-gray-500 text-sm">Managing recruitment for the first 100 Premium testers.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">Total Apps</span>
            <span className="text-xl font-bold text-[#0A7E8C]">{applicants.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">High Quality (Sc &gt; 6)</span>
            <span className="text-xl font-bold text-teal-600">{applicants.filter(a => a.score > 6).length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase">Cohort</th>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase">Score</th>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase">Applied</th>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading applicants...</td></tr>
            ) : applicants.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No applicants yet.</td></tr>
            ) : applicants.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{a.name}</div>
                  <div className="text-[12px] text-gray-500">{a.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    a.cohort === 'Household Manager' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {a.cohort}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0A7E8C]" style={{ width: `${(a.score / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-[12px] font-bold text-gray-700">{a.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-500">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="text-[12px] font-bold text-[#0A7E8C] hover:underline">Accept Invite</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetaAdmin;
