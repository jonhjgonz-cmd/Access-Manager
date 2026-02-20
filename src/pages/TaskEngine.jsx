import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFirestore } from '../hooks/useFirestore';
import toast from 'react-hot-toast';

const seedTasks = [
    { status: 'todo', priority: 'Alta Prioridad', priorityColor: 'red', title: 'Revisión de Permisos Administrativos', progress: 0, date: 'Oct 12', comments: 4, code: 'AM-101' },
    { status: 'todo', priority: 'Media', priorityColor: 'yellow', title: 'Actualizar LLaves SSH (Staging)', progress: 15, date: 'Oct 14', comments: 0, code: 'AM-102' },
    { status: 'in-progress', priority: 'Alta Prioridad', priorityColor: 'red', title: 'Migrar Base de Datos a v2', progress: 65, date: 'Oct 11', comments: 18, code: 'AM-098' },
    { status: 'done', priority: 'Completada', priorityColor: 'slate', title: 'Configuración 2FA Equipo Soporte', progress: 100, date: 'Oct 05', comments: 0, code: 'AM-095', done: true }
];

const COLUMNS = [
    { id: 'todo', title: 'Pendientes', badgeColor: 'slate' },
    { id: 'in-progress', title: 'En Curso', badgeColor: 'blue' },
    { id: 'done', title: 'Hechas', badgeColor: 'green' }
];

const PRIORITIES = ['Alta Prioridad', 'Media', 'Baja', 'Completada'];
const EMPTY_TASK = { title: '', status: 'todo', priority: 'Media', priorityColor: 'yellow', progress: 0, date: '', comments: 0, code: '', done: false };

