import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('/admin/dashboard').then(r => setData(r.data)).catch(console.error);
    }, []);

    if (!data) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-indigo-600 text-white rounded-xl p-6 shadow">
                    <p className="text-indigo-200 text-sm">Total Agents</p>
                    <p className="text-4xl font-bold mt-1">{data.agentCount}</p>
                </div>
                <div className="bg-emerald-600 text-white rounded-xl p-6 shadow">
                    <p className="text-emerald-200 text-sm">Total Members</p>
                    <p className="text-4xl font-bold mt-1">{data.memberCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-5">
                    <h3 className="font-semibold text-gray-700 mb-3">Recent Agents</h3>
                    {data.recentAgents.length === 0 ? <p className="text-gray-400 text-sm">None yet</p> :
                        data.recentAgents.map((a, i) => (
                            <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
                                <span className="text-gray-800">{a.name}</span>
                                <span className="text-gray-400">{new Date(a.created_at).toLocaleDateString('en-IN')}</span>
                            </div>
                        ))}
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                    <h3 className="font-semibold text-gray-700 mb-3">Recent Members</h3>
                    {data.recentMembers.length === 0 ? <p className="text-gray-400 text-sm">None yet</p> :
                        data.recentMembers.map((m, i) => (
                            <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
                                <span className="text-gray-800">{m.name}</span>
                                <span className="text-gray-400">{new Date(m.created_at).toLocaleDateString('en-IN')}</span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}