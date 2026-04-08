import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', },
    { to: '/admin/add-agent', label: 'Add Agent', },
    { to: '/admin/add-member', label: 'Add Member', },
    { to: '/admin/agents', label: 'Agent List', },
    { to: '/admin/members', label: 'Member List', },
];

const agentLinks = [
    { to: '/agent/dashboard', label: 'Dashboard', },
    { to: '/agent/add-member', label: 'Add Member', },
    { to: '/agent/my-members', label: 'My Members', },
    { to: '/agent/upload-docs', label: 'Upload Docs', },
];

const memberLinks = [
    { to: '/member/profile', label: 'My Profile', },
    { to: '/member/earnings', label: 'Earnings', },
];

export default function Sidebar({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const links = user?.role === 'admin' ? adminLinks
        : user?.role === 'agent' ? agentLinks : memberLinks;

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden" onClick={() => setOpen(false)} />
            )}


            <aside className={`fixed md:static z-30 h-full w-64 bg-indigo-900 text-white flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-5 border-b border-indigo-700">
                    <h1 className="text-xl font-bold">FMS Portal</h1>
                    <p className="text-indigo-300 text-sm capitalize">{user?.role} Panel</p>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    {links.map(({ to, label, icon }) => (
                        <Link
                            key={to} to={to}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-5 py-3 text-sm hover:bg-indigo-700 transition-colors
                ${location.pathname === to ? 'bg-indigo-700 border-r-4 border-indigo-300' : ''}`}
                        >
                            <span>{icon}</span>{label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-indigo-700">
                    <p className="text-xs text-indigo-300 mb-1">{user?.name}</p>
                    <p className="text-xs text-indigo-400 mb-3 truncate">{user?.email}</p>
                    <button onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors">
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setOpen(!open)} className="text-2xl text-gray-700">☰</button>
                    <span className="font-semibold text-indigo-900">FMS Portal</span>
                    <div />
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}