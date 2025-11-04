import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';
import { formatDate } from '../../utils/helpers';
// Fix: Import statusDefinitions to correctly populate the status filter.
import { statusDefinitions } from '../../data/mockData';

const OrderList: React.FC = () => {
    const { orders, t, getStatusDef, language } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) || order.recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesService = serviceFilter === 'all' || order.serviceType === serviceFilter;
            return matchesSearch && matchesStatus && matchesService;
        });
    }, [orders, searchTerm, statusFilter, serviceFilter]);
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('myOrdersTitle')}</h1>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-dpd-red focus:border-dpd-red"
                    />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="all">{t('allStatuses')}</option>
                        {/* Fix: Iterate over statusDefinitions keys for a correct list of statuses. */}
                        {Object.keys(statusDefinitions).map(key => (
                           <option key={key} value={key}>{getStatusDef(key).text}</option>
                        ))}
                    </select>
                    <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="all">{t('allServices')}</option>
                        <option value="EU_EXPRESS">{t('euExpress').split('(')[0].trim()}</option>
                        <option value="AFRICA_ECONOMY">{t('africaEconomy').split('(')[0].trim()}</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('trackingNumber')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('recipient')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('destination')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('created')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('eta')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map(order => {
                                const statusDef = getStatusDef(order.status);
                                return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dpd-dark-gray">{order.trackingNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDef.color}`}>{statusDef.text}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{order.recipient.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{order.recipient.city}, {order.recipient.country}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{formatDate(order.createdAt, language)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{formatDate(order.eta, language)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => navigate(`/seller/tracking/${order.trackingNumber}`)} className="text-dpd-red hover:text-dpd-red-dark">{t('view')}</button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;