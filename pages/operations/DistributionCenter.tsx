
import React from 'react';
import { useAppContext } from '../../context/AppContext';

const EUDispatchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H17v11z" />
    </svg>
);

const AfricaTransferIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21V12a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l-2-5H6l-2 5m16 0l-2-5M4 21l2-5m12 5l-2-5M6 21l2-5" />
        <path d="M22 12H2" />
        <path d="M12 2v8" />
        <path d="M12 12l-4-4m4 4l4-4" />
    </svg>
);


const DistributionCenter: React.FC = () => {
  const { orders, t } = useAppContext();
  
  const atCenter = orders.filter(o => ['AT_DISTRIBUTION_CENTER', 'EU_CUSTOMS_CLEARING'].includes(o.status));
  const awaitingEUDispatch = atCenter.filter(o => o.serviceType === 'EU_EXPRESS');
  const awaitingAfricaTransfer = atCenter.filter(o => o.serviceType === 'AFRICA_ECONOMY');

  const parcelsByCountry = awaitingEUDispatch.reduce((acc, order) => {
    acc[order.recipient.country] = (acc[order.recipient.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleDispatchEU = () => {
    alert(t('dispatchEUTrucksConfirm'));
  };

  const handleScheduleAfrica = () => {
    alert(t('scheduleSeaTransferConfirm'));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('distCenterTitle')}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('centerOverview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-dpd-red">{atCenter.length}</p>
            <p className="text-sm font-medium text-dpd-dark-gray">{t('parcelsInCenter')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-dpd-red">{awaitingEUDispatch.length}</p>
            <p className="text-sm font-medium text-dpd-dark-gray">{t('awaitingEUDispatch')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-dpd-red">{awaitingAfricaTransfer.length}</p>
            <p className="text-sm font-medium text-dpd-dark-gray">{t('awaitingAfricaTransfer')}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <div className="flex items-center mb-4 text-dpd-dark-gray">
                <EUDispatchIcon />
                <h2 className="text-xl font-semibold ml-2">{t('dispatchScheduleEU')}</h2>
            </div>
            <div className="flex-grow space-y-3">
              {Object.keys(parcelsByCountry).length > 0 ? (
                Object.entries(parcelsByCountry).map(([country, count]) => (
                  <div key={country} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium text-dpd-dark-gray">{country}</span>
                    <span className="font-bold text-dpd-dark-gray">{count} {t('parcels')}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">{t('noParcelsEU')}</div>
              )}
            </div>
            <button 
              onClick={handleDispatchEU}
              className="mt-4 w-full bg-dpd-red text-white px-4 py-3 rounded-lg font-semibold hover:bg-dpd-red-dark transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed" 
              disabled={awaitingEUDispatch.length === 0}
            >
                {t('dispatchEUTrucks')}
            </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <div className="flex items-center mb-4 text-dpd-dark-gray">
                <AfricaTransferIcon />
                <h2 className="text-xl font-semibold ml-2">{t('seaFreightTransfer')}</h2>
            </div>
            <div className="flex-grow space-y-3">
              {awaitingAfricaTransfer.length > 0 ? (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium text-dpd-dark-gray">Container to Casablanca, Morocco</p>
                  <p className="font-bold text-dpd-dark-gray">{awaitingAfricaTransfer.length} {t('parcels')}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">{t('noParcelsAfrica')}</div>
              )}
            </div>
            <button 
              onClick={handleScheduleAfrica}
              className="mt-4 w-full bg-dpd-dark-gray text-white px-4 py-3 rounded-lg font-semibold hover:bg-black transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed" 
              disabled={awaitingAfricaTransfer.length === 0}
            >
                {t('scheduleSeaTransfer')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DistributionCenter;
