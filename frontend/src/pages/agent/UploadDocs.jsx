import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function UploadDocs() {
    const [members, setMembers] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [files, setFiles] = useState({ aadhaar_doc: null, pan_doc: null, doc_712: null, doc_8a: null });
    const [msg, setMsg] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/agent/members').then(r => setMembers(r.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedId) return setError('select a member');
        setLoading(true); setMsg(''); setError('');
        const fd = new FormData();
        Object.entries(files).forEach(([k, v]) => v && fd.append(k, v));
        try {
            const { data } = await api.patch(`/agent/members/${selectedId}/docs`, fd);
            setMsg(data.message);
        } catch (err) { setError(err.response?.data?.message || 'Error'); }
        finally { setLoading(false); }
    };

    const lbl = 'block text-sm font-medium text-gray-700 mb-1';
    const fileInp = 'w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700';

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Documents</h2>
            {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{msg}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">
                <div>
                    <label className={lbl}>Select Member *</label>
                    <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <option value="">Select</option>
                        {members.map(m => <option key={m.id} value={m.id}>{m.name} — {m.village}</option>)}
                    </select>
                </div>

                {[['aadhaar_doc', 'Aadhaar Document'], ['pan_doc', 'PAN Document'], ['doc_712', '7/12 Document'], ['doc_8a', '8A Document']].map(([k, l]) => (
                    <div key={k}>
                        <label className={lbl}>{l}</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setFiles({ ...files, [k]: e.target.files[0] })} className={fileInp} />
                    </div>
                ))}

                <button type="submit" disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60">
                    {loading ? 'Uploading...' : 'Upload Documents'}
                </button>
            </form>
        </div>
    );
}