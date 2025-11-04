import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconBgColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-dpd-dark-gray">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;