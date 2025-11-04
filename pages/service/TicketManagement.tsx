import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Ticket } from '../../types';

const TicketManagement: React.FC = () => {
    const { tickets, resolveTicket, t } = useAppContext();
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('ticketMgmtTitle')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md h-fit">
                    <h2 className="text-lg font-semibold text-dpd-dark-gray mb-2">{t('ticketQueue')}</h2>
                    <ul className="space-y-1">
                        {tickets.map(ticket => {
                            const isSelected = selectedTicket?.id === ticket.id;
                            return (
                                <li 
                                    key={ticket.id} 
                                    onClick={() => setSelectedTicket(ticket)} 
                                    className={`p-3 cursor-pointer rounded-md transition-colors ${isSelected ? 'bg-dpd-red text-white' : 'hover:bg-gray-100'}`}
                                >
                                    <p className={`font-medium ${isSelected ? 'text-white' : 'text-dpd-dark-gray'}`}>#{ticket.id} - {ticket.type}</p>
                                    <p className={`text-sm ${isSelected ? 'text-red-200' : 'text-gray-500'}`}>{ticket.submitter}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    {selectedTicket ? (
                        <div className="space-y-4 text-dpd-dark-gray">
                            <h2 className="text-xl font-semibold">Ticket #{selectedTicket.id}</h2>
                            <p><strong>{t('orderNumber')}:</strong> {selectedTicket.orderId}</p>
                            <p><strong>{t('description')}:</strong> {selectedTicket.description}</p>
                            <textarea placeholder={t('typeResponse')} rows={5} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                            <button onClick={() => resolveTicket(selectedTicket.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">{t('sendResolve')}</button>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-16">{t('selectTicketToView')}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketManagement;