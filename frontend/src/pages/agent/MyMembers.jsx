import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function MyMembers() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        api.get('/agent/members').then(r => setMembers(r.data)).catch(console.error);
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Members ({members.length})</h2>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50"><tr>
                        {['Name', 'Village', 'District', 'Contact', 'Email', 'Joined'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>{members.map(m => (
                        <tr key={m.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{m.name}</td>
                            <td className="px-4 py-3">{m.village}</td>
                            <td className="px-4 py-3">{m.district}</td>
                            <td className="px-4 py-3">{m.contact}</td>
                            <td className="px-4 py-3">{m.email || '—'}</td>
                            <td className="px-4 py-3">{new Date(m.created_at).toLocaleDateString('en-IN')}</td>
                        </tr>
                    ))}</tbody>
                </table>
                {members.length === 0 && <p className="text-center py-8 text-gray-400">No members yet</p>}
            </div>
        </div>
    );
}