// --- Sortable Item ---
function SortableTaskItem({ task, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { status: task.status } });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

    return (
        <div ref={setNodeRef} style={style} className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group ${task.done ? 'opacity-80' : ''}`}>
            {/* Drag handle area */}
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-start mb-2 select-none pointer-events-none">
                    <span className={`bg-${task.priorityColor}-100 text-${task.priorityColor}-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded`}>
                        {task.priority}
                    </span>
                </div>
                <h4 className={`text-sm font-bold text-slate-900 mb-3 select-none pointer-events-none ${task.done ? 'line-through text-slate-500' : ''}`}>{task.title}</h4>

                {task.status === 'in-progress' && (
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1 pointer-events-none select-none">
                        <span>PROGRESO</span><span>{task.progress}%</span>
                    </div>
                )}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 pointer-events-none">
                    <div className={`${task.done ? 'bg-green-500' : 'bg-primary'} h-full rounded-full`} style={{ width: `${task.progress}%` }}></div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 pointer-events-none select-none">
                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                        {task.done ? (
                            <span className="flex items-center gap-1 text-green-600"><span className="material-symbols-outlined text-sm">check_circle</span>Finalizado</span>
                        ) : (
                            <>
                                {task.date && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{task.date}</span>}
                                {task.comments > 0 && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">chat_bubble</span>{task.comments}</span>}
                            </>
                        )}
                    </div>
                    {task.code && <span className="text-[10px] font-bold text-slate-400 uppercase">{task.code}</span>}
                </div>
            </div>

            {/* Delete button — visible on hover */}
            <button
                onClick={() => onDelete(task.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md"
                title="Eliminar tarea"
            >
                <span className="material-symbols-outlined text-base">delete</span>
            </button>
        </div>
    );
}

// --- Checklist ---
function ProjectChecklist() {
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Definir arquitectura del sistema en React + Vite', done: true },
        { id: 2, text: 'Inyectar Diseño Base y Sistema de Layout', done: true },
        { id: 3, text: 'Implementar Kanban con Drag and Drop (@dnd-kit)', done: true },
        { id: 4, text: 'Conectar Firestore como backend central', done: true },
        { id: 5, text: 'Integrar Google Drive API para archivos', done: false },
        { id: 6, text: 'Despliegue en producción con Firebase Hosting', done: false }
    ]);
    const [newItem, setNewItem] = useState('');

    const toggle = (id) => setChecklist(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
    const addItem = (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;
        setChecklist(prev => [...prev, { id: Date.now(), text: newItem.trim(), done: false }]);
        setNewItem('');
    };
    const removeItem = (id) => setChecklist(prev => prev.filter(i => i.id !== id));

    const completed = checklist.filter(i => i.done).length;
    const total = checklist.length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    const R = 60, circ = 2 * Math.PI * R;

    return (
        <div className="max-w-4xl mx-auto w-full p-4 md:p-8 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex flex-col items-center shrink-0">
                    <div className="relative size-48 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                            <circle cx="70" cy="70" r={R} className="stroke-slate-100" strokeWidth="12" fill="none" />
                            <circle cx="70" cy="70" r={R} className="stroke-primary transition-all duration-700" strokeWidth="12" fill="none"
                                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-900">{pct}<span className="text-2xl">%</span></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completitud</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-lg mt-4 text-slate-800">Progreso del Milestone</h3>
                    <p className="text-slate-500 text-sm mt-1">{completed} de {total} completadas</p>
                </div>

                <div className="flex-1 w-full">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                        <span className="material-symbols-outlined text-primary">task_alt</span>
                        Checklist Principal
                    </h3>
                    <form onSubmit={addItem} className="flex gap-2 mb-4">
                        <input
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            placeholder="Añadir ítem al checklist..."
                            value={newItem}
                            onChange={e => setNewItem(e.target.value)}
                        />
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                            Añadir
                        </button>
                    </form>
                    <div className="space-y-2">
                        {checklist.map(item => (
                            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all group ${item.done ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100 hover:border-primary/30'}`}>
                                <button onClick={() => toggle(item.id)}
                                    className={`size-5 rounded shrink-0 border-2 flex items-center justify-center transition-all ${item.done ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                                    {item.done && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                </button>
                                <span className={`flex-1 text-sm font-medium ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                                <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---
export default function TaskEngine() {
    const [tasks, setTasks] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [viewMode, setViewMode] = useState('kanban');
    const [showModal, setShowModal] = useState(false);
    const [formTask, setFormTask] = useState(EMPTY_TASK);
    const { getDocuments, addDocument, updateDocument, deleteDocument, loading } = useFirestore('tasks');

    useEffect(() => {
        const load = async () => {
            const docs = await getDocuments();
            if (docs.length === 0) {
                const seeded = await Promise.all(seedTasks.map(t => addDocument(t).then(id => ({ ...t, id }))));
                setTasks(seeded);
                toast.success('¡Tablero inicializado con tareas de ejemplo!');
            } else {
                setTasks(docs);
            }
        };
        load();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleAddTask = async (e) => {
        e.preventDefault();
        const priorityColors = { 'Alta Prioridad': 'red', 'Media': 'yellow', 'Baja': 'slate', 'Completada': 'green' };
        const taskData = {
            ...formTask,
            priorityColor: priorityColors[formTask.priority] || 'slate',
            done: formTask.status === 'done',
            progress: formTask.status === 'done' ? 100 : formTask.status === 'in-progress' ? 20 : 0,
            date: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
            code: `AM-${Date.now().toString().slice(-4)}`
        };
        const id = await addDocument(taskData);
        if (id) {
            setTasks(prev => [...prev, { ...taskData, id }]);
            toast.success('¡Tarea añadida al tablero!');
            setShowModal(false);
            setFormTask(EMPTY_TASK);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('¿Eliminar esta tarea?')) return;
        const ok = await deleteDocument(taskId);
        if (ok) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
            toast.success('Tarea eliminada');
        }
    };

    const handleDragStart = (event) => setActiveId(event.active.id);

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const isOverTask = over.data.current?.sortable;
        const overColumnId = isOverTask ? over.data.current.sortable.containerId : over.id;

        setTasks(prev => {
            const activeIndex = prev.findIndex(t => t.id === active.id);
            const overIndex = prev.findIndex(t => t.id === over.id);
            if (activeIndex < 0) return prev;

            const updated = [...prev];
            const task = { ...updated[activeIndex] };

            if (task.status === overColumnId && isOverTask) {
                updated.splice(activeIndex, 1);
                updated.splice(overIndex, 0, task);
                return updated;
            }

            task.status = overColumnId;
            task.done = overColumnId === 'done';
            task.progress = overColumnId === 'done' ? 100 : overColumnId === 'todo' ? 0 : Math.max(task.progress, 10);

            updated.splice(activeIndex, 1);
            isOverTask ? updated.splice(overIndex, 0, task) : updated.push(task);
            return updated;
        });
    };

    const handleDragEnd = (event) => {
        const { active } = event;
        setActiveId(null);
        const moved = tasks.find(t => t.id === active.id);
        if (moved) updateDocument(moved.id, { status: moved.status, done: moved.done, progress: moved.progress });
    };

    const activeTask = tasks.find(t => t.id === activeId);

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
            {/* Add Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleAddTask} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Nueva Tarea</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Título</label>
                            <input required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                value={formTask.title} onChange={e => setFormTask(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Prioridad</label>
                                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    value={formTask.priority} onChange={e => setFormTask(p => ({ ...p, priority: e.target.value }))}>
                                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Columna</label>
                                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    value={formTask.status} onChange={e => setFormTask(p => ({ ...p, status: e.target.value }))}>
                                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancelar</button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">Crear Tarea</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white border-b border-slate-200 shrink-0">
                <h2 className="text-xl font-bold text-slate-900">Mesa de Trabajo</h2>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                        <button onClick={() => setViewMode('kanban')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>
                            <span className="material-symbols-outlined text-lg">view_week</span>Kanban
                        </button>
                        <button onClick={() => setViewMode('checklist')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${viewMode === 'checklist' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>
                            <span className="material-symbols-outlined text-lg">checklist</span>Checklist
                        </button>
                    </div>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span className="hidden sm:inline">Nueva Tarea</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            {viewMode === 'checklist' ? <ProjectChecklist /> : (
                <div className="flex-1 overflow-x-auto p-4 md:p-6">
                    {loading ? (
                        <div className="flex justify-center p-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                            <div className="flex gap-6 h-full items-start">
                                {COLUMNS.map(col => {
                                    const colTasks = tasks.filter(t => t.status === col.id);
                                    return (
                                        <div key={col.id} className="w-[300px] sm:w-[320px] flex flex-col bg-slate-100/60 rounded-xl p-4 shrink-0">
                                            <div className="flex items-center justify-between mb-4 px-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-800">{col.title}</h3>
                                                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{colTasks.length}</span>
                                                </div>
                                                <button onClick={() => { setFormTask(p => ({ ...p, status: col.id })); setShowModal(true); }}
                                                    className="text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg p-1 transition-colors" title={`Añadir a ${col.title}`}>
                                                    <span className="material-symbols-outlined">add</span>
                                                </button>
                                            </div>
                                            <SortableContext id={col.id} items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                                <div className="flex flex-col gap-3 min-h-[80px] overflow-y-auto custom-scrollbar pb-2">
                                                    {colTasks.map(task => (
                                                        <SortableTaskItem key={task.id} task={task} onDelete={handleDelete} />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </div>
                                    );
                                })}
                            </div>
                            <DragOverlay>
                                {activeTask && (
                                    <div className="bg-white p-4 rounded-lg shadow-xl border border-primary/40 rotate-2 scale-105 opacity-90 w-[300px]">
                                        <span className={`bg-${activeTask.priorityColor}-100 text-${activeTask.priorityColor}-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded`}>{activeTask.priority}</span>
                                        <h4 className="text-sm font-bold text-slate-900 mt-2">{activeTask.title}</h4>
                                    </div>
                                )}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            )}
        </div>
    );
}
