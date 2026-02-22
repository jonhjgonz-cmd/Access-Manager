import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

import Dashboard from './pages/Dashboard';
import KnowledgeVault from './pages/KnowledgeVault';
import SecureAccess from './pages/SecureAccess';
import TaskEngine from './pages/TaskEngine';
import ScheduleConfig from './pages/ScheduleConfig';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="library" element={<KnowledgeVault />} />
          <Route path="vault" element={<SecureAccess />} />
          <Route path="tasks" element={<TaskEngine />} />
          <Route path="schedule" element={<ScheduleConfig />} />
        </Route>
        {/* Redirigir cualquier ruta desconocida al Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
