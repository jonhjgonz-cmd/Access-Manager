import DriveDocsUploader from '../components/DriveDocsUploader';

export default function KnowledgeVault() {
    const handleFileSelect = (fileInfo) => {
        // Todo: Add file metadata directly to Firestore later
        console.log("Archivo listo para vincular en BD:", fileInfo);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light">
            {/* Top Header & Search Section */}
            <header className="bg-white border-b border-primary/5 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">Biblioteca de Procesos</h2>
                        <p className="text-slate-500 text-sm mt-1">Gestioma y explora los procedimientos operativos estándar.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <DriveDocsUploader onFileSelected={handleFileSelect} />
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input className="w-full pl-10 pr-4 py-2.5 bg-background-light border-none rounded-xl focus:ring-2 focus:ring-primary text-sm placeholder:text-slate-400 outline-none" placeholder="Buscar procesos, títulos o etiquetas..." type="text" />
                    </div>
                    {/* Sorting */}
                    <div className="flex items-center gap-2 min-w-[140px]">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtrar:</span>
                        <button className="flex items-center justify-between w-full px-3 py-2 bg-white border border-primary/10 rounded-lg text-sm font-medium text-slate-700">
                            Más Recientes
                            <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar whitespace-nowrap">
                    <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-white">Todos</button>
                    <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">Inducciones</button>
                    <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">Seguridad</button>
                    <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">Soporte TI</button>
                    <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">RH</button>
                    <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">Normativas</button>
                    <button className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors">Finanzas</button>
                </div>
            </header>

            {/* Scrollable Grid Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* Process Card 1 */}
                    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer">
                        <div className="aspect-video relative bg-slate-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjAw_Dj0CgfRYgvLg8vlb1VahyO3-dn2hw1tOW_ZkHUf2NO6w_yWKCGTJIFKhAu4g44j8pvi8UvdOw2CmX3HOPK3zxJQjEv7HmYYbQT4RhwVaLNTT58Thy56RZX7EWGsHb3n6B7EqNGU-PrjsuZnh6QJkB-xe_4w6GegbM9qbD-z9R4Lv7hYKZLQjsUM-eMXY8pkaM3HuuC73mVSK7uPvVu-w_qEhZVnYh5IRKu3Wj0ARR-1WVqIrwHmaZ0tK5IM6kLGyIv4hwG68" alt="Preview" />
                            <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-600 font-bold uppercase tracking-wider">Seguridad</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-600 font-bold uppercase tracking-wider">RH</span>
                            </div>
                            <h3 className="text-slate-900 font-bold text-base group-hover:text-primary transition-colors">Protocolo de Desvinculación de Usuarios</h3>
                            <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                                Procedimiento de operación estándar para la revocación de acceso a los sistemas internos de la empresa...
                            </p>
                            <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">schedule</span> Modificado: Oct 24, 2023
                                </div>
                                <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded text-primary">
                                    <span className="material-symbols-outlined text-[16px]">forum</span> 12
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Process Card 2 */}
                    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer">
                        <div className="aspect-video relative bg-slate-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/20"></div>
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmEFTXZCx8o2lt-MRjrw61O837xOO7JmlpBXK27afErrmoogiNkuwM9kxYDaIeObZ9s1ie-XbgDJfD-HwSAxE-WgD3Lhe1biO8tQtLGQi0BPCr9xBUdbgNmN_xKK7tBaLP9L95-kS0aV1dxU7UPDYBCJYskjVyXAOwNN7OrF36DQvXaRBReAQue78ToVkH-yuTI-02K3vJTvIumzRmErwlLOMyAJL_IE2FiLqGtyCblHAEwTwRzz1xL-pt_02EFWCD6Wl6H9-l_1g" alt="Preview 2" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-600 font-bold uppercase tracking-wider">Soporte TI</span>
                            </div>
                            <h3 className="text-slate-900 font-bold text-base group-hover:text-primary transition-colors">Redes y Seguridad SOP</h3>
                            <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                                Guía para la mantención de la seguridad íntegra de la red local y los protocolos de reestructuración VPN...
                            </p>
                            <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">schedule</span> Modificado: Oct 20, 2023
                                </div>
                                <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded text-primary">
                                    <span className="material-symbols-outlined text-[16px]">forum</span> 8
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Process Card 3 */}
                    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer">
                        <div className="aspect-video relative bg-slate-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 to-transparent"></div>
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx1Z3cgzyk10OI3em6R9npXwP4QdkjY50gAC8eWVX-q-WVwHu0LT0sV8RgagOAA0Mlh4clr0UzD5KU48wT7Xn2hgjAQOXr07WTf2yF1tRhTZ9-Qwn0PiKsbBVmTkDEmCE5IwDyZzRiLVf41Bls1aS9nlN5ohUeFRJwZtoJDe58gaviKv765Dk99Aq0GD3r0YSl_gvlf8RVRnZv7Ikyi_W6dSKwma9-OvE68u_3Xpkf-MZLrp2y6_1IF6Dk6Nt52odE88-emUtYWjw" alt="Preview 3" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-600 font-bold uppercase tracking-wider">Inducciones</span>
                            </div>
                            <h3 className="text-slate-900 font-bold text-base group-hover:text-primary transition-colors">Inducción General para Nuevos Empleados</h3>
                            <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                                Guía completa para la integración rápida a las políticas de cuentas y configuración...
                            </p>
                            <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">schedule</span> Modificado: Oct 15, 2023
                                </div>
                                <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded text-primary">
                                    <span className="material-symbols-outlined text-[16px]">forum</span> 25
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Process Card 4 */}
                    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer">
                        <div className="aspect-video relative bg-slate-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiXYzkuDJ2PVMZrCkMpEvy3ADE-NY4wm3O2iopyyGMLjIED3E0kfsrlRGHju0yw_S8vnDTqTDLBfOV0MtHhhsMU_fgkmC_O8hY9dAQ9sz8i92eK4b-hi74xKB6vK_FonOmDa-hcI3AZPgewhwENQxiUjjKaTIuirmb1JiFTmgO-rnJ0rzl445U_f-EZf5xQj8WHN-BKEWr8CFWnGGbdCr0OY3X43Ul3zCPDmbxRpWUFZpOVlfIZrde1dCGMm2TnpMFRNFnKwHI0_M" alt="Preview 4" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 text-cyan-600 font-bold uppercase tracking-wider">Nube</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-600 font-bold uppercase tracking-wider">Seguridad</span>
                            </div>
                            <h3 className="text-slate-900 font-bold text-base group-hover:text-primary transition-colors">Manejo de Acceso a la Nube Master</h3>
                            <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                                Pasos obligatorios para manejar los permisos híbridos sobre bases de AWS, GCP y Azure...
                            </p>
                            <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">schedule</span> Modificado: Oct 10, 2023
                                </div>
                                <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded text-primary">
                                    <span className="material-symbols-outlined text-[16px]">forum</span> 5
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
