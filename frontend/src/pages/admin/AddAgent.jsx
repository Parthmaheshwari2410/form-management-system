import { useState } from 'react';
import api from '../../api/axios';

export default function AddAgent() {
    const [form, setForm] = useState({
        name: '', dob: '', village: '', taluka: '', district: '', state: '', email: '', contact: ''
    });
    const [files, setFiles] = useState({ aadhaar_doc: null, pan_doc: null });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg(''); setError('');
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (files.aadhaar_doc) fd.append('aadhaar_doc', files.aadhaar_doc);
        if (files.pan_doc) fd.append('pan_doc', files.pan_doc);
        try {
            const { data } = await api.post('/admin/agents', fd);
            setMsg(data.message);
            setForm({ name: '', dob: '', village: '', taluka: '', district: '', state: '', email: '', contact: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding agent');
        } finally {
            setLoading(false);
        }
    };

    const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';
    const lbl = 'block text-sm font-medium text-gray-700 mb-1';

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Agent</h2>
            {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{msg}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[['name', 'Name *'], ['dob', 'Date of Birth'], ['village', 'Village *'], ['taluka', 'Taluka *'],
                    ['district', 'District *'], ['state', 'State *'], ['email', 'Email *'], ['contact', 'Contact Number']
                    ].map(([field, label]) => (
                        <div key={field}>
                            <label className={lbl}>{label}</label>
                            <input type={field === 'dob' ? 'date' : field === 'email' ? 'email' : 'text'}
                                value={form[field]} required={label.includes('*')}
                                onChange={e => setForm({ ...form, [field]: e.target.value })}
                                className={inp} />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={lbl}>Aadhaar Document</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setFiles({ ...files, aadhaar_doc: e.target.files[0] })}
                            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700" />
                    </div>
                    <div>
                        <label className={lbl}>PAN Document</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setFiles({ ...files, pan_doc: e.target.files[0] })}
                            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700" />
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
                    {loading ? 'Adding Agent...' : 'Add Agent'}
                </button>
            </form>
        </div>
    );
}