
import { User, Order, StatusDefinition, Ticket, Train } from '../types';

export const mockUsers = {
  seller: {
    id: 'S001',
    name: 'Shenzhen Tech Co.',
    email: 'seller@example.com',
    role: 'SELLER'
  } as User,
  operations: {
    id: 'O001', 
    name: 'Wei Zhang - Hub Manager',
    email: 'operations@dpd.cn',
    role: 'OPERATIONS'
  } as User,
  service: {
    id: 'CS001',
    name: 'Li Na - Support Specialist',
    email: 'service@dpd.cn',
    role: 'CUSTOMER_SERVICE'
  } as User
};

export const statusDefinitions: { [key: string]: Omit<StatusDefinition, 'text'> } = {
  'ORDER_CREATED': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '📝', phase: 'ORIGIN' },
  'HUB_RECEIVED': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '📦', phase: 'ORIGIN' },
  'CUSTOMS_CLEARED': { color: 'bg-green-100 text-green-700', icon: '✅', phase: 'ORIGIN' },
  'LOADED_TRAIN': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '🚂', phase: 'ORIGIN' },
  'DEPARTED_CHENGDU': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '🚂', phase: 'TRANSIT' },
  'EXIT_CHINA': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '🛂', phase: 'TRANSIT' },
  'IN_TRANSIT_RUSSIA': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '🚂', phase: 'TRANSIT' },
  'WAYBILL_EXCHANGE': { color: 'bg-yellow-100 text-yellow-700', icon: '📄', phase: 'TRANSIT' },
  'ARRIVED_ANTWERP': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '🏭', phase: 'DESTINATION' },
  'EU_CUSTOMS_CLEARING': { color: 'bg-yellow-100 text-yellow-700', icon: '🛂', phase: 'DESTINATION' },
  'AT_DISTRIBUTION_CENTER': { color: 'bg-gray-100 text-dpd-dark-gray', icon: '🏢', phase: 'DESTINATION' },
  'OUT_FOR_DELIVERY': { color: 'bg-blue-100 text-blue-700', icon: '🚚', phase: 'LAST_MILE' },
  'DELIVERED': { color: 'bg-green-100 text-green-700', icon: '🎉', phase: 'COMPLETED' },
  'EXCEPTION': { color: 'bg-red-100 text-red-700', icon: '⚠️', phase: 'EXCEPTION' },
};

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    trackingNumber: 'DPD20251101001',
    sellerId: 'S001',
    sellerName: 'Shenzhen Tech Co.',
    status: 'DELIVERED',
    statusText: 'Delivered successfully',
    serviceType: 'EU_EXPRESS',
    cargo: { description: 'Smart Watches', hsCode: '9102.11.00', quantity: 2, weight: 0.8, volume: 0.002, declaredValue: 450, currency: 'USD' },
    recipient: { name: 'Hans Mueller', country: 'Germany', city: 'Berlin', postalCode: '10623', address: 'Straße des 17. Juni 135', phone: '+49-30-12345678', email: 'hans@example.de' },
    timeline: [
      { timestamp: '2025-11-10T14:00:00Z', status: 'DELIVERED', location: 'Berlin, Germany', description: 'Delivered to recipient.', coordinates: [52.5163, 13.3283] },
      { timestamp: '2025-11-10T08:00:00Z', status: 'OUT_FOR_DELIVERY', location: 'Berlin, Germany', description: 'Out for final delivery.', coordinates: [52.5163, 13.3283] },
      { timestamp: '2025-11-09T18:00:00Z', status: 'AT_DISTRIBUTION_CENTER', location: 'Antwerp, Belgium', description: 'Processed at distribution center.', coordinates: [51.2601, 4.3813] },
      { timestamp: '2025-11-08T14:23:00Z', status: 'IN_TRANSIT_RUSSIA', location: 'Moscow, Russia', description: 'In transit through Russia.', coordinates: [55.7558, 37.6173] },
      { timestamp: '2025-11-04T18:00:00Z', status: 'LOADED_TRAIN', location: 'Chengdu, China', description: 'Loaded on train TR-001.', coordinates: [30.8789, 104.2467] },
      { timestamp: '2025-11-01T08:30:00Z', status: 'ORDER_CREATED', location: 'Shenzhen, China', description: 'Order created.', coordinates: [22.5431, 114.0579] },
    ],
    trainInfo: { trainNumber: 'TR-001', departureDate: '2025-11-04', containerNumber: 'CNT-001-23' },
    createdAt: '2025-11-01T08:30:00Z',
    eta: '2025-11-10T16:00:00Z',
    billing: { shippingFee: 42.50, customsFee: 0, vat: 85.50, total: 128.00, currency: 'EUR', status: 'PAID' },
    iossNumber: 'IM1234567890'
  },
  {
    id: 'ORD002',
    trackingNumber: 'DPD20251102002',
    sellerId: 'S001',
    sellerName: 'Guangzhou Garments',
    status: 'OUT_FOR_DELIVERY',
    statusText: 'Out for delivery in Paris',
    serviceType: 'EU_EXPRESS',
    cargo: { description: 'Custom Apparel', hsCode: '6109.10.00', quantity: 50, weight: 15.5, volume: 0.1, declaredValue: 1200, currency: 'USD' },
    recipient: { name: 'Marie Dubois', country: 'France', city: 'Paris', postalCode: '75001', address: '1 Rue de Rivoli', phone: '+33-1-23456789', email: 'marie@example.fr' },
    timeline: [
      { timestamp: '2025-11-12T09:00:00Z', status: 'OUT_FOR_DELIVERY', location: 'Paris, France', description: 'Out for final delivery.', coordinates: [48.8647, 2.3490] },
      { timestamp: '2025-11-11T20:00:00Z', status: 'AT_DISTRIBUTION_CENTER', location: 'Antwerp, Belgium', description: 'Processed at distribution center.', coordinates: [51.2601, 4.3813] },
      { timestamp: '2025-11-10T08:00:00Z', status: 'ARRIVED_ANTWERP', location: 'Antwerp, Belgium', description: 'Train arrived at Port of Antwerp.', coordinates: [51.2601, 4.3813] },
      { timestamp: '2025-11-05T08:30:00Z', status: 'DEPARTED_CHENGDU', location: 'Chengdu, China', description: 'Train TR-001 departed.', coordinates: [30.8789, 104.2467] },
      { timestamp: '2025-11-02T10:15:00Z', status: 'ORDER_CREATED', location: 'Guangzhou, China', description: 'Order created.', coordinates: [23.1291, 113.2644] },
    ],
    trainInfo: { trainNumber: 'TR-001', departureDate: '2025-11-04', containerNumber: 'CNT-001-24' },
    createdAt: '2025-11-02T10:15:00Z',
    eta: '2025-11-12T17:00:00Z',
    billing: { shippingFee: 131.75, customsFee: 0, vat: 240.00, total: 371.75, currency: 'EUR', status: 'PAID' },
    iossNumber: 'IM1234567890'
  },
  {
    id: 'ORD003',
    trackingNumber: 'DPD20251103003',
    sellerId: 'S001',
    sellerName: 'Yiwu Small Commodities',
    status: 'IN_TRANSIT_RUSSIA',
    statusText: 'Train crossing Russia, on schedule',
    serviceType: 'EU_EXPRESS',
    cargo: { description: 'Home Decor', hsCode: '9403.60.80', quantity: 10, weight: 25.0, volume: 0.2, declaredValue: 800, currency: 'USD' },
    recipient: { name: 'Luca Rossi', country: 'Italy', city: 'Rome', postalCode: '00184', address: 'Via dei Fori Imperiali', phone: '+39-06-1234567', email: 'luca@example.it' },
    timeline: [
      { timestamp: '2025-11-09T05:00:00Z', status: 'IN_TRANSIT_RUSSIA', location: 'Yekaterinburg, Russia', description: 'In transit through Russia.', coordinates: [56.8389, 60.6057] },
      { timestamp: '2025-11-07T12:00:00Z', status: 'EXIT_CHINA', location: 'Alashankou Pass', description: 'Exited China customs.', coordinates: [45.1789, 82.5632] },
      { timestamp: '2025-11-05T08:30:00Z', status: 'DEPARTED_CHENGDU', location: 'Chengdu, China', description: 'Train TR-001 departed.', coordinates: [30.8789, 104.2467] },
      { timestamp: '2025-11-03T14:00:00Z', status: 'ORDER_CREATED', location: 'Yiwu, China', description: 'Order created.', coordinates: [29.3152, 120.0763] },
    ],
    trainInfo: { trainNumber: 'TR-002', departureDate: '2025-11-05', containerNumber: 'CNT-002-01' },
    createdAt: '2025-11-03T14:00:00Z',
    eta: '2025-11-15T12:00:00Z',
    billing: { shippingFee: 212.50, customsFee: 0, vat: 160.00, total: 372.50, currency: 'EUR', status: 'PAID' },
    iossNumber: 'IM1234567890'
  },
  {
    id: 'ORD004',
    trackingNumber: 'DPD20251104004',
    sellerId: 'S001',
    sellerName: 'Shanghai Electronics',
    status: 'LOADED_TRAIN',
    statusText: 'Loaded on train, awaiting departure',
    serviceType: 'EU_EXPRESS',
    cargo: { description: 'Drones', hsCode: '8802.20.00', quantity: 5, weight: 7.2, volume: 0.05, declaredValue: 2500, currency: 'USD' },
    recipient: { name: 'James Smith', country: 'United Kingdom', city: 'London', postalCode: 'SW1A 0AA', address: '1 Buckingham Palace', phone: '+44-20-12345678', email: 'james@example.co.uk' },
    timeline: [
      { timestamp: '2025-11-10T16:00:00Z', status: 'LOADED_TRAIN', location: 'Chengdu, China', description: 'Loaded on train TR-002.', coordinates: [30.8789, 104.2467] },
      { timestamp: '2025-11-09T11:00:00Z', status: 'CUSTOMS_CLEARED', location: 'Chengdu, China', description: 'Export customs cleared.', coordinates: [30.8789, 104.2467] },
      { timestamp: '2025-11-08T09:30:00Z', status: 'HUB_RECEIVED', location: 'Chengdu, China', description: 'Received at consolidation hub.', coordinates: [30.8789, 104.2467] },
      { timestamp: '2025-11-04T09:00:00Z', status: 'ORDER_CREATED', location: 'Shanghai, China', description: 'Order created.', coordinates: [31.2304, 121.4737] },
    ],
    trainInfo: { trainNumber: 'TR-002', departureDate: '2025-11-11', containerNumber: 'CNT-002-02' },
    createdAt: '2025-11-04T09:00:00Z',
    eta: '2025-11-23T12:00:00Z',
    billing: { shippingFee: 61.20, customsFee: 0, vat: 500.00, total: 561.20, currency: 'EUR', status: 'PAID' },
  },
   {
    id: 'ORD005',
    trackingNumber: 'DPD20251105005',
    sellerId: 'S001',
    sellerName: 'Shenzhen Tech Co.',
    status: 'HUB_RECEIVED',
    statusText: 'Received at hub, pending consolidation',
    serviceType: 'AFRICA_ECONOMY',
    cargo: { description: 'Solar Panels', hsCode: '8541.40.00', quantity: 20, weight: 180, volume: 1.5, declaredValue: 4000, currency: 'USD' },
    recipient: { name: 'Fatima Al Fassi', country: 'Morocco', city: 'Casablanca', postalCode: '20250', address: '1 Blvd de la Corniche', phone: '+212-522-123456', email: 'fatima@example.ma' },
    timeline: [
        { timestamp: '2025-11-11T14:30:00Z', status: 'HUB_RECEIVED', location: 'Chengdu, China', description: 'Received at consolidation hub.', coordinates: [30.8789, 104.2467] },
        { timestamp: '2025-11-05T11:00:00Z', status: 'ORDER_CREATED', location: 'Shenzhen, China', description: 'Order created.', coordinates: [22.5431, 114.0579] }
    ],
    trainInfo: { trainNumber: 'TR-003', departureDate: '2025-11-18', containerNumber: 'CNT-003-01' },
    createdAt: '2025-11-05T11:00:00Z',
    eta: '2025-12-15T12:00:00Z',
    billing: { shippingFee: 756.00, customsFee: 120.00, vat: 800.00, total: 1676.00, currency: 'EUR', status: 'UNPAID' },
  }
];

