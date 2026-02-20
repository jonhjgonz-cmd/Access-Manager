import { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import toast from 'react-hot-toast';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const defaultSchedule = () => DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: {
        in: ['Sábado', 'Domingo'].includes(day) ? '' : '08:00',
        out: ['Sábado', 'Domingo'].includes(day) ? '' : '17:00',
        active: !['Sábado', 'Domingo'].includes(day)
    }
}), {});

const seedEmployees = [
    { name: 'Alex Rivera', role: 'Security Lead', initials: 'AR', schedule: defaultSchedule() },
    { name: 'Sarah Chen', role: 'Oficial de Planta', initials: 'SC', schedule: defaultSchedule() },
    { name: 'Marcus Wright', role: 'Recursos Humanos', initials: 'MW', schedule: defaultSchedule() },
];

const EMPTY_EMP = { name: '', role: '', initials: '' };

export default function ScheduleConfig() {
    const [employees, setEmployees] = useState([]);
    const [selected, setSelected] = useState(null);
    const [editSchedule, setEditSchedule] = useState(defaultSchedule());
    const [showModal, setShowModal] = useState(false);
    const [formEmp, setFormEmp] = useState(EMPTY_EMP);
    const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('schedules');

    useEffect(() => {
        const load = async () => {
            const docs = await getDocuments();
            if (docs.length === 0) {
                const seeded = await Promise.all(seedEmployees.map(e => addDocument(e).then(id => ({ ...e, id }))));
                setEmployees(seeded);
                setSelected(seeded[0]);
                setEditSchedule(seeded[0].schedule);
            } else {
                setEmployees(docs);
                setSelected(docs[0]);
                setEditSchedule(docs[0].schedule || defaultSchedule());
            }
        };
        load();
    }, []);

    const handleSelect = (emp) => {
        setSelected(emp);
        setEditSchedule(emp.schedule || defaultSchedule());
    };

    const handleTimeChange = (day, field, value) =>
        setEditSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

    const handleToggleDay = (day, checked) =>
        setEditSchedule(prev => ({ ...prev, [day]: { ...prev[day], active: checked } }));

    const handleSave = async () => {
        if (!selected) return;
        const ok = await updateDocument(selected.id, { schedule: editSchedule });
        if (ok) {
            setEmployees(prev => prev.map(e => e.id === selected.id ? { ...e, schedule: editSchedule } : e));
            setSelected(prev => ({ ...prev, schedule: editSchedule }));
            toast.success(`¡Horario de ${selected.name} guardado!`);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        if (!formEmp.name.trim()) return;
        const initials = formEmp.initials.trim() || formEmp.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const empData = { ...formEmp, initials, schedule: defaultSchedule() };
        const id = await addDocument(empData);
        if (id) {
            const newEmp = { ...empData, id };
            setEmployees(prev => [...prev, newEmp]);
            toast.success(`${formEmp.name} añadido al equipo`);
            setShowModal(false);
            setFormEmp(EMPTY_EMP);
        }
    };

    const handleDeleteEmployee = async (emp) => {
        if (!window.confirm(`¿Eliminar a ${emp.name} del sistema?`)) return;
        const ok = await deleteDocument(emp.id);
        if (ok) {
            const remaining = employees.filter(e => e.id !== emp.id);
            setEmployees(remaining);
            if (selected?.id === emp.id) {
                setSelected(remaining[0] || null);
                setEditSchedule(remaining[0]?.schedule || defaultSchedule());
            }
            toast.success(`${emp.name} eliminado`);
        }
    };

    const calcHours = (sched) => {
        let total = 0;
        DAYS.forEach(day => {
            const row = (sched || editSchedule)[day];
            if (row?.active && row.in && row.out) {
                const [ih, im] = row.in.split(':').map(Number);
                const [oh, om] = row.out.split(':').map(Number);
                total += (oh + om / 60) - (ih + im / 60);
            }
        });
        return total.toFixed(1);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleAddEmployee} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Nuevo Empleado</h3>
                        {[['name', 'Nombre completo'], ['role', 'Cargo / Rol'], ['initials', 'Iniciales (opcional, ej: AR)']].map(([field, label]) => (
                            <div key={field}>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{label}</label>
                                <input
                                    type="text"
                                    required={field !== 'initials'}
                                    maxLength={field === 'initials' ? 2 : 100}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    value={formEmp[field]}
                                    onChange={e => setFormEmp(p => ({ ...p, [field]: e.target.value }))}
                                />
                            </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancelar</button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">Añadir</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
                <h2 className="text-lg font-bold">Roles y Horarios</h2>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-6">

                {/* Employee List */}
                <section className="w-full lg:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0 lg:h-full">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                        <div>
                            <h3 className="font-bold text-base">Personal Interno</h3>
                            <p className="text-xs text-slate-500">{employees.length} empleados registrados</p>
                        </div>
                        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition-all">
                            <span className="material-symbols-outlined text-sm">person_add</span>
                            <span className="hidden sm:inline">Nuevo</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : employees.map(emp => (
                            <div
                                key={emp.id}
                                onClick={() => handleSelect(emp)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all group relative ${selected?.id === emp.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                                        {emp.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{emp.name}</h4>
                                        <p className="text-xs text-slate-500 truncate">{emp.role}</p>
                                    </div>
                                    {selected?.id === emp.id && (
                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">Activo</span>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-slate-400">schedule</span>
                                        {calcHours(emp.schedule)} hrs/semana
                                    </span>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDeleteEmployee(emp); }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-500 rounded"
                                        title="Eliminar empleado"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {employees.length === 0 && !loading && (
                            <div className="text-center p-8 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 block">group</span>
                                <p className="text-sm">No hay empleados. Añade el primero.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Schedule Matrix */}
                <section className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:h-full">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 shrink-0">
                        <div>
                            <h3 className="font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_calendar</span>
                                Matriz de Horarios
                            </h3>
                            <p className="text-xs text-slate-500">
                                Editando: <span className="font-bold text-primary">{selected?.name || 'Selecciona un empleado'}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => selected && setEditSchedule(selected.schedule || defaultSchedule())}
                                className="hidden sm:inline px-4 py-2 border border-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!selected}
                                className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Guardar Matriz
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto flex-1 custom-scrollbar">
                        <table className="w-full border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left bg-slate-50 border-b border-slate-200 w-28 border-r">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Día</span>
                                    </th>
                                    <th className="p-4 text-left bg-slate-50 border-b border-slate-200">
                                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><span className="material-symbols-outlined text-sm text-green-600">login</span>Entrada</p>
                                    </th>
                                    <th className="p-4 text-left bg-slate-50 border-b border-slate-200">
                                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><span className="material-symbols-outlined text-sm text-red-600">logout</span>Salida</p>
                                    </th>
                                    <th className="p-4 text-center bg-slate-50 border-b border-slate-200 w-20">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Estado</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {DAYS.map(day => {
                                    const row = editSchedule[day] || { in: '', out: '', active: false };
                                    return (
                                        <tr key={day} className={`border-b border-slate-100 transition-colors ${row.active ? 'hover:bg-slate-50/50' : 'bg-slate-50/30'}`}>
                                            <td className="p-4 border-r border-slate-100">
                                                <span className={`font-bold text-sm ${row.active ? 'text-slate-800' : 'text-slate-400'}`}>{day}</span>
                                            </td>
                                            <td className="p-4">
                                                <input type="time" value={row.in} disabled={!row.active || !selected}
                                                    onChange={e => handleTimeChange(day, 'in', e.target.value)}
                                                    className={`p-2 rounded-lg border text-sm w-32 outline-none transition-colors ${row.active ? 'border-slate-200 bg-white font-medium focus:ring-2 focus:ring-primary/40' : 'border-transparent bg-transparent text-slate-300'}`} />
                                            </td>
                                            <td className="p-4">
                                                <input type="time" value={row.out} disabled={!row.active || !selected}
                                                    onChange={e => handleTimeChange(day, 'out', e.target.value)}
                                                    className={`p-2 rounded-lg border text-sm w-32 outline-none transition-colors ${row.active ? 'border-slate-200 bg-white font-medium focus:ring-2 focus:ring-primary/40' : 'border-transparent bg-transparent text-slate-300'}`} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={row.active} disabled={!selected}
                                                        onChange={e => handleToggleDay(day, e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
                            <span className="material-symbols-outlined text-primary text-base">functions</span>
                            Horas calculadas: <span className="font-bold text-slate-900 ml-1">{calcHours(editSchedule)} hrs</span>
                        </div>
                        <span className="text-xs text-slate-400">Semana base</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
