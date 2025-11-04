import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const CustomsClearance: React.FC = () => {
  const { orders, updateOrderStatus, t } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const pendingOrders = orders.filter(o => ['HUB_RECEIVED', 'LOADED_TRAIN'].includes(o.status));

  const handleClearCustoms = (trackingNumber: string) => {
    updateOrderStatus(trackingNumber, 'CUSTOMS_CLEARED', 'Export customs cleared', {
      timestamp: new Date().toISOString(),
      status: 'CUSTOMS_CLEARED',
      location: 'Chengdu Customs',
      description: 'Export declaration approved.',
      coordinates: [30.8789, 104.2467],
    });
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('customsTitle')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md h-fit">
          <h2 className="text-lg font-semibold text-dpd-dark-gray mb-2">{t('pendingQueue')} ({pendingOrders.length})</h2>
          <ul className="space-y-1 max-h-96 overflow-y-auto">
            {pendingOrders.map(order => {
              const isSelected = selectedOrder === order.trackingNumber;
              return (
              <li 
                key={order.id} 
                onClick={() => setSelectedOrder(order.trackingNumber)} 
                className={`p-3 cursor-pointer rounded-md transition-colors ${isSelected ? 'bg-dpd-red text-white' : 'hover:bg-gray-100'}`}
              >
                <p className={`font-medium ${isSelected ? 'text-white' : 'text-dpd-dark-gray'}`}>{order.trackingNumber}</p>
                <p className={`text-sm ${isSelected ? 'text-red-200' : 'text-gray-500'}`}>{order.recipient.country}</p>
              </li>
              );
            })}
          </ul>
        </div>
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('reviewDocuments')}</h2>
          {selectedOrder ? (
            (() => {
              const order = orders.find(o => o.trackingNumber === selectedOrder);
              if (!order) return null;
              return (
                <div className="space-y-4 text-dpd-dark-gray">
                  <h3 className="text-lg font-bold">{order.trackingNumber}</h3>
                  <p><strong>{t('cargoDescription')}:</strong> {order.cargo.description}</p>
                  <p><strong>{t('hsCode')}:</strong> {order.cargo.hsCode}</p>
                  <p><strong>{t('declaredValue')}:</strong> {order.cargo.declaredValue} {order.cargo.currency}</p>
                  <div className="flex items-center space-x-4">
                      <p>{t('invoiceTemplate')}:</p>
                      <span className="text-green-600 font-semibold">✓ {t('verified')}</span>
                      <a href="#" className="text-dpd-red hover:text-dpd-red-dark">{t('preview')}</a>
                  </div>
                   <div className="flex items-center space-x-4">
                      <p>{t('packingListTemplate')}:</p>
                      <span className="text-green-600 font-semibold">✓ {t('verified')}</span>
                      <a href="#" className="text-dpd-red hover:text-dpd-red-dark">{t('preview')}</a>
                  </div>
                  <div className="pt-4">
                    <button onClick={() => handleClearCustoms(order.trackingNumber)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
                      {t('approveClearance')}
                    </button>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="text-center text-gray-500 py-16">{t('selectOrderToReview')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomsClearance;