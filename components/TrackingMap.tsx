import React, { useEffect, useRef } from 'react';
import { TimelineEvent, Order } from '../types';
import { useAppContext } from '../context/AppContext';

declare const L: any; // Using Leaflet from CDN

interface TrackingMapProps {
  events: TimelineEvent[];
  order: Order;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ events, order }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { t } = useAppContext();

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([45, 60], 3);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
    
    if (mapRef.current && events.length > 0) {
      // Clear existing layers
      mapRef.current.eachLayer((layer: any) => {
        if (!!layer.toGeoJSON) {
          mapRef.current.removeLayer(layer);
        }
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png').addTo(mapRef.current);


      const points = events.map(e => e.coordinates).reverse();
      
      const routePolyline = L.polyline(points, { color: '#DC0032' }).addTo(mapRef.current);
      mapRef.current.fitBounds(routePolyline.getBounds().pad(0.1));

      events.forEach((event, index) => {
        const isCurrentLocation = index === 0;
        const markerIcon = L.divIcon({
          className: `custom-div-icon ${isCurrentLocation ? 'current-location-marker' : ''}`,
          html: `<div style="background-color:${isCurrentLocation ? '#DC0032' : '#424143'};" class="marker-pin"></div><i></i>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42]
        });
        
        const marker = L.marker(event.coordinates, { icon: markerIcon }).addTo(mapRef.current);
        const popupContent = `
          <div style="font-family: sans-serif; font-size: 14px; line-height: 1.5;">
            <p style="font-weight: bold; margin: 0 0 4px 0; font-size: 16px;">${event.location}</p>
            <p style="margin: 0 0 8px 0; color: #555;">${event.description}</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;">
            <p style="font-weight: bold; margin: 0 0 4px 0;">${t('shipmentDetails')}</p>
            <p style="margin: 0;"><b>${t('popupRecipient')}:</b> ${order.recipient.name}</p>
            <p style="margin: 0;"><b>${t('popupWeight')}:</b> ${order.cargo.weight} kg</p>
            <p style="margin: 0;"><b>${t('popupValue')}:</b> ${order.cargo.declaredValue} ${order.cargo.currency}</p>
          </div>
        `;
        marker.bindPopup(popupContent);
      });
    }

  }, [events, order, t]);

  return (
    <>
        <style>{`
            .custom-div-icon .marker-pin {
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                position: absolute;
                transform: rotate(-45deg);
                left: 50%;
                top: 50%;
                margin: -15px 0 0 -15px;
            }
            .custom-div-icon .marker-pin::after {
                content: '';
                width: 24px;
                height: 24px;
                margin: 3px 0 0 3px;
                background: #fff;
                position: absolute;
                border-radius: 50%;
            }
            .current-location-marker .marker-pin {
                animation: bounce 1s infinite;
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0) rotate(-45deg); }
                50% { transform: translateY(-10px) rotate(-45deg); }
            }
        `}</style>
        <div ref={mapContainerRef} className="h-96 w-full rounded-lg z-10"></div>
    </>
  );
};

export default TrackingMap;
