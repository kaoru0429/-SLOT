
import React from 'react';
import { TimelineEvent } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatDateTime } from '../utils/helpers';

interface OrderTimelineProps {
  events: TimelineEvent[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ events }) => {
  const { language, getStatusDef } = useAppContext();

  return (
    <div className="space-y-8">
      {events.map((event, index) => {
        const statusDef = getStatusDef(event.status);
        const borderColor = statusDef.color.split(' ')[1]?.replace('text-', 'border-') || 'border-gray-500';

        return (
          <div key={index} className="flex">
            <div className="flex flex-col items-center mr-4">
              <div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${borderColor}`}>
                  <span className="text-xl">{statusDef.icon}</span>
                </div>
              </div>
              {index !== events.length - 1 && <div className="w-px h-full bg-gray-300"></div>}
            </div>
            <div className="pb-8">
              <p className="mb-1 text-sm font-semibold text-gray-800">
                {statusDef.text} - <span className="font-normal text-gray-500">{event.location}</span>
              </p>
              <p className="text-xs text-gray-400">{formatDateTime(event.timestamp, language)}</p>
              <p className="mt-1 text-sm text-gray-600">{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
