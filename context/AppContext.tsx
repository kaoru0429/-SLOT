
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Role, Order, Ticket, StatusDefinition, Train } from '../types';
import { mockOrders, mockTickets, mockUsers, statusDefinitions, mockTrains } from '../data/mockData';
import { locales } from '../i18n/locales';

export type Language = 'en' | 'zh';

interface AppContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  users: typeof mockUsers;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (trackingNumber: string, newStatus: string, newStatusText: string, newTimelineEvent: any) => void;
  tickets: Ticket[];
  resolveTicket: (ticketId: string) => void;
  trains: Train[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getStatusDef: (statusKey: string) => StatusDefinition;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('seller');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [language, setLanguage] = useState<Language>('zh');

  const t = useCallback((key: string): string => {
    return locales[language][key as keyof typeof locales[Language]] || key;
  }, [language]);
  
  const getStatusDef = useCallback((statusKey: string): StatusDefinition => {
    const def = statusDefinitions[statusKey] || { icon: '?', color: 'bg-gray-100 text-gray-800', phase: 'EXCEPTION' };
    return {
        ...def,
        text: t(`status_${statusKey}`) || statusKey
    };
  }, [t]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
  }, []);

  const updateOrderStatus = useCallback((trackingNumber: string, newStatus: string, newStatusText: string, newTimelineEvent: any) => {
    setOrders(prevOrders => prevOrders.map(o => 
      o.trackingNumber === trackingNumber 
        ? { ...o, status: newStatus, statusText: newStatusText, timeline: [newTimelineEvent, ...o.timeline] }
        : o
    ));
  }, []);

  const resolveTicket = useCallback((ticketId: string) => {
    setTickets(prevTickets => prevTickets.map(t =>
        t.id === ticketId ? { ...t, status: 'Resolved' } : t
    ));
  }, []);

  const value = {
    currentRole,
    setCurrentRole,
    users: mockUsers,
    orders,
    addOrder,
    updateOrderStatus,
    tickets,
    resolveTicket,
    trains,
    language,
    setLanguage,
    t,
    getStatusDef,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
