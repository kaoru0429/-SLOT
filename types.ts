
export type Role = 'seller' | 'operations' | 'service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SELLER' | 'OPERATIONS' | 'CUSTOMER_SERVICE';
}

export interface TimelineEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
  coordinates: [number, number];
}

export interface Order {
  id: string;
  trackingNumber: string;
  sellerId: string;
  sellerName: string;
  status: string;
  statusText: string;
  serviceType: 'EU_EXPRESS' | 'AFRICA_ECONOMY';
  cargo: {
    description: string;
    hsCode: string;
    quantity: number;
    weight: number; // in kg
    volume: number; // in m^3
    declaredValue: number;
    currency: 'USD' | 'EUR';
  };
  recipient: {
    name: string;
    country: string;
    city: string;
    postalCode: string;
    address: string;
    phone: string;
    email: string;
  };
  timeline: TimelineEvent[];
  trainInfo: {
    trainNumber: string;
    departureDate: string;
    containerNumber: string;
  };
  createdAt: string;
  eta: string;
  billing: {
    shippingFee: number;
    customsFee: number;
    vat: number;
    total: number;
    currency: 'EUR';
    status: 'PAID' | 'UNPAID';
  };
  iossNumber?: string;
}

export interface StatusDefinition {
  text: string;
  color: string;
  icon: string;
  phase: 'ORIGIN' | 'TRANSIT' | 'DESTINATION' | 'LAST_MILE' | 'COMPLETED' | 'EXCEPTION';
}

export interface Ticket {
    id: string;
    type: 'TRACKING' | 'DELAY' | 'CUSTOMS' | 'DOCUMENT' | 'BILLING';
    submitter: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'In Progress' | 'Resolved';
    slaRemaining: string;
    orderId: string;
    description: string;
    createdAt: string;
    responses: { author: string; content: string; timestamp: string }[];
}

export interface Train {
  id: string;
  departureDate: string;
  status: 'IN_TRANSIT' | 'LOADING' | 'SCHEDULED';
  currentLocation: string;
  loadFactor: number;
}
