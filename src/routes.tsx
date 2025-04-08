import { Navigate, useRoutes } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ProtectedRoute, UnProtectedRoute } from './components/auth/AuthRequired';
import AdminLayout from './components/layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import ProtocolSetupPage from './pages/admin/ProtocolSetupPage';
import ProtocolInventoryPage from './pages/admin/ProtocolInventoryPage';
import DistributeDevReward from './pages/admin/DistributeDevReward';
import MainLayout from './components/layouts/MainLayout';
import ValidStakingPage from './pages/investor/ValidStakingPage';
import ProtocolEarningsPage from './pages/admin/ProtocolEarningsPage';
import StakingUnstaking from './components/investor/StakingUnstaking';
import STXDCValuationPage from './pages/admin/STXDCValuationPage';
import ChangePassword from './components/auth/ChangePassword';

const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: (
        <UnProtectedRoute>
          <MainLayout />
        </UnProtectedRoute>
      ),
      children: [{ path: '/', element: <StakingUnstaking /> }]
    },
    {
      path: '/login',
      element: (
        <UnProtectedRoute>
          <AdminLogin />
        </UnProtectedRoute>
      )
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/admin', element: <AdminDashboard /> },
        { path: '/admin/protocol-setup', element: <ProtocolSetupPage /> },
        { path: '/admin/protocol-inventory', element: <ProtocolInventoryPage /> },
        { path: '/admin/distribute-dev-reward', element: <DistributeDevReward /> },
        {
          path: '/admin/protocol-earnings',
          element: <ProtocolEarningsPage />
        },
        {
          path: '/admin/valid-staking',
          element: <ValidStakingPage />
        },
        {
          path: '/admin/stxdc-valuation',
          element: <STXDCValuationPage />
        },
        {
          path: '/admin/change-password',
          element: <ChangePassword />
        },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" /> }
  ]);
};

export default Router;
