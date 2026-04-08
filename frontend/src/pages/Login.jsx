import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
    const [form, setForm] = useState({ login: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const { data } = await api.post('/auth/login', form);
            login(data.user, data.token);
            const routes = {
                admin: '/admin/dashboard',
                agent: '/agent/dashboard',
                member: '/member/profile',
            };
            navigate(routes[data.user.role] || '/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-900 via-indigo-800 to-purple-900 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏛️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">FMS Portal</h1>
                    <p className="text-gray-500 text-sm mt-1">Form Management System</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                            <span className="text-gray-400 font-normal ml-1">(Admin use email)</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.login}
                            onChange={e => setForm({ ...form, login: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                        {loading ? 'Loging in...' : 'Log In'}
                    </button>
                </form>



            </div>
        </div>
    );
}