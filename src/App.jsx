import { Navigate, Route, Routes } from 'react-router'
import AppShell from './components/AppShell.jsx'
import JournalPage from './pages/JournalPage.jsx'
import TodoPage from './pages/TodoPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/journal" replace />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="todo" element={<TodoPage />} />
        <Route path="*" element={<Navigate to="/journal" replace />} />
      </Route>
    </Routes>
  )
}
