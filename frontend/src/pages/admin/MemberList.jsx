import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function MemberList() {
    const [members, setMembers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [earnings, setEarnings] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/admin/members').then(r => setMembers(r.data)).catch(console.error);
    }, []);

    const viewMember = async (id) => {
        const { data } = await api.get(`/admin/members/${id}`);
        setSelected(data); setEarnings(data.earnings || '');
    };

    const saveEarnings = async () => {
        setSaving(true);
        await api.patch(`/admin/members/${selected.id}/earnings`, { earnings });
        setSaving(false);
        alert('Earnings updated!');
    };

    const BASE = 'http://localhost:5000/uploads/';

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Member List</h2>
            {selected ? (
                <div>
                    <button onClick={() => setSelected(null)} className="mb-4 text-indigo-600 hover:underline text-sm">← Back</button>
                    <div className="bg-white rounded-xl shadow p-6 space-y-4">
                        <h3 className="text-lg font-semibold">{selected.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {['village', 'taluka', 'district', 'state', 'pincode', 'email', 'contact', 'whatsapp'].map(k => (
                                <div key={k}><span className="text-gray-500 capitalize">{k}: </span><span className="font-medium">{selected[k] || '—'}</span></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {['field_area_meter', 'field_area_acre', 'field_area_gunta'].map(k => (
                                <div key={k}><span className="text-gray-500">{k.replace('field_area_', '') + ': '}</span><span className="font-medium">{selected[k] || '—'}</span></div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm">
                            {['aadhaar_doc', 'pan_doc', 'doc_712', 'doc_8a'].map(k => selected[k] && (
                                <a key={k} href={BASE + selected[k]} target="_blank" rel="noreferrer"
                                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-100">
                                    📄 {k.replace('_', ' ').toUpperCase()}
                                </a>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Earnings Info (Admin Managed)</label>
                            <textarea rows={4} value={earnings} onChange={e => setEarnings(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                            <button onClick={saveEarnings} disabled={saving}
                                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60">
                                {saving ? 'Saving...' : 'Save Earnings'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr>
                            {['Name', 'Agent', 'Village', 'District', 'Contact', 'Joined', 'Action'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-gray-600 font-medium">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>{members.map(m => (
                            <tr key={m.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{m.name}</td>
                                <td className="px-4 py-3">{m.agent_name}</td>
                                <td className="px-4 py-3">{m.village}</td>
                                <td className="px-4 py-3">{m.district}</td>
                                <td className="px-4 py-3">{m.contact}</td>
                                <td className="px-4 py-3">{new Date(m.created_at).toLocaleDateString('en-IN')}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => viewMember(m.id)} className="text-indigo-600 hover:underline text-xs font-medium">View</button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                    {members.length === 0 && <p className="text-center py-8 text-gray-400">No members found</p>}
                </div>
            )}
        </div>
    );
}