
import React, { useEffect } from 'react';
import { AppNotification } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from './Icons';

interface NotificationItemProps {
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  let bgColor = 'bg-sky-600';
  let textColor = 'text-sky-100';
  let IconComponent = InformationCircleIcon;

  switch (notification.type) {
    case 'success':
      bgColor = 'bg-green-600';
      textColor = 'text-green-100';
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      bgColor = 'bg-red-600';
      textColor = 'text-red-100';
      IconComponent = XCircleIcon;
      break;
    case 'info':
      bgColor = 'bg-sky-600';
      textColor = 'text-sky-100';
      IconComponent = InformationCircleIcon;
      break;
  }

  return (
    <div 
        className={`relative flex items-center p-3 md:p-4 mb-3 rounded-md shadow-lg ${bgColor} ${textColor} ring-1 ring-white/20 transition-all duration-500 ease-out animate-fade-in-down`}
        role="alert"
        style={{ animationDelay: '0.1s' }} // Slight delay for smoother entry if multiple appear
    >
      <IconComponent className="w-5 h-5 md:w-6 md:h-6 mr-3 flex-shrink-0" />
      <p className="text-sm md:text-base flex-grow">{notification.message}</p>
      <button
        onClick={() => onDismiss(notification.id)}
        className={`ml-3 p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors ${textColor}`}
        aria-label="Dismiss notification"
      >
        <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
};

interface NotificationAreaProps {
  notifications: AppNotification[];
  onRemoveNotification: (id: string) => void;
}

const NotificationArea: React.FC<NotificationAreaProps> = ({ notifications, onRemoveNotification }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-xs md:max-w-sm">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onDismiss={onRemoveNotification} 
        />
      ))}
    </div>
  );
};

export default NotificationArea;