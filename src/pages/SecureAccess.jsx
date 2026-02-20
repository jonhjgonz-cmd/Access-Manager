import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useFirestore } from '../hooks/useFirestore';

const seedCredentials = [
    { title: 'Consola AWS', category: 'Infraestructura', icon: 'cloud', user: 'admin@company.aws', env: 'Producción', notes: 'Acceso principal nivel Root. MFA requerido.', pass: 'secure_aws_2023!' },
    { title: 'Cloudflare Admin', category: 'Seguridad', icon: 'security', user: 'dev-ops-team', env: 'Pruebas', notes: 'Manejo DNS y cortafuegos WAF.', pass: 'cf_admin_k3y#pw' },
    { title: 'Stripe Dashboard', category: 'FinOps', icon: 'payments', user: 'finance-readonly', env: 'Corporativa', notes: 'Acceso Lectura para Finanzas.', pass: 'stripe_readonly$99' }
];

const EMPTY_CRED = { title: '', category: '', icon: 'key', user: '', env: '', notes: '', pass: '' };

export default function SecureAccess() {
    const [credentials, setCredentials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCred, setEditingCred] = useState(null); // null = new, obj = editing
    const [formData, setFormData] = useState(EMPTY_CRED);
    const [visiblePass, setVisiblePass] = useState({}); // { [id]: bool }
    const [search, setSearch] = useState('');
    const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('credentials');

    useEffect(() => {
        const load = async () => {
            const docs = await getDocuments();
            if (docs.length === 0) {
                const seeded = await Promise.all(
                    seedCredentials.map(c => addDocument(c).then(id => ({ ...c, id })))
                );
                setCredentials(seeded);
            } else {
                setCredentials(docs);
            }
        };
        load();
    }, []);

    const openNew = () => {
        setEditingCred(null);
        setFormData(EMPTY_CRED);
        setShowModal(true);
    };

    const openEdit = (cred) => {
        setEditingCred(cred);
        setFormData({ title: cred.title, category: cred.category, icon: cred.icon || 'key', user: cred.user, env: cred.env, notes: cred.notes || '', pass: cred.pass });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingCred) {
            // Update existing
            const ok = await updateDocument(editingCred.id, formData);
            if (ok) {
                setCredentials(prev => prev.map(c => c.id === editingCred.id ? { ...c, ...formData } : c));
                toast.success('¡Credencial actualizada!');
                setShowModal(false);
            }
        } else {
            // Add new
            const id = await addDocument({ ...formData, createdAt: new Date().toISOString() });
            if (id) {
                setCredentials(prev => [...prev, { ...formData, id }]);
                toast.success('¡Credencial guardada en la Bóveda!');
                setShowModal(false);
            }
        }
        setFormData(EMPTY_CRED);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta credencial permanentemente?')) return;
        const ok = await deleteDocument(id);
        if (ok) {
            setCredentials(prev => prev.filter(c => c.id !== id));
            toast.success('Credencial eliminada');
        }
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        toast.success(`${type} copiado al portapapeles`);
    };

    const toggleVisibility = (id) => {
        setVisiblePass(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filtered = credentials.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase()) ||
        c.user?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light">
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {editingCred ? 'Editar Acceso' : 'Nuevo Acceso Seguro'}
                        </h3>
                        {[['title', 'Nombre del Servicio'], ['category', 'Categoría'], ['user', 'Usuario/Email'], ['env', 'Entorno']].map(([field, label]) => (
                            <div key={field}>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{label}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    value={formData[field]}
                                    onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Contraseña</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                                value={formData.pass}
                                onChange={e => setFormData(prev => ({ ...prev, pass: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Notas</label>
                            <textarea
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                                rows={2}
                                value={formData.notes}
                                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancelar</button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">
                                {editingCred ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Top Bar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm transition-all outline-none"
                            placeholder="Buscar credenciales, servicios..."
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 ml-4 md:ml-8">
                    <button onClick={openNew} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-primary/20">
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span className="hidden sm:inline">Nuevo Acceso</span>
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <section className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">Bóveda de Accesos</h2>
                    <p className="text-slate-500 text-sm mt-1">Gestiona y comparte credenciales de equipo de forma segura. <strong>{credentials.length}</strong> registros.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-3 flex justify-center p-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        </div>
                    ) : filtered.map(cred => (
                        <div key={cred.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{cred.title}</h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mt-1">
                                            {cred.category}
                                        </span>
                                    </div>
                                    <div className="size-10 bg-slate-50 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">{cred.icon || 'key'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">USUARIO</label>
                                        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                            <code className="text-sm font-mono truncate">{cred.user}</code>
                                            <button onClick={() => handleCopy(cred.user, 'Usuario')} className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">CONTRASEÑA</label>
                                        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                            <span className="text-sm font-mono tracking-widest text-slate-600">
                                                {visiblePass[cred.id] ? cred.pass : '••••••••••••'}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => toggleVisibility(cred.id)} className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-lg">{visiblePass[cred.id] ? 'visibility_off' : 'visibility'}</span>
                                                </button>
                                                <button onClick={() => handleCopy(cred.pass, 'Contraseña')} className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="text-[11px] mb-1"><span className="text-slate-400 font-medium">Entorno:</span><span className="text-slate-700 ml-1">{cred.env}</span></div>
                                </div>

                                {cred.notes && (
                                    <div className="mt-3">
                                        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">NOTAS</label>
                                        <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 italic leading-relaxed">{cred.notes}</div>
                                    </div>
                                )}
                            </div>
                            <div className="px-5 py-3 bg-slate-50 flex justify-end gap-2 rounded-b-xl border-t border-slate-100">
                                <button onClick={() => openEdit(cred)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all" title="Editar">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button onClick={() => handleDelete(cred.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all" title="Eliminar">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Placeholder */}
                    <button onClick={openNew} className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all group">
                        <div className="size-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined">add_circle</span>
                        </div>
                        <p className="font-bold text-sm">Agregar Nuevo Acceso</p>
                        <p className="text-xs mt-1 text-slate-400">Almacena una nueva credencial segura</p>
                    </button>
                </div>
            </section>
        </div>
    );
}
