import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
    const accessToken = useAuthStore(state => state.accessToken);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loadingCalendar, setLoadingCalendar] = useState(true);

    useEffect(() => {
        if (!accessToken || accessToken === 'dummy_token') {
            setLoadingCalendar(false);
            return;
        }

        const fetchCalendar = async () => {
            try {
                const timeMin = new Date().toISOString();
                const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=3&singleEvents=true&orderBy=startTime`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCalendarEvents(data.items || []);
                } else {
                    console.error("Calendar API Error:", response.status);
                }
            } catch (error) {
                console.error("Error fetching calendar:", error);
            } finally {
                setLoadingCalendar(false);
            }
        };

        fetchCalendar();
    }, [accessToken]);

    const formatTime = (dateString) => {
        if (!dateString) return 'Todo el día';
        return new Date(dateString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatDate = () => {
        return new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="p-4 sm:p-8 space-y-8">
            {/* Stat Widgets */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
                    <div className="size-12 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">task</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Tareas Pendientes</p>
                        <h3 className="text-2xl font-bold text-slate-900">12</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
                    <div className="size-12 shrink-0 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <span className="material-symbols-outlined">account_tree</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Nuevos Procesos</p>
                        <h3 className="text-2xl font-bold text-slate-900">5</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
                    <div className="size-12 shrink-0 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Turnos Activos</p>
                        <h3 className="text-2xl font-bold text-slate-900">8</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
                    <div className="size-12 shrink-0 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                        <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Credenciales Seguras</p>
                        <h3 className="text-2xl font-bold text-slate-900">45</h3>
                    </div>
                </div>
            </section>

            {/* Middle Content */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Notifications Reels Style */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Notificaciones Recientes</h2>
                        <button className="text-sm text-primary font-semibold hover:underline">Ver Todas</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary/40 transition-all flex gap-4 cursor-pointer">
                            <div className="size-10 bg-slate-100 rounded-full shrink-0 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm text-slate-900">Nueva Petición de Acceso - John Doe</h4>
                                    <span className="text-xs text-slate-400">Hace 10m</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">El Servidor Administrador solicitó permisos temporales estructurados para la migración de DB en Producción.</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary/40 transition-all flex gap-4 cursor-pointer">
                            <div className="size-10 bg-green-50 rounded-full shrink-0 flex items-center justify-center text-green-600">
                                <span className="material-symbols-outlined">security_update_good</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm text-slate-900">Parche de Seguridad Aplicado</h4>
                                    <span className="text-xs text-slate-400">Hace 2h</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Parche de vulnerabilidad crítico v2.4.1 desplegado exitosamente a la red de infraestructura central.</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary/40 transition-all flex gap-4 cursor-pointer">
                            <div className="size-10 bg-red-50 rounded-full shrink-0 flex items-center justify-center text-red-600">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm text-slate-900">Intento de Inicio de Sesión Fallido</h4>
                                    <span className="text-xs text-slate-400">Oct 24, 2023</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Detección de múltiples accesos erróneos para la cuenta: 'Service_Worker_09'.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Agenda de Hoy</h2>
                        <span className="text-xs font-medium text-slate-400 px-2 py-1 bg-slate-100 rounded-lg">{formatDate()}</span>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        {loadingCalendar ? (
                            <div className="p-8 flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : calendarEvents.length > 0 ? (
                            calendarEvents.map((ev, index) => {
                                const isFirst = index === 0;
                                const isWarning = index === 2;
                                return (
                                    <div key={ev.id} className="p-4 border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                                        <div className={`w-1 h-10 rounded-full shrink-0 ${isFirst ? 'bg-primary' : isWarning ? 'bg-amber-400' : 'bg-slate-300'}`}></div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className={`text-xs font-bold ${isFirst ? 'text-primary' : isWarning ? 'text-amber-600' : 'text-slate-500'}`}>
                                                {formatTime(ev.start?.dateTime)} - {formatTime(ev.end?.dateTime)}
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900 truncate">{ev.summary}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 truncate">{ev.location || 'N/A'}</p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="p-6 text-center">
                                <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">event_busy</span>
                                <p className="text-sm text-slate-500">No hay reuniones hoy.</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-lg transition-colors">
                        Manejar Calendario
                    </button>
                </div>
            </section>

            {/* Recent Tasks */}
            <section className="space-y-4 pb-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Tareas Recientes</h2>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">Nombre de Tarea</th>
                                <th className="px-6 py-4">Asignado a</th>
                                <th className="px-6 py-4">Prioridad</th>
                                <th className="px-6 py-4">Progreso</th>
                                <th className="px-6 py-4 text-right">Estatus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">Migración de Base de Datos</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 shrink-0 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUXllrDar7FWN6Z8CEQk50TdxfFQoWj-tcdUq-aLKaRYnRKCeD0QJgj8L5sI9wPRG0mYOkgrNiKz19bp4snyZKOUTpeg_yUEJtJF3R6KJU3K_v0g67GAXQZdkxj4MdA0fiBmkHu93R5M6mweLu83BEsk2dt-Q6QqbIyiqrU6IU1A1sLU8VFd1-R-mfBvblHh_P3DXKvUB5gk55n8GZlScVm6W_fADwQ7Ei6awntgn574eCuJ-suTLl6b-u5OtAUA5pBHHhT_i9Z7U')" }}></div>
                                        <span className="text-slate-600">John D.</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold">ALTA</span>
                                </td>
                                <td className="px-6 py-4 w-64">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">70% Completada</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-blue-600 font-semibold">En Curso</span>
                                </td>
                            </tr>

                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">Auditoría de Credenciales</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 shrink-0 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiALE0A1DFpE_m6g2MV8-4Q3rxF0MChuc8dvtWWWYP_hDjldsjeL8ywihlNdP8Q21qChc8vTH9aszFPIaXTbXpG0ESwuFriYB64zbaMbHnmz7HjnaGFEjxsqzqzdH8h3c9jDs8q7wjr-iRFIvfnhwtUEEFCGbOi5__zv9OzCuZhgf4zQBwdx0hzwwMq4HOg5xyf3cJDeWZrHSw-_yItBGEd4D73hjXSBLAmHadhM9uw2DF8uqwWV5VPaxwwUZZz1dC4zAn0JJ07Qs')" }}></div>
                                        <span className="text-slate-600">Sarah M.</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold">MEDIA</span>
                                </td>
                                <td className="px-6 py-4 w-64">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">30% Completado</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-blue-600 font-semibold">En Curso</span>
                                </td>
                            </tr>

                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">Desvinculación de Usuarios</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 shrink-0 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuIg4L6YQAw-b3IYDV-TJ_mOmn5vq3eP_CKsEAncd4SqkvqzIS5e0HhehQuedUPHJAkXKezwhw-5IqhfepyVIfBQ_kFtyD9Th8suxZOmksAXwFHBHQUNVPnTLGUskUW4MVVvX9axjgKVZPuG6J0fAtBszDRCibf2o2EP8sPh-suJXhcqVl-kQrOheLiQnW3f5Ozoo4aByrEMaSRdkUn21FWHWtJTwxlmXenE4RY1KdjlLrZbR4-00SzTkCEHTTf2Jfcx1CHZIFIFE')" }}></div>
                                        <span className="text-slate-600">Automatizada</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">BAJA</span>
                                </td>
                                <td className="px-6 py-4 w-64">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">100% Completada</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-green-600 font-semibold">Finalizada</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
