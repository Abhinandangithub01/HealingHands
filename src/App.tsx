import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Landing from './pages/Landing'
import Authentication from './pages/Authentication'
import Profile from './pages/Profile'
import SimpleChat from './pages/SimpleChat'
import FinancialHelp from './pages/FinancialHelp'
import Dashboard from './pages/Dashboard'
import PrivacyDashboard from './pages/PrivacyDashboard'
import UserSettings from './pages/UserSettings'
import GroupChat from './pages/GroupChat'
import CompetitionCompliance from './pages/CompetitionCompliance'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<SimpleChat />} />
          <Route path="/chat/:groupId" element={<GroupChat />} />
          <Route path="/financial-help" element={<FinancialHelp />} />
          <Route path="/competition" element={<CompetitionCompliance />} />
          <Route path="/privacy" element={<PrivacyDashboard />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
