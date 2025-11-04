import React from 'react';
import DashboardCard from '../../components/DashboardCard';
import { useAppContext } from '../../context/AppContext';
import { Order, TimelineEvent } from '../../types';
import { formatDateTime } from '../../utils/helpers';

const DashboardIcons = {
    parcels: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    trains: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V4a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1zm-1 5v-2H4v2h8zm6-11H9.5a.5.5 0 000 1H18v5.5a2.5 2.5 0 002.5 2.5h0a2.5 2.5 0 002.5-2.5V11a.5.5 0 00-.5-.5H19z" />
        </svg>
    ),
    onTime: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    loadFactor: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    scanIn: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 18v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a4 4 0 11-8 0 4 4 0 018 0z" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M12 6v.01" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
        </svg>
    ),
    load: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    ),
    customs: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    )
};

interface TrainJourney {
  id: string;
  trainNumber: string;
  departureDate: string;
  orders: Order[];
  latestEvent: TimelineEvent;
  passedStatuses: Set<string>;
  totalWeight: number;
}

const TrainJourneyDetails: React.FC<{ journey: TrainJourney }> = ({ journey }) => {
    const { t, language, getStatusDef } = useAppContext();

    const waypoints = [
        { key: 'CHENGDU', label: t('waypointChengdu'), statuses: ['LOADED_TRAIN', 'DEPARTED_CHENGDU'] },
        { key: 'EXIT_CHINA', label: t('waypointExitChina'), statuses: ['EXIT_CHINA'] },
        { key: 'RUSSIA', label: t('waypointRussia'), statuses: ['IN_TRANSIT_RUSSIA'] },
        { key: 'WAYBILL_EXCHANGE', label: t('waypointWaybillExchange'), statuses: ['WAYBILL_EXCHANGE'] },
        { key: 'ANTWERP', label: t('waypointAntwerp'), statuses: ['ARRIVED_ANTWERP', 'EU_CUSTOMS_CLEARING', 'AT_DISTRIBUTION_CENTER'] }
    ];

    let currentWaypointIndex = -1;
    for (let i = waypoints.length - 1; i >= 0; i--) {
        if (waypoints[i].statuses.some(s => journey.passedStatuses.has(s))) {
            currentWaypointIndex = i;
            break;
        }
    }

    const latestStatusDef = getStatusDef(journey.latestEvent.status);

    const keyAlerts = journey.orders.flatMap(o => o.timeline)
      .filter(e => e.status === 'WAYBILL_EXCHANGE' || e.status === 'EXCEPTION')
      .slice(0, 1);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-dpd-red">{t('train')} {journey.trainNumber}</h3>
                    <p className="text-sm text-gray-500">{t('departure')}: {journey.departureDate}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-dpd-dark-gray">{latestStatusDef.text}</p>
                    <p className="text-sm text-gray-500">{t('lastUpdate')}: {formatDateTime(journey.latestEvent.timestamp, language)} at {journey.latestEvent.location}</p>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-dpd-dark-gray mb-3">{t('journeyProgress')}</h4>
                <div className="flex items-center w-full">
                    {waypoints.map((waypoint, index) => (
                        <React.Fragment key={waypoint.key}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-5 h-5 rounded-full border-2 ${index <= currentWaypointIndex ? 'bg-dpd-red border-dpd-red' : 'bg-white border-gray-300'}`}></div>
                                <p className={`text-xs mt-1 font-medium ${index <= currentWaypointIndex ? 'text-dpd-red' : 'text-gray-500'}`}>{waypoint.label}</p>
                            </div>
                            {index < waypoints.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 relative ${index < currentWaypointIndex ? 'bg-dpd-red' : 'bg-gray-300'}`}>
                                    {index === currentWaypointIndex && journey.latestEvent.status !== 'ARRIVED_ANTWERP' && (
                                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-pulse">🚂</span>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                <div>
                    <p className="text-sm text-gray-500">{t('parcelsOnBoard')}</p>
                    <p className="text-lg font-bold text-dpd-dark-gray">{journey.orders.length}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{t('totalWeight')}</p>
                    <p className="text-lg font-bold text-dpd-dark-gray">{journey.totalWeight.toFixed(2)} kg</p>
                </div>
                <div>
                     <p className="text-sm text-gray-500">{t('keyInfo')}</p>
                    {keyAlerts.length > 0 ? keyAlerts.map((alert, i) => (
                        <div key={i} className="flex items-center text-sm font-semibold text-yellow-700 bg-yellow-100 p-2 rounded-md">
                            <span>{getStatusDef(alert.status).icon}</span>
                            <span className="ml-2">{getStatusDef(alert.status).text}</span>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 font-medium pt-1">No special alerts.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const OperationsDashboard: React.FC = () => {
  // Fix: Destructure getStatusDef from useAppContext to resolve the error.
  const { orders, t, getStatusDef } = useAppContext();
  
  const inHubOrders = orders.filter(o => o.status === 'HUB_RECEIVED');
  
  // Group orders by train journey
  const journeysInTransit = orders
    .filter(o => o.trainInfo.trainNumber && getStatusDef(o.status).phase === 'TRANSIT')
    .reduce((acc, order) => {
        const journeyId = `${order.trainInfo.trainNumber}-${order.trainInfo.departureDate}`;
        if (!acc[journeyId]) {
            acc[journeyId] = { 
              id: journeyId,
              trainNumber: order.trainInfo.trainNumber,
              departureDate: order.trainInfo.departureDate,
              orders: [],
              latestEvent: order.timeline[0],
              passedStatuses: new Set(),
              totalWeight: 0
            };
        }
        acc[journeyId].orders.push(order);
        acc[journeyId].totalWeight += order.cargo.weight;
        order.timeline.forEach(e => acc[journeyId].passedStatuses.add(e.status));
        
        // Update latest event for the journey
        if (new Date(order.timeline[0].timestamp) > new Date(acc[journeyId].latestEvent.timestamp)) {
            acc[journeyId].latestEvent = order.timeline[0];
        }
        
        return acc;
    }, {} as Record<string, TrainJourney>);
    
  const journeys = Object.values(journeysInTransit).sort((a,b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('opsDashboardTitle')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title={t('parcelsInHub')} value={inHubOrders.length} icon={DashboardIcons.parcels} iconBgColor="bg-blue-100" />
        <DashboardCard title={t('trainsInTransit')} value={journeys.length} icon={DashboardIcons.trains} iconBgColor="bg-purple-100" />
        <DashboardCard title={t('onTimeRate')} value="96.5%" icon={DashboardIcons.onTime} iconBgColor="bg-green-100" />
        <DashboardCard title={t('avgLoadFactor')} value="92%" icon={DashboardIcons.loadFactor} iconBgColor="bg-indigo-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-dpd-dark-gray">{t('liveTrainJourneys')}</h2>
            {journeys.length > 0 ? (
                journeys.map(journey => <TrainJourneyDetails key={journey.id} journey={journey} />)
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                    {t('noTrainsInTransit')}
                </div>
            )}
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-dpd-dark-gray">{t('pendingTasks')}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              <li className="flex items-start p-3 bg-yellow-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
                    {DashboardIcons.scanIn}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-dpd-dark-gray">{t('taskScanIn')}</p>
                  <p className="text-sm text-gray-500">{t('taskScanInDesc')}</p>
                </div>
              </li>
              <li className="flex items-start p-3 bg-yellow-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
                    {DashboardIcons.load}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-dpd-dark-gray">{t('taskLoad')}</p>
                  <p className="text-sm text-gray-500">{t('taskLoadDesc')}</p>
                </div>
              </li>
               <li className="flex items-start p-3 bg-yellow-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
                    {DashboardIcons.customs}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-dpd-dark-gray">{t('taskCustoms')}</p>
                  <p className="text-sm text-gray-500">{t('taskCustomsDesc')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;