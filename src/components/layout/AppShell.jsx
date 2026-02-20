import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const navItems = [
    { path: '/', icon: 'dashboard', label: 'Panel de Control' },
    { path: '/schedule', icon: 'calendar_today', label: 'Roles y Horarios' },
    { path: '/library', icon: 'menu_book', label: 'Base de Conocimientos' },
    { path: '/vault', icon: 'lock', label: 'Bóveda de Accesos' },
    { path: '/tasks', icon: 'check_circle', label: 'Motor de Tareas' },
];

export default function AppShell({ onLogout }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light font-display text-slate-900">
            <Toaster position="bottom-right" toastOptions={{
                className: '',
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }} />
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-5 flex flex-col items-center justify-center min-h-[5rem] overflow-hidden whitespace-nowrap cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? (
                        <div className="flex flex-col items-center animate-in fade-in">
                            <img src="/clx-logo.png" alt="CLX Logo" className="h-9 object-contain w-auto mb-2" />
                            <span className="text-[11px] font-black tracking-widest text-slate-800 uppercase">Access Manager</span>
                        </div>
                    ) : (
                        <div className="size-10 shrink-0 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
                            <span className="material-symbols-outlined">shield_person</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${isActive ? 'sidebar-item-active' : 'text-slate-600 hover:bg-slate-50'}`}
                            title={!isSidebarOpen ? item.label : undefined}
                        >
                            <span className="material-symbols-outlined text-[22px] shrink-0">{item.icon}</span>
                            {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 overflow-hidden whitespace-nowrap">
                    <div className="flex items-center gap-3 p-2">
                        <div className="size-8 shrink-0 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqPbEGFsfjQASnayjPBGzOP7OKxSFtAD93h6d8MDZ82LVgdTfdBXO0N0kaKk8eLD2MsYVUl7FLnxiAh3wgQRldY2z6SQfrfgkGaEwMSlakY5Aoy1b_FKxmONRI_RFUj7rYPWxLOOoGG6fP_dci7h6etlpcrTJIdLQHRxMcN3mxeJUg5rSqiuvmpvHLPdVoEi1PKjipROauGyYIL35oLxu7mrHxBzNKDhgX7swBtWbE5CWwAIsGzF45TH24NOMHK58DCoa7jj4ot7M')" }}></div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0 flex items-center justify-between">
                                <div className="min-w-0 pr-2">
                                    <p className="text-sm font-medium truncate">J. Gonzalez</p>
                                    <p className="text-xs text-slate-500 truncate">Security Lead</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-sm" title="Administrador">manage_accounts</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shrink-0">
                    <div className="w-full max-w-md relative hidden sm:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none" placeholder="Buscar sistemas, cuentas o usuarios..." type="text" />
                    </div>

                    {/* Mobile search toggle */}
                    <div className="sm:hidden relative">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span className="hidden sm:inline">Nueva Solicitud</span>
                        </button>
                    </div>
                </header>

                {/* Dynamic Route Content */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
