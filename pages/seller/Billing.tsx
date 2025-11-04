import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { shippingRates } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

const Billing: React.FC = () => {
    const { orders, t, language } = useAppContext();
    const [calculator, setCalculator] = useState({
        serviceType: 'EU_EXPRESS',
        weight: 1,
        country: 'Germany'
    });
    
    const estimatedCost = useMemo(() => {
        const rateInfo = shippingRates[calculator.serviceType as keyof typeof shippingRates];
        if (!rateInfo) return 0;
        
        const countryMultiplier = rateInfo.countries[calculator.country as keyof typeof rateInfo.countries] || 1.0;
        return rateInfo.baseRate * calculator.weight * countryMultiplier;
    }, [calculator]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCalculator(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('billingCenter')}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('costCalculator')}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dpd-dark-gray">{t('serviceType')}</label>
                            <select name="serviceType" value={calculator.serviceType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                                <option value="EU_EXPRESS">{t('euExpress').split('(')[0]}</option>
                                <option value="AFRICA_ECONOMY">{t('africaEconomy').split('(')[0]}</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-dpd-dark-gray">{t('destination')}</label>
                            <select name="country" value={calculator.country} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                                <option>Germany</option>
                                <option>France</option>
                                <option>United Kingdom</option>
                                <option>Italy</option>
                                <option>Morocco</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dpd-dark-gray">{t('weight')}</label>
                            <input type="number" name="weight" value={calculator.weight} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="pt-4 text-center">
                            <p className="text-sm text-gray-500">{t('estimatedCost')}</p>
                            <p className="text-3xl font-bold text-dpd-red">€{estimatedCost.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('billingHistory')}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('orderNumber')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('serviceType')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('amount')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('date')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-red font-medium">{order.trackingNumber.slice(-6)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{order.serviceType === 'EU_EXPRESS' ? t('euExpress').split('(')[0] : t('africaEconomy').split('(')[0]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray font-semibold">€{order.billing.shippingFee.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{formatDate(order.createdAt, language)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.billing.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {t(order.billing.status.toLowerCase())}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;