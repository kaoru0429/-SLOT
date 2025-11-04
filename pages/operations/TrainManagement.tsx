
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Train } from '../../types';
import { formatDate } from '../../utils/helpers';

const TrainManagement: React.FC = () => {
    const { t, trains, language } = useAppContext();

    const getStatusBadge = (status: Train['status']) => {
        switch (status) {
            case 'IN_TRANSIT':
                return 'bg-blue-100 text-blue-800';
            case 'LOADING':
                return 'bg-yellow-100 text-yellow-800';
            case 'SCHEDULED':
                return 'bg-gray-100 text-dpd-dark-gray';
            default:
                return 'bg-gray-100 text-dpd-dark-gray';
        }
    };
    
    const getStatusText = (status: Train['status']) => {
        switch(status) {
            case 'IN_TRANSIT': return t('inTransit');
            case 'LOADING': return t('loading');
            case 'SCHEDULED': return t('scheduled');
        }
    }
    
    const getLoadFactorColor = (factor: number) => {
        if (factor >= 80) return 'bg-green-500';
        if (factor >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-dpd-dark-gray">{t('trainMgmtTitle')}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-dpd-dark-gray mb-4">{t('trainSchedule')}</h2>
                <ul className="space-y-3">
                    {trains.map(train => (
                         <li key={train.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="font-medium text-dpd-dark-gray">
                                <span className="text-dpd-red">{train.id}</span> - {t('departure')}: {formatDate(train.departureDate, language)}
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(train.status)}`}>
                                {getStatusText(train.status)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold text-dpd-dark-gray p-6">{t('currentTrainStatus')}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('trainId')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('departure')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('currentLocation')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('loadFactor')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-dpd-dark-gray uppercase">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {trains.map(train => (
                                <tr key={train.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dpd-dark-gray">{train.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{formatDate(train.departureDate, language)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(train.status)}`}>
                                            {getStatusText(train.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">{train.currentLocation}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dpd-dark-gray">
                                        <div className="flex items-center">
                                            <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                                <div 
                                                    className={`h-2.5 rounded-full ${getLoadFactorColor(train.loadFactor)}`}
                                                    style={{ width: `${train.loadFactor}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-medium">{train.loadFactor}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="bg-white text-dpd-dark-gray px-4 py-2 text-xs rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition shadow-sm">{t('manage')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrainManagement;
