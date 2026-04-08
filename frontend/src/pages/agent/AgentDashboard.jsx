import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function AgentDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('/agent/dashboard').then(r => setData(r.data)).catch(console.error);
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h2>
            <p className="text-gray-500 mb-6">Agent Dashboard</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-600 text-white rounded-xl p-6 shadow">
                    <p className="text-emerald-200 text-sm">Members Onboarded</p>
                    <p className="text-4xl font-bold mt-1">{data?.memberCount ?? '—'}</p>
                </div>
                <div className="bg-indigo-600 text-white rounded-xl p-6 shadow">
                    <p className="text-indigo-200 text-sm">Your Email</p>
                    <p className="text-lg font-semibold mt-1 truncate">{user?.email}</p>
                </div>
            </div>
        </div>
    );
}