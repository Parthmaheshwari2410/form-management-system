import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/AdminDashboard';
import AddAgent from './pages/admin/AddAgent';
import AddMemberAdmin from './pages/admin/AddMember';
import AgentList from './pages/admin/AgentList';
import MemberList from './pages/admin/MemberList';
import AgentDashboard from './pages/agent/AgentDashboard';
import AddMemberAgent from './pages/agent/AddMember';
import MyMembers from './pages/agent/MyMembers';
import UploadDocs from './pages/agent/UploadDocs';
import MemberProfile from './pages/member/MemberProfile';
import Earnings from './pages/member/Earnings';

const Layout = ({ children, roles }) => (
  <ProtectedRoute roles={roles}>
    <Sidebar>{children}</Sidebar>
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/admin/dashboard" element={<Layout roles={['admin']}><AdminDashboard /></Layout>} />
          <Route path="/admin/add-agent" element={<Layout roles={['admin']}><AddAgent /></Layout>} />
          <Route path="/admin/add-member" element={<Layout roles={['admin']}><AddMemberAdmin /></Layout>} />
          <Route path="/admin/agents" element={<Layout roles={['admin']}><AgentList /></Layout>} />
          <Route path="/admin/members" element={<Layout roles={['admin']}><MemberList /></Layout>} />
          <Route path="/agent/dashboard" element={<Layout roles={['agent']}><AgentDashboard /></Layout>} />
          <Route path="/agent/add-member" element={<Layout roles={['agent']}><AddMemberAgent /></Layout>} />
          <Route path="/agent/my-members" element={<Layout roles={['agent']}><MyMembers /></Layout>} />
          <Route path="/agent/upload-docs" element={<Layout roles={['agent']}><UploadDocs /></Layout>} />
          <Route path="/member/profile" element={<Layout roles={['member']}><MemberProfile /></Layout>} />
          <Route path="/member/earnings" element={<Layout roles={['member']}><Earnings /></Layout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App