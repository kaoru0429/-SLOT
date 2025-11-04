import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import TrackingMap from '../../components/TrackingMap';
import OrderTimeline from '../../components/OrderTimeline';

const OrderTracking: React.FC = () => {
    const { trackingNumber } = useParams<{ trackingNumber: string }>();
    const { orders, t, getStatusDef } = useAppContext();

    const order = orders.find(o => o.trackingNumber === trackingNumber);

    if (!order) {
        return <div className="text-center text-red-500">{t('orderNotFound')}</div>;
    }

    const statusDef = getStatusDef(order.status);
    const statusColorClass = statusDef.color.split(' ')[1] || 'text-dpd-dark-gray';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('trackingOrderTitle')}</h1>
                <p className="text-gray-500 font-mono">{order.trackingNumber}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <p className="text-sm text-gray-500">{t('currentStatus')}</p>
                        <p className={`text-2xl font-bold ${statusColorClass}`}>{statusDef.text}</p>
                        <p className="text-sm text-dpd-dark-gray">{order.statusText}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                        <p className="text-sm text-gray-500">{t('estimatedDelivery')}</p>
                        <p className="text-xl font-bold text-dpd-dark-gray">{new Date(order.eta).toDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('shipmentJourney')}</h2>
                    <TrackingMap events={order.timeline} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('orderDetails')}</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">{t('recipient')}:</span> <span className="font-medium text-dpd-dark-gray">{order.recipient.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">{t('destination')}:</span> <span className="font-medium text-dpd-dark-gray text-right">{order.recipient.address}, {order.recipient.city}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">{t('cargoDescription')}:</span> <span className="font-medium text-dpd-dark-gray">{order.cargo.description}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">{t('weight')}:</span> <span className="font-medium text-dpd-dark-gray">{order.cargo.weight} kg</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">{t('serviceType')}:</span> <span className="font-medium text-dpd-dark-gray">{order.serviceType === 'EU_EXPRESS' ? t('euExpress').split('(')[0] : t('africaEconomy').split('(')[0]}</span></div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('trackingHistory')}</h2>
                <OrderTimeline events={order.timeline} />
            </div>

        </div>
    );
};

export default OrderTracking;