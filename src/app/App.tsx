import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { ToastProvider } from './components/shared/ToastContext';
import { SimulationProvider } from './simulation/SimulationContext';
import { TourProvider } from './contexts/TourContext';
import GlobalTourOverlay from './components/worker/TourOverlay';
import WorkerLogin from './components/worker/WorkerLogin';
import WorkerOnboarding from './components/worker/WorkerOnboarding';
import WorkerHome from './components/worker/WorkerHome';
import WorkerWallet from './components/worker/WorkerWallet';
import WorkerInsurance from './components/worker/WorkerInsurance';
import WorkerClaimForm from './components/worker/WorkerClaimForm';
import WorkerLoan from './components/worker/WorkerLoan';
import WorkerLoanApplication from './components/worker/WorkerLoanApplication';
import WorkerProfile from './components/worker/WorkerProfile';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminWorkers from './components/admin/AdminWorkers';
import AdminCompliance from './components/admin/AdminCompliance';
import AdminTestHarness from './components/admin/AdminTestHarness';
import PA_Dashboard from './components/platform-admin/PA_Dashboard';
import PA_RegisterWorker from './components/platform-admin/PA_RegisterWorker';
import PA_WorkerSearch from './components/platform-admin/PA_WorkerSearch';
import PA_Compliance from './components/platform-admin/PA_Compliance';
import SA_Dashboard from './components/super-admin/SA_Dashboard';
import SA_Platforms from './components/super-admin/SA_Platforms';
import SA_Workers from './components/super-admin/SA_Workers';
import SA_Financials from './components/super-admin/SA_Financials';
import SA_Configuration from './components/super-admin/SA_Configuration';
import SA_AuditLog from './components/super-admin/SA_AuditLog';

export default function App() {
  return (
    <ToastProvider>
      <SimulationProvider>
        <TourProvider>
        <HashRouter>
          <GlobalTourOverlay />
          <Routes>
            {/* Default route - redirect to worker login */}
            <Route path="/" element={<Navigate to="/worker/login" replace />} />

            {/* Worker Portal Routes (Mobile) */}
            <Route path="/worker/login" element={<WorkerLogin />} />
            <Route path="/worker/onboarding" element={<WorkerOnboarding />} />
            <Route path="/worker/home" element={<WorkerHome />} />
            <Route path="/worker/wallet" element={<WorkerWallet />} />
            <Route path="/worker/insurance" element={<WorkerInsurance />} />
            <Route path="/worker/claim" element={<WorkerClaimForm />} />
            <Route path="/worker/loan" element={<WorkerLoan />} />
            <Route path="/worker/loan-apply" element={<WorkerLoanApplication />} />
            <Route path="/worker/profile" element={<WorkerProfile />} />

            {/* Admin Panel Routes (Desktop) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/workers" element={<AdminWorkers />} />
            <Route path="/admin/compliance" element={<AdminCompliance />} />
            <Route path="/admin/test-harness" element={<AdminTestHarness />} />

            {/* Platform Admin Routes */}
            <Route path="/platform-admin/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/platform-admin/dashboard" element={<PA_Dashboard />} />
            <Route path="/platform-admin/register" element={<PA_RegisterWorker />} />
            <Route path="/platform-admin/search" element={<PA_WorkerSearch />} />
            <Route path="/platform-admin/compliance" element={<PA_Compliance />} />

            {/* Super Admin Routes */}
            <Route path="/super-admin/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/super-admin/dashboard" element={<SA_Dashboard />} />
            <Route path="/super-admin/platforms" element={<SA_Platforms />} />
            <Route path="/super-admin/workers" element={<SA_Workers />} />
            <Route path="/super-admin/financials" element={<SA_Financials />} />
            <Route path="/super-admin/configuration" element={<SA_Configuration />} />
            <Route path="/super-admin/audit" element={<SA_AuditLog />} />
            {/* /super-admin/harness removed — inline controls replace the test harness */}
          </Routes>
        </HashRouter>
        </TourProvider>
      </SimulationProvider>
    </ToastProvider>
  );
}
