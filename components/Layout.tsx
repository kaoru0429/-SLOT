import React, { ReactNode, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';

const icons: { [key: string]: React.ReactNode } = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  createOrder: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  myOrders: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  documents: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  billing: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  consolidationHub: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  customs: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  trainManagement: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V4a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1zm-1 5v-2H4v2h8zm6-11H9.5a.5.5 0 000 1H18v5.5a2.5 2.5 0 002.5 2.5h0a2.5 2.5 0 002.5-2.5V11a.5.5 0 00-.5-.5H19z" />
    </svg>
  ),
  distributionCenter: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  tickets: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2H5z" />
    </svg>
  ),
  quickLookup: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  knowledgeBase: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

interface NavItem {
  path: string;
  labelKey: string;
  icon: string;
}

const navConfig: Record<Role, NavItem[]> = {
  seller: [
    { path: '/seller/dashboard', labelKey: 'dashboard', icon: 'dashboard' },
    { path: '/seller/orders/create', labelKey: 'createOrder', icon: 'createOrder' },
    { path: '/seller/orders', labelKey: 'myOrders', icon: 'myOrders' },
    { path: '/seller/documents', labelKey: 'documents', icon: 'documents' },
    { path: '/seller/billing', labelKey: 'billing', icon: 'billing' },
  ],
  operations: [
    { path: '/operations/dashboard', labelKey: 'dashboard', icon: 'dashboard' },
    { path: '/operations/hub', labelKey: 'consolidationHub', icon: 'consolidationHub' },
    { path: '/operations/customs', labelKey: 'customs', icon: 'customs' },
    { path: '/operations/trains', labelKey: 'trainManagement', icon: 'trainManagement' },
    { path: '/operations/distribution', labelKey: 'distributionCenter', icon: 'distributionCenter' },
  ],
  service: [
    { path: '/service/dashboard', labelKey: 'dashboard', icon: 'dashboard' },
    { path: '/service/tickets', labelKey: 'tickets', icon: 'tickets' },
    { path: '/service/lookup', labelKey: 'quickLookup', icon: 'quickLookup' },
    { path: '/service/kb', labelKey: 'knowledgeBase', icon: 'knowledgeBase' },
  ],
};

const DpdLogo: React.FC = () => (
    <div className="flex items-center gap-3">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0L40 10V30L20 40L0 30V10L20 0Z" fill="#DC0032" />
            <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" fill="white" />
            <path d="M20 8L32 14V26L20 32L8 26V14L20 8Z" fill="#DC0032" />
        </svg>
        <span className="font-bold text-2xl text-dpd-dark-gray tracking-tighter">dpd</span>
    </div>
);

const Header: React.FC = () => {
    const { currentRole, setCurrentRole, language, setLanguage, t } = useAppContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleRoleChange = (role: Role) => {
        setCurrentRole(role);
        setDropdownOpen(false);
    };

    const roleDisplayNames: Record<Role, string> = {
        seller: t('seller'),
        operations: t('operations'),
        service: t('customerService'),
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20 border-b">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <DpdLogo />
                        <span className="hidden sm:block ml-4 text-dpd-dark-gray font-medium">{t('dpdPlatform')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center p-2 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition shadow-sm"
                            >
                                <span className="font-semibold ml-1 mr-2 text-dpd-dark-gray">{roleDisplayNames[currentRole]}</span>
                                <svg className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                                    <button onClick={() => handleRoleChange('seller')} className="block w-full text-left px-4 py-2 text-sm text-dpd-dark-gray hover:bg-gray-100">{t('seller')}</button>
                                    <button onClick={() => handleRoleChange('operations')} className="block w-full text-left px-4 py-2 text-sm text-dpd-dark-gray hover:bg-gray-100">{t('operations')}</button>
                                    <button onClick={() => handleRoleChange('service')} className="block w-full text-left px-4 py-2 text-sm text-dpd-dark-gray hover:bg-gray-100">{t('customerService')}</button>
                                </div>
                            )}
                        </div>
                         <div className="flex items-center space-x-2 text-sm">
                            <button onClick={() => setLanguage('en')} className={`font-semibold transition ${language === 'en' ? 'text-dpd-red' : 'text-gray-500 hover:text-dpd-dark-gray'}`}>EN</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('zh')} className={`font-semibold transition ${language === 'zh' ? 'text-dpd-red' : 'text-gray-500 hover:text-dpd-dark-gray'}`}>中文</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};


const Sidebar: React.FC = () => {
  const { currentRole, t } = useAppContext();
  
  const navItems = navConfig[currentRole];
  const activeStyle = "bg-dpd-red text-white";
  const defaultStyle = "text-dpd-dark-gray hover:bg-red-50 hover:text-dpd-red";

  return (
    <aside className="bg-white w-64 flex-shrink-0 border-r">
        <div className="flex flex-col h-full">
            <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map(item => (
                <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-semibold rounded-md ${isActive ? activeStyle : defaultStyle}`
                }
                >
                <span className="mr-3">{icons[item.icon]}</span>
                {t(item.labelKey)}
                </NavLink>
            ))}
            </nav>
        </div>
    </aside>
  );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;