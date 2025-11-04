
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

type DocStatus = 'PENDING' | 'VERIFIED' | 'NEEDS_REVIEW';

const CustomsClearance: React.FC = () => {
  const { orders, updateOrderStatus, t } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('export');
  const [docVerification, setDocVerification] = useState<{ invoice: DocStatus; packingList: DocStatus }>({
    invoice: 'PENDING',
    packingList: 'PENDING',
  });

  // Orders awaiting export clearance in Chengdu
  const pendingExportOrders = orders.filter(o => ['HUB_RECEIVED', 'LOADED_TRAIN'].includes(o.status));

  // Orders awaiting import clearance in Antwerp
  const pendingEUOrders = orders.filter(o => ['ARRIVED_ANTWERP', 'EU_CUSTOMS_CLEARING'].includes(o.status));

  const handleClearExportCustoms = (trackingNumber: string) => {
    updateOrderStatus(trackingNumber, 'CUSTOMS_CLEARED', 'Export customs cleared', {
      timestamp: new Date().toISOString(),
      status: 'CUSTOMS_CLEARED',
      location: 'Chengdu Customs',
      description: 'Export declaration approved.',
      coordinates: [30.8789, 104.2467],
    });
    setSelectedOrder(null);
  };

  const handleClearEUCustoms = (trackingNumber: string) => {
    updateOrderStatus(trackingNumber, 'EU_CUSTOMS_CLEARED', 'Import customs cleared in EU.', {
      timestamp: new Date().toISOString(),
      status: 'EU_CUSTOMS_CLEARED',
      location: 'Antwerp, Belgium',
      description: 'Import customs cleared.',
      coordinates: [51.2601, 4.3813],
    });
    setSelectedOrder(null);
  };
  
  const handleSelectOrder = (trackingNumber: string) => {
    setSelectedOrder(trackingNumber);
    // Reset verification status for the newly selected order
    setDocVerification({ invoice: 'PENDING', packingList: 'PENDING' });
  };

  const handleTabChange = (tab: 'export' | 'import') => {
    setActiveTab(tab);
    setSelectedOrder(null);
    setDocVerification({ invoice: 'PENDING', packingList: 'PENDING' });
  };
  
  const handleDocStatusChange = (doc: 'invoice' | 'packingList', status: DocStatus) => {
    setDocVerification(prev => ({ ...prev, [doc]: status }));
  };

  const currentList = activeTab === 'export' ? pendingExportOrders : pendingEUOrders;
  const currentOrder = orders.find(o => o.trackingNumber === selectedOrder);
  const allDocsVerified = docVerification.invoice === 'VERIFIED' && docVerification.packingList === 'VERIFIED';
  
  const getStatusBadgeClass = (status: DocStatus) => {
    switch (status) {
        case 'VERIFIED': return 'bg-green-100 text-green-800';
        case 'NEEDS_REVIEW': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DocumentRow: React.FC<{docType: 'invoice' | 'packingList'}> = ({ docType }) => {
    const docName = docType === 'invoice' ? t('commercialInvoice') : t('packingList');
    return (
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
                <span className="font-medium">{docName}</span>
                 <span className={`ml-3 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(docVerification[docType])}`}>
                    {t(`docStatus_${docVerification[docType]}`)}
                </span>
            </div>
            <div className="space-x-2">
                <button 
                    onClick={() => handleDocStatusChange(docType, 'VERIFIED')} 
                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors"
                >
                    {t('markVerified')}
                </button>
                <button 
                    onClick={() => handleDocStatusChange(docType, 'NEEDS_REVIEW')} 
                    className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
                >
                    {t('flagForReview')}
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('customsTitle')}</h1>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => handleTabChange('export')} className={`${activeTab === 'export' ? 'border-dpd-red text-dpd-red' : 'border-transparent text-gray-500 hover:text-dpd-dark-gray hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            {t('exportClearance')}
          </button>
          <button onClick={() => handleTabChange('import')} className={`${activeTab === 'import' ? 'border-dpd-red text-dpd-red' : 'border-transparent text-gray-500 hover:text-dpd-dark-gray hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            {t('importClearance')}
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md h-fit">
          <h2 className="text-lg font-semibold text-dpd-dark-gray mb-2">{t('pendingQueue')} ({currentList.length})</h2>
          <ul className="space-y-1 max-h-96 overflow-y-auto">
            {currentList.map(order => {
              const isSelected = selectedOrder === order.trackingNumber;
              return (
              <li 
                key={order.id} 
                onClick={() => handleSelectOrder(order.trackingNumber)} 
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
          {currentOrder ? (
            <div className="space-y-4 text-dpd-dark-gray">
              <h3 className="text-lg font-bold">{currentOrder.trackingNumber}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div><strong>{t('cargoDescription')}:</strong> {currentOrder.cargo.description}</div>
                <div><strong>{t('hsCode')}:</strong> {currentOrder.cargo.hsCode}</div>
                <div><strong>{t('declaredValue')}:</strong> {currentOrder.cargo.declaredValue} {currentOrder.cargo.currency}</div>
                <div><strong>IOSS Number:</strong> {currentOrder.iossNumber || 'N/A'}</div>
              </div>
              
              <div className="space-y-3 border-t pt-4 mt-4">
                <DocumentRow docType="invoice" />
                <DocumentRow docType="packingList" />
              </div>

              <div className="pt-4">
                {activeTab === 'export' ? (
                    <button 
                        onClick={() => handleClearExportCustoms(currentOrder.trackingNumber)} 
                        disabled={!allDocsVerified}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {t('approveClearance')}
                    </button>
                ) : (
                    <button 
                        onClick={() => handleClearEUCustoms(currentOrder.trackingNumber)} 
                        disabled={!allDocsVerified}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {t('approveEUClearance')}
                    </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">{t('selectOrderToReview')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomsClearance;
