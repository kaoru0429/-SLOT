import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import DashboardCard from '../../components/DashboardCard';
import { Order } from '../../types';
import { formatDate } from '../../utils/helpers';

const RecentOrdersTable: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const navigate = useNavigate();
    const { language, getStatusDef, t } = useAppContext();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase tracking-wider">{t('trackingNumber')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase tracking-wider">{t('destination')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase tracking-wider">{t('eta')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {orders.slice(0, 5).map(order => {
                        const statusDef = getStatusDef(order.status);
                        return (
                            <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/seller/tracking/${order.trackingNumber}`)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dpd-dark-gray">{order.trackingNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDef.color}`}>{statusDef.text}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{order.recipient.city}, {order.recipient.country}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{formatDate(order.eta, language)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const DashboardIcons = {
    total: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
    ),
    inTransit: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V4a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1zm-1 5v-2H4v2h8zm6-11H9.5a.5.5 0 000 1H18v5.5a2.5 2.5 0 002.5 2.5h0a2.5 2.5 0 002.5-2.5V11a.5.5 0 00-.5-.5H19z" />
        </svg>
    ),
    delivered: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    pending: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
};


const SellerDashboard: React.FC = () => {
    const { orders, t } = useAppContext();
    const navigate = useNavigate();

    const stats = {
        total: orders.length,
        inTransit: orders.filter(o => o.status.startsWith('IN_TRANSIT') || o.status.startsWith('DEPARTED')).length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        pending: orders.filter(o => ['ORDER_CREATED', 'HUB_RECEIVED'].includes(o.status)).length,
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('sellerDashboardTitle')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title={t('totalOrders')} value={stats.total} icon={DashboardIcons.total} iconBgColor="bg-blue-100" />
                <DashboardCard title={t('inTransit')} value={stats.inTransit} icon={DashboardIcons.inTransit} iconBgColor="bg-purple-100" />
                <DashboardCard title={t('delivered')} value={stats.delivered} icon={DashboardIcons.delivered} iconBgColor="bg-green-100" />
                <DashboardCard title={t('pendingAction')} value={stats.pending} icon={DashboardIcons.pending} iconBgColor="bg-yellow-100" />
            </div>

            <div className="flex space-x-4">
                <button onClick={() => navigate('/seller/orders/create')} className="bg-dpd-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-dpd-red-dark transition shadow-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {t('createNewOrder')}
                </button>
                 <button onClick={() => navigate('/seller/orders')} className="bg-white text-dpd-dark-gray px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition shadow-sm">
                    {t('viewAllOrders')}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-dpd-dark-gray p-6">{t('recentOrders')}</h2>
                <RecentOrdersTable orders={orders} />
            </div>
        </div>
    );
};

export default SellerDashboard;