import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AddMemberAdmin() {
    const [agents, setAgents] = useState([]);
    const [form, setForm] = useState({
        agent_id: '', name: '', village: '', taluka: '', district: '', state: '', pincode: '',
        email: '', whatsapp: '', contact: '', field_area_meter: '', field_area_acre: '',
        field_area_gunta: '', field_8a_info: ''
    });
    const [files, setFiles] = useState({ aadhaar_doc: null, pan_doc: null, doc_712: null, doc_8a: null });
    const [msg, setMsg] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/admin/agents').then(r => setAgents(r.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setMsg(''); setError('');
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        Object.entries(files).forEach(([k, v]) => v && fd.append(k, v));
        try {
            const { data } = await api.post('/admin/members', fd);
            setMsg(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Error');
        } finally { setLoading(false); }
    };

    const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';
    const lbl = 'block text-sm font-medium text-gray-700 mb-1';
    const fileInp = 'w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700';

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Member</h2>
            {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{msg}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
                <div>
                    <label className={lbl}>Assign to Agent *</label>
                    <select required value={form.agent_id} onChange={e => setForm({ ...form, agent_id: e.target.value })} className={inp}>
                        <option value="">-- Select Agent --</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
                    </select>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[['name', 'Name *'], ['village', 'Village *'], ['taluka', 'Taluka *'], ['district', 'District *'],
                        ['state', 'State *'], ['pincode', 'PinCode *'], ['email', 'Email ID'], ['whatsapp', 'WhatsApp Number'], ['contact', 'Contact Number']
                        ].map(([field, label]) => (
                            <div key={field}>
                                <label className={lbl}>{label}</label>
                                <input type={field === 'email' ? 'email' : 'text'} value={form[field]}
                                    required={label.includes('*')}
                                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                                    className={inp} />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Identity Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[['aadhaar_doc', 'Aadhaar Upload'], ['pan_doc', 'PAN Upload']].map(([key, label]) => (
                            <div key={key}>
                                <label className={lbl}>{label}</label>
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setFiles({ ...files, [key]: e.target.files[0] })} className={fileInp} />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">Land Records</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lbl}>7/12 Upload</label>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setFiles({ ...files, doc_712: e.target.files[0] })} className={fileInp} />
                        </div>
                        <div>
                            <label className={lbl}>8A Upload</label>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setFiles({ ...files, doc_8a: e.target.files[0] })} className={fileInp} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                        {[['field_area_meter', 'Meter'], ['field_area_acre', 'Acre'], ['field_area_gunta', 'Gunta']].map(([k, l]) => (
                            <div key={k}>
                                <label className={lbl}>{l}</label>
                                <input type="number" step="0.01" value={form[k]}
                                    onChange={e => setForm({ ...form, [k]: e.target.value })} className={inp} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-3">
                        <label className={lbl}>8A Info</label>
                        <textarea rows={3} value={form.field_8a_info}
                            onChange={e => setForm({ ...form, field_8a_info: e.target.value })}
                            className={inp} />
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60">
                    {loading ? 'Adding Member...' : 'Add Member'}
                </button>
            </form>
        </div>
    );
}