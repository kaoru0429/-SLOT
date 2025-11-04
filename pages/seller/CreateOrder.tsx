import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

const CreateOrder: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: 'EU_EXPRESS',
    description: '',
    hsCode: '',
    quantity: 1,
    weight: 1,
    value: 100,
    name: '',
    country: 'Germany',
    address: '',
    postalCode: '',
    phone: '',
  });
  const navigate = useNavigate();
  const { addOrder, t } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const trackingNumber = `DPD${Date.now()}`.slice(0, 14);
    const newOrder: Partial<Order> = {
        id: `ORD${Date.now()}`,
        trackingNumber,
        sellerId: 'S001',
        sellerName: 'Shenzhen Tech Co.',
        status: 'ORDER_CREATED',
        statusText: 'Order created, awaiting pickup',
        serviceType: formData.serviceType as 'EU_EXPRESS' | 'AFRICA_ECONOMY',
        cargo: {
            description: formData.description,
            hsCode: formData.hsCode,
            quantity: Number(formData.quantity),
            weight: Number(formData.weight),
            volume: Number(formData.weight) / 100, // approximation
            declaredValue: Number(formData.value),
            currency: 'USD',
        },
        recipient: {
            name: formData.name,
            country: formData.country,
            city: '', // This would come from a more complex form
            postalCode: formData.postalCode,
            address: formData.address,
            phone: formData.phone,
            email: ''
        },
        timeline: [{
            timestamp: new Date().toISOString(),
            status: 'ORDER_CREATED',
            location: 'Seller Location',
            description: 'Order created by seller.',
            coordinates: [22.5431, 114.0579],
        }],
        createdAt: new Date().toISOString(),
        eta: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        billing: {
            shippingFee: (formData.serviceType === 'EU_EXPRESS' ? 8.5 : 4.2) * Number(formData.weight),
            customsFee: 0,
            vat: 0,
            total: 0,
            currency: 'EUR',
            status: 'UNPAID'
        }
    };
    addOrder(newOrder as Order);
    alert(`${t('orderCreatedMsg')} ${trackingNumber}`);
    navigate(`/seller/tracking/${trackingNumber}`);
  };
  
  const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, required?: boolean}> = ({label, name, value, onChange, type = 'text', required = true}) => (
      <div>
          <label htmlFor={name} className="block text-sm font-medium text-dpd-dark-gray">{label}</label>
          <input type={type} name={name} id={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-dpd-red focus:border-dpd-red sm:text-sm" />
      </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-dpd-dark-gray mb-6">{t('createOrderTitle')}</h1>
      
      <div className="mb-8">
        <ol className="flex items-center w-full">
          <li className={`flex w-full items-center ${step >= 1 ? 'text-dpd-red' : 'text-gray-500'} after:content-[''] after:w-full after:h-1 after:border-b ${step > 1 ? 'after:border-dpd-red' : 'after:border-gray-200'} after:border-4 after:inline-block`}>
            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${step >= 1 ? 'bg-red-50' : 'bg-gray-100'}`}>1</span>
          </li>
          <li className={`flex w-full items-center ${step >= 2 ? 'text-dpd-red' : 'text-gray-500'} after:content-[''] after:w-full after:h-1 after:border-b ${step > 2 ? 'after:border-dpd-red' : 'after:border-gray-200'} after:border-4 after:inline-block`}>
            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${step >= 2 ? 'bg-red-50' : 'bg-gray-100'}`}>2</span>
          </li>
          <li className={`flex items-center ${step >= 3 ? 'text-dpd-red' : 'text-gray-500'}`}>
            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${step >= 3 ? 'bg-red-50' : 'bg-gray-100'}`}>3</span>
          </li>
        </ol>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-dpd-dark-gray">{t('step1Service')}</h2>
          <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-dpd-red focus:border-dpd-red sm:text-sm rounded-md">
            <option value="EU_EXPRESS">{t('euExpress')}</option>
            <option value="AFRICA_ECONOMY">{t('africaEconomy')}</option>
          </select>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-dpd-dark-gray">{t('step2Cargo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label={t('cargoDescription')} name="description" value={formData.description} onChange={handleChange} />
            <FormInput label={t('hsCode')} name="hsCode" value={formData.hsCode} onChange={handleChange} />
            <FormInput label={t('quantity')} name="quantity" value={formData.quantity} onChange={handleChange} type="number" />
            <FormInput label={t('weight')} name="weight" value={formData.weight} onChange={handleChange} type="number" />
            <FormInput label={t('declaredValue')} name="value" value={formData.value} onChange={handleChange} type="number" />
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-dpd-dark-gray">{t('step3Recipient')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label={t('recipientName')} name="name" value={formData.name} onChange={handleChange} />
              <FormInput label={t('phoneNumber')} name="phone" value={formData.phone} onChange={handleChange} />
              <div className="md:col-span-2">
                 <FormInput label={t('address')} name="address" value={formData.address} onChange={handleChange} />
              </div>
              <FormInput label={t('postalCode')} name="postalCode" value={formData.postalCode} onChange={handleChange} />
              <div>
                  <label htmlFor="country" className="block text-sm font-medium text-dpd-dark-gray">{t('country')}</label>
                  <select id="country" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-dpd-red focus:border-dpd-red sm:text-sm rounded-md">
                      <option>Germany</option>
                      <option>France</option>
                      <option>United Kingdom</option>
                      <option>Italy</option>
                      <option>Morocco</option>
                  </select>
              </div>
            </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="bg-gray-200 text-dpd-dark-gray px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('back')}
        </button>
        {step < 3 && (
          <button onClick={() => setStep(s => Math.min(3, s + 1))} className="bg-dpd-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-dpd-red-dark">
            {t('next')}
          </button>
        )}
        {step === 3 && (
          <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
            {t('submitCreateOrder')}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateOrder;