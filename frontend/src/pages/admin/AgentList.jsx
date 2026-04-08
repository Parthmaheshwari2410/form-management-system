import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AgentList() {
    const [agents, setAgents] = useState([]);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        api.get('/admin/agents').then(r => setAgents(r.data)).catch(console.error);
    }, []);

    const viewAgent = async (id) => {
        const { data } = await api.get(`/admin/agents/${id}`);
        setDetail(data); setSelected(id);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent List</h2>

            {selected && detail ? (
                <div>
                    <button onClick={() => setSelected(null)} className="mb-4 text-indigo-600 hover:underline text-sm">← Back to list</button>
                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">{detail.agent.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {['email', 'contact', 'village', 'taluka', 'district', 'state'].map(k => (
                                <div key={k}><span className="text-gray-500 capitalize">{k}: </span><span className="font-medium">{detail.agent[k] || '—'}</span></div>
                            ))}
                        </div>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-3">Members Onboarded ({detail.members.length})</h4>
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50"><tr>
                                {['Name', 'Village', 'District', 'Contact', 'Joined'].map(h => <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>)}
                            </tr></thead>
                            <tbody>{detail.members.map(m => (
                                <tr key={m.id} className="border-t">
                                    <td className="px-4 py-3">{m.name}</td>
                                    <td className="px-4 py-3">{m.village}</td>
                                    <td className="px-4 py-3">{m.district}</td>
                                    <td className="px-4 py-3">{m.contact}</td>
                                    <td className="px-4 py-3">{new Date(m.created_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr>
                            {['Name', 'Email', 'Contact', 'District', 'Members', 'Joined', 'Action'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>{agents.map(a => (
                            <tr key={a.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{a.name}</td>
                                <td className="px-4 py-3">{a.email}</td>
                                <td className="px-4 py-3">{a.contact}</td>
                                <td className="px-4 py-3">{a.district}</td>
                                <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">{a.memberCount}</span></td>
                                <td className="px-4 py-3">{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => viewAgent(a.id)} className="text-indigo-600 hover:underline text-xs font-medium">View</button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                    {agents.length === 0 && <p className="text-center py-8 text-gray-400">No agents found</p>}
                </div>
            )}
        </div>
    );
}