export const mockTickets: Ticket[] = [
    {
        id: 'T1024',
        type: 'DELAY',
        submitter: 'Yiwu Small Commodities',
        priority: 'High',
        status: 'Pending',
        slaRemaining: '45 minutes',
        orderId: 'DPD20251103003',
        description: 'Order status has not updated in 3 days. Customer is asking for an update.',
        createdAt: '2025-11-12T14:30:00Z',
        responses: []
    },
    {
        id: 'T1025',
        type: 'DOCUMENT',
        submitter: 'Shanghai Electronics',
        priority: 'Medium',
        status: 'In Progress',
        slaRemaining: '2 hours',
        orderId: 'DPD20251104004',
        description: 'The commercial invoice I uploaded has the wrong value. Can I replace it?',
        createdAt: '2025-11-12T11:00:00Z',
        responses: [{ author: 'Li Na', content: 'Please upload the corrected document and I will attach it to the customs declaration.', timestamp: '2025-11-12T11:15:00Z' }]
    },
    {
        id: 'T1026',
        type: 'BILLING',
        submitter: 'Shenzhen Tech Co.',
        priority: 'Low',
        status: 'Resolved',
        slaRemaining: 'N/A',
        orderId: 'DPD20251105005',
        description: 'Why is the VAT for my shipment to Morocco so high?',
        createdAt: '2025-11-11T18:00:00Z',
        responses: [{ author: 'Li Na', content: 'The VAT is calculated based on Moroccan import regulations. I have attached the detailed breakdown for your reference.', timestamp: '2025-11-11T18:30:00Z' }]
    }
];

export const mockTrains: Train[] = [
    { id: 'TR-001', departureDate: '2025-11-04', status: 'IN_TRANSIT', currentLocation: 'Russia', loadFactor: 95 },
    { id: 'TR-002', departureDate: '2025-11-11', status: 'LOADING', currentLocation: 'Chengdu Hub', loadFactor: 88 },
    { id: 'TR-003', departureDate: '2025-11-18', status: 'SCHEDULED', currentLocation: 'Chengdu Hub', loadFactor: 20 }
];


export const shippingRates = {
  EU_EXPRESS: {
    baseRate: 8.5, // €/kg
    countries: {
      'Germany': 1.0,
      'France': 1.1,
      'United Kingdom': 1.2,
      'Italy': 1.15
    }
  },
  AFRICA_ECONOMY: {
    baseRate: 4.2,
    countries: {
      'Morocco': 1.0,
      'Algeria': 1.05,
      'Senegal': 1.15
    }
  }
};
