import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Earnings() {
    const [earnings, setEarnings] = useState('');

    useEffect(() => {
        api.get('/member/earnings').then(r => setEarnings(r.data.earnings || '')).catch(console.error);
    }, []);

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Earnings</h2>
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">💰</span>
                    <h3 className="font-semibold text-gray-700">Earnings Information</h3>
                </div>
                <p className="text-xs text-gray-400 mb-3">This information managed by admin</p>
                <textarea readOnly rows={8} value={earnings || 'No earnings available.'}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-700 resize-none focus:outline-none cursor-default" />
            </div>
        </div>
    );
}