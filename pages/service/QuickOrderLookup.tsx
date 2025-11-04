import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';
import OrderTimeline from '../../components/OrderTimeline';

const QuickOrderLookup: React.FC = () => {
    const { orders, t } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [foundOrder, setFoundOrder] = useState<Order | null>(null);
    const [notFound, setNotFound] = useState(false);

    const handleSearch = () => {
        const order = orders.find(o => o.trackingNumber.toLowerCase() === searchTerm.toLowerCase());
        setFoundOrder(order || null);
        setNotFound(!order);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('quickLookupTitle')}</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder={t('enterTracking')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button onClick={handleSearch} className="bg-dpd-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-dpd-red-dark">{t('search')}</button>
                </div>
            </div>

            {foundOrder && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4 animate-fade-in">
                    <h2 className="text-xl font-semibold text-dpd-dark-gray">{t('orderDetails')}: {foundOrder.trackingNumber}</h2>
                    <p className="text-dpd-dark-gray"><strong>{t('status')}:</strong> {foundOrder.statusText}</p>
                    <p className="text-dpd-dark-gray"><strong>{t('recipient')}:</strong> {foundOrder.recipient.name}, {foundOrder.recipient.country}</p>
                    <details>
                        <summary className="cursor-pointer font-medium text-dpd-red">{t('viewFullTimeline')}</summary>
                        <div className="mt-4">
                            <OrderTimeline events={foundOrder.timeline} />
                        </div>
                    </details>
                </div>
            )}
            
            {notFound && !foundOrder && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <p className="text-yellow-800">{t('orderNotFound')}</p>
                </div>
            )}
        </div>
    );
};

export default QuickOrderLookup;