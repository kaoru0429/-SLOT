
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Layout from './components/Layout';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import CreateOrder from './pages/seller/CreateOrder';
import OrderList from './pages/seller/OrderList';
import OrderTracking from './pages/seller/OrderTracking';
import Documents from './pages/seller/Documents';
import Billing from './pages/seller/Billing';

// Operations Pages
import OperationsDashboard from './pages/operations/OperationsDashboard';
import ConsolidationHub from './pages/operations/ConsolidationHub';
import CustomsClearance from './pages/operations/CustomsClearance';
import TrainManagement from './pages/operations/TrainManagement';
import DistributionCenter from './pages/operations/DistributionCenter';

// Service Pages
import ServiceDashboard from './pages/service/ServiceDashboard';
import TicketManagement from './pages/service/TicketManagement';
import QuickOrderLookup from './pages/service/QuickOrderLookup';
import KnowledgeBase from './pages/service/KnowledgeBase';

const App: React.FC = () => {
  const { currentRole } = useAppContext();

  const getHomeRoute = () => {
    switch (currentRole) {
      case 'seller':
        return '/seller/dashboard';
      case 'operations':
        return '/operations/dashboard';
      case 'service':
        return '/service/dashboard';
      default:
        return '/seller/dashboard';
    }
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
          
          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/orders/create" element={<CreateOrder />} />
          <Route path="/seller/orders" element={<OrderList />} />
          <Route path="/seller/tracking/:trackingNumber" element={<OrderTracking />} />
          <Route path="/seller/documents" element={<Documents />} />
          <Route path="/seller/billing" element={<Billing />} />

          {/* Operations Routes */}
          <Route path="/operations/dashboard" element={<OperationsDashboard />} />
          <Route path="/operations/hub" element={<ConsolidationHub />} />
          <Route path="/operations/customs" element={<CustomsClearance />} />
          <Route path="/operations/trains" element={<TrainManagement />} />
          <Route path="/operations/distribution" element={<DistributionCenter />} />

          {/* Service Routes */}
          <Route path="/service/dashboard" element={<ServiceDashboard />} />
          <Route path="/service/tickets" element={<TicketManagement />} />
          <Route path="/service/lookup" element={<QuickOrderLookup />} />
          <Route path="/service/kb" element={<KnowledgeBase />} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
