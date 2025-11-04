import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GoogleGenAI } from '@google/genai';

const ConsolidationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const { orders, updateOrderStatus, t } = useAppContext();
  const [scanInput, setScanInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consolidationPlan, setConsolidationPlan] = useState<string | null>(null);

  const handleScan = () => {
    const order = orders.find(o => o.trackingNumber === scanInput && o.status === 'ORDER_CREATED');
    if (order) {
      updateOrderStatus(scanInput, 'HUB_RECEIVED', 'Received at consolidation hub', {
        timestamp: new Date().toISOString(),
        status: 'HUB_RECEIVED',
        location: 'Chengdu Hub',
        description: 'Parcel scanned into hub.',
        coordinates: [30.8789, 104.2467],
      });
      alert(`${t('orderScanSuccess')} ${scanInput}`);
      setScanInput('');
    } else {
      alert(`${t('orderScanFail')} ${scanInput}`);
    }
  };

  const hubInventory = orders.filter(o => o.status === 'HUB_RECEIVED');

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setConsolidationPlan(null);

    if (hubInventory.length === 0) {
      alert(t('noParcelsToConsolidate'));
      setIsLoading(false);
      return;
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const parcelData = hubInventory.map(o => 
        `- TN: ${o.trackingNumber}, Dest: ${o.recipient.country}, Service: ${o.serviceType}, Weight: ${o.cargo.weight}kg, Volume: ${o.cargo.volume.toFixed(3)}m^3`
      ).join('\n');

      const prompt = `
You are a logistics coordinator for DPD's Chengdu hub. Your task is to generate a container consolidation plan based on the parcels currently in the hub.

Next available trains for assignment:
- TR-002 (departing soon, primarily for EU_EXPRESS)
- TR-003 (scheduled later, for AFRICA_ECONOMY and overflow EU_EXPRESS)

Parcels currently in Hub Inventory:
${parcelData}

Instructions:
1. Group parcels logically by service type (EU_EXPRESS, AFRICA_ECONOMY) and destination.
2. Assign the grouped parcels to containers for the next available trains (TR-002, TR-003).
3. For each proposed container, provide a clear summary including:
   - A suggested Container ID (e.g., CNT-002-05).
   - The Train ID it should be loaded onto.
   - Total number of parcels.
   - Total weight (kg) and total volume (m^3).
   - A breakdown of parcels by destination country.
4. Present the output in a clean, easy-to-read format. Use Markdown for headings.
`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setConsolidationPlan(response.text);

    } catch (error) {
      console.error("Error generating consolidation plan:", error);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('hubTitle')}</h1>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('scan')} className={`${activeTab === 'scan' ? 'border-dpd-red text-dpd-red' : 'border-transparent text-gray-500 hover:text-dpd-dark-gray hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            {t('inboundScan')}
          </button>
          <button onClick={() => setActiveTab('consolidate')} className={`${activeTab === 'consolidate' ? 'border-dpd-red text-dpd-red' : 'border-transparent text-gray-500 hover:text-dpd-dark-gray hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            {t('consolidation')}
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`${activeTab === 'inventory' ? 'border-dpd-red text-dpd-red' : 'border-transparent text-gray-500 hover:text-dpd-dark-gray hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            {t('hubInventory')}
          </button>
        </nav>
      </div>
      
      {activeTab === 'scan' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('scanIntoHub')}</h2>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder={t('enterTracking')}
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
            />
            <button onClick={handleScan} className="bg-dpd-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-dpd-red-dark">{t('confirmInbound')}</button>
          </div>
        </div>
      )}

      {activeTab === 'consolidate' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('consolidationTitle')}</h2>
            {isLoading ? (
             <div className="flex items-center justify-center py-8">
               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dpd-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <p className="text-dpd-dark-gray">{t('generatingPlan')}</p>
             </div>
           ) : consolidationPlan ? (
             <div>
               <h3 className="text-lg font-semibold text-dpd-dark-gray mb-2">{t('recommendedPlan')}</h3>
               <pre className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm text-dpd-dark-gray overflow-x-auto">{consolidationPlan}</pre>
               <div className="mt-4 flex space-x-2">
                 <button onClick={() => alert('Plan execution initiated!')} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">{t('executePlan')}</button>
                 <button onClick={() => setConsolidationPlan(null)} className="bg-gray-200 text-dpd-dark-gray px-6 py-2 rounded-lg font-semibold hover:bg-gray-300">{t('clearPlan')}</button>
               </div>
             </div>
           ) : (
             <>
               <p className="text-dpd-dark-gray">{hubInventory.length} {t('awaitingConsolidation')}</p>
               <div className="mt-4">
                   <button onClick={handleGeneratePlan} disabled={isLoading || hubInventory.length === 0} className="bg-dpd-dark-gray text-white px-6 py-2 rounded-lg font-semibold hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed">
                     {t('generatePlan')}
                   </button>
               </div>
             </>
           )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('currentInventory')} ({hubInventory.length})</h2>
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('trackingNumber')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('destination')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('weight')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {hubInventory.map(order => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 text-sm font-medium text-dpd-dark-gray">{order.trackingNumber}</td>
                            <td className="px-6 py-4 text-sm text-dpd-dark-gray">{order.recipient.country}</td>
                            <td className="px-6 py-4 text-sm text-dpd-dark-gray">{order.cargo.weight}kg</td>
                        </tr>
                    ))}
                </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default ConsolidationHub;