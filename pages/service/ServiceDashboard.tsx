import React from 'react';
import { useAppContext } from '../../context/AppContext';
import DashboardCard from '../../components/DashboardCard';

const DashboardIcons = {
    pending: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2H5z" />
        </svg>
    ),
    inProgress: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    resolved: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    alert: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    )
}

const ServiceDashboard: React.FC = () => {
    const { tickets, t } = useAppContext();

    const stats = {
        pending: tickets.filter(t => t.status === 'Pending').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolvedToday: tickets.filter(t => t.status === 'Resolved').length,
    };

    const slaAlerts = tickets.filter(t => t.status === 'Pending' && t.priority === 'High');

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('serviceDashboardTitle')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard title={t('pendingTickets')} value={stats.pending} icon={DashboardIcons.pending} iconBgColor="bg-yellow-100" />
                <DashboardCard title={t('inProgress')} value={stats.inProgress} icon={DashboardIcons.inProgress} iconBgColor="bg-blue-100" />
                <DashboardCard title={t('resolvedToday')} value={stats.resolvedToday} icon={DashboardIcons.resolved} iconBgColor="bg-green-100" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('slaAlerts')}</h2>
                {slaAlerts.length > 0 ? (
                <ul className="space-y-3">
                    {slaAlerts.map(ticket => (
                        <li key={ticket.id} className="flex items-start p-3 bg-red-50 border-l-4 border-dpd-red rounded">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 mr-3">
                                {DashboardIcons.alert}
                            </div>
                            <div>
                                <p className="font-semibold text-dpd-dark-gray">{t(`ticketType_${ticket.type}`)} - Ticket #{ticket.id}</p>
                                <p className="text-sm text-gray-600">{ticket.description}</p>
                                <p className="text-sm text-dpd-red font-medium">SLA due in: {ticket.slaRemaining}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                ) : (
                    <p className="text-gray-500">{t('noSlaAlerts')}</p>
                )}
            </div>
            
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('performanceMetrics')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-2xl font-bold text-dpd-dark-gray">8 min</p>
                        <p className="text-sm text-gray-500">{t('avgResponse')}</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-dpd-dark-gray">45 min</p>
                        <p className="text-sm text-gray-500">{t('avgResolution')}</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-dpd-dark-gray">4.6 / 5.0</p>
                        <p className="text-sm text-gray-500">{t('satisfaction')}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ServiceDashboard;