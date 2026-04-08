import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function MemberProfile() {
    const [profile, setProfile] = useState(null);
    const BASE = 'http://localhost:5000/uploads/';

    useEffect(() => {
        api.get('/member/profile').then(r => setProfile(r.data)).catch(console.error);
    }, []);

    if (!profile) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">👤</div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
                        <p className="text-gray-400 text-sm">Agent: {profile.agent_name || '—'}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-gray-700 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[['Village', profile.village], ['Taluka', profile.taluka], ['District', profile.district],
                        ['State', profile.state], ['PinCode', profile.pincode], ['Email', profile.email],
                        ['WhatsApp', profile.whatsapp], ['Contact', profile.contact]
                        ].map(([l, v]) => (
                            <div key={l} className="bg-gray-50 rounded-lg px-3 py-2">
                                <p className="text-gray-500 text-xs">{l}</p>
                                <p className="font-medium text-gray-800">{v || '—'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-gray-700 mb-3">Land Records</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                        {[['Meter', profile.field_area_meter], ['Acre', profile.field_area_acre], ['Gunta', profile.field_area_gunta]].map(([l, v]) => (
                            <div key={l} className="bg-gray-50 rounded-lg px-3 py-2">
                                <p className="text-gray-500 text-xs">{l}</p>
                                <p className="font-medium text-gray-800">{v || '—'}</p>
                            </div>
                        ))}
                    </div>
                    {profile.field_8a_info && (
                        <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2 text-sm">
                            <p className="text-gray-500 text-xs mb-1">8A Info</p>
                            <p className="text-gray-800">{profile.field_8a_info}</p>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-medium text-gray-700 mb-3">Documents</h4>
                    <div className="flex flex-wrap gap-3">
                        {[['aadhaar_doc', 'Aadhaar'], ['pan_doc', 'PAN'], ['doc_712', '7/12'], ['doc_8a', '8A']].map(([k, l]) =>
                            profile[k] ? (
                                <a key={k} href={BASE + profile[k]} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm hover:bg-indigo-100">
                                    📄 {l}
                                </a>
                            ) : (
                                <span key={k} className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm">{l}: Not uploaded</span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}