
import React from 'react';

// Props for all icons
export interface IconProps {
  className?: string;
  // Allow all standard SVG props like fill, stroke, etc.
  [key: string]: any; 
}

export const InfoIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const WarningIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

// This KeyIcon is for general information about keys
export const KeyIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const EyeSlashIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.575M2.25 2.25l19.5 19.5" />
  </svg>
);

export const DocumentDuplicateIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125V17.25m0-10.5h2.25m-2.25 0h-2.25m0 0V5.625c0-.621.504-1.125 1.125-1.125H18a1.125 1.125 0 011.125 1.125v12.75a1.125 1.125 0 01-1.125 1.125h-2.25" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ExclamationTriangleIcon: React.FC<IconProps> = ({ className, ...props }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const ArrowUpTrayIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const ArrowUpCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ArrowDownCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className, ...props }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75l-1.25-1.75L13.75 12l1.75-1.25L17 8.75l1.25 1.75L20.25 12l-1.75 1.25z" />
</svg>
);

// Wallet Type Icons
export const FireIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6c.001.03.003.06.005.09A8.252 8.252 0 0012 3a8.25 8.25 0 00-2.348 15.963C11.137 18.156 12 16.896 12 15.375c0-1.52-.863-2.78-2.037-3.516A8.287 8.287 0 009 9.6a8.942 8.942 0 01-.984-3.238 1.493 1.493 0 012.21-1.257 8.942 8.942 0 013.136.099c.996.264 1.75.83 2.146 1.762a8.25 8.25 0 01-.148-.002z" />
  </svg>
);

export const SnowflakeIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3.375m0 0V3.375M12 3.375l3.563 2.063M12 3.375L8.437 5.438m11.125 3.124L12 12m7.562-3.438L12 12m0 0L4.438 8.562M12 12l3.563 2.063M12 17.625l3.563-2.063M12 17.625L8.437 15.562m11.125-3.125L12 12M4.438 15.562L12 12m0 9.375a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM12 6.75a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM5.25 12a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM18.75 12a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM7.313 17.813a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM16.687 6.187a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM16.687 17.813a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM7.313 6.187a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
  </svg>
);

export const CpuChipIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3H20.25M3.75 3h16.5M15 3v6.75A2.25 2.25 0 0112.75 12H11.25A2.25 2.25 0 019 9.75V3M15 3H9m6 0v6.75m0-6.75V3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 6.375h13.5M5.25 8.625h13.5M5.25 10.875h13.5M5.25 13.125h13.5M5.25 15.375H11.25m3 0h4.5m-15 3h15M3.75 20.25h16.5" />
  </svg>
);

export const ComputerDesktopIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
  </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

// Sound Toggle Icons
export const SpeakerWaveIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 10.636a9 9 0 010 2.728M17.434 9.079a5.25 5.25 0 010 5.842M15.75 12a3.75 3.75 0 01-7.5 0M4.873 9.396A12.75 12.75 0 003.75 12c0 .99.124 1.952.356 2.855M2.25 12c0 4.969 3.213 9.172 7.5 10.375v-2.5A7.875 7.875 0 012.25 12zm0 0A7.875 7.875 0 019.75 4.125v-2.5C5.463 2.828 2.25 7.031 2.25 12z" />
  </svg>
);

export const SpeakerXMarkIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L21 6m0 0l-3.75 3.75M21 6H9.75M9 12a3.75 3.75 0 01-7.5 0M4.873 9.396A12.75 12.75 0 003.75 12c0 .99.124 1.952.356 2.855M2.25 12c0 4.969 3.213 9.172 7.5 10.375v-2.5A7.875 7.875 0 012.25 12zm0 0A7.875 7.875 0 019.75 4.125v-2.5C5.463 2.828 2.25 7.031 2.25 12z" />
  </svg>
);

// Faucet Icon
export const GiftIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75v16.5M12 3.75L9.75 6H7.5V3.75M12 3.75l2.25 2.25H16.5V3.75M3.75 9v11.25A2.25 2.25 0 006 22.5h12a2.25 2.25 0 002.25-2.25V9M3.75 9H20.25M3.75 9h16.5m-16.5 0V6A2.25 2.25 0 016 3.75h1.5m9.75 0h1.5A2.25 2.25 0 0120.25 6v3" />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Navigation Icons
export const HomeIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

// Renamed from original KeyIcon to avoid conflict with info KeyIcon. This is for navigation.
export const KeyNavIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);


export const WalletIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v9A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5V12zM18.75 12a.375.375 0 11-1.5 0 .375.375 0 011.5 0z" />
  </svg>
);

export const BeakerIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25l-2.06-.938m0 0l-.736-3.313M17.44 9.999l2.06.938M19.5 14.25v2.25c0 .621-.504 1.125-1.125 1.125H5.625c-.621 0-1.125-.504-1.125-1.125v-2.25m15.375 0M4.125 14.25L3 13.5m0 0l.737-3.313M4.125 9.999L3 13.5m0-3.562A7.478 7.478 0 015.625 3h12.75c1.133 0 2.16.43 2.943 1.158M12 6.75v6.75m0 0A3.375 3.375 0 0115.375 15H8.625a3.375 3.375 0 013.375-1.5z" />
  </svg>
);

// General UI Icons
export const ArrowRightCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LightBulbIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0M12 4.875A2.625 2.625 0 1012 10a2.625 2.625 0 000-5.125zM9.375 1.5A2.625 2.625 0 0012 4.125v1.5c0 .621.504 1.125 1.125 1.125h0c.621 0 1.125-.504 1.125-1.125v-1.5A2.625 2.625 0 009.375 1.5zM12 18.375V21m-3.75-2.625A12.064 12.064 0 0112 15.375a12.064 12.064 0 013.75 2.625M12 18.375h0" />
  </svg>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
  </svg>
);

export const MagnifyingGlassIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const MagnifyingGlassCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const GlossaryIcon: React.FC<IconProps> = ({ className, ...props }) => ( // Was BookOpenIcon, aliased for clarity
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m1.5 0H21m-1.5 0H3m18 0h-1.5m-15 0h1.5m15 0A12.75 12.75 0 112.25 12a12.75 12.75 0 0119.5 0z" />
  </svg>
);

export const ChatBubbleOvalLeftEllipsisIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75A1.5 1.5 0 0011.25 5.25v1.5a1.5 1.5 0 001.5 1.5H15a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5h-2.25zM21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 15.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 14.25h7.5M8.25 11.25h.008v.008H8.25v-.008zM12 11.25h.008v.008H12v-.008zM15.75 11.25h.008v.008H15.75v-.008zM5.11 17.15A10.45 10.45 0 013.75 12c0-2.36.766-4.542 2.066-6.346" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.89 17.15A10.45 10.45 0 0020.25 12c0-2.36-.766-4.542-2.066-6.346" />
  </svg>
);

export const AcademicCapIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

export const BuildingStorefrontIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11.25M4.53 15.084A8.959 8.959 0 013 11.25c0-1.795.599-3.452 1.589-4.811M12 21h7.5M12 21H4.5M3.75 11.25C3.75 7.507 7.507 4.5 11.25 4.5h1.5C16.493 4.5 19.5 7.507 19.5 11.25M20.916 15.084A8.959 8.959 0 0021 11.25c0-1.795-.599-3.452-1.589-4.811M15 11.25H9M15 11.25a3 3 0 013 3M9 11.25a3 3 0 00-3 3m6 0V11.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.832 9.467A8.977 8.977 0 018.25 6H12m0 0V4.5m0 1.5V6m0-1.5H8.25m3.75 0H12m0 0V6m0 1.5V4.5m0-1.5v3M12 6h3.75a8.977 8.977 0 013.418 3.467" />
  </svg>
);


export const ArrowsRightLeftIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18M16.5 3L21 7.5m0 0L16.5 12M21 7.5H3" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const CubeTransparentIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

export const LinkIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export const CommandLineIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

export const SignatureIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 6v0A2.25 2.25 0 014.5 3.75h3.75m0 0A2.25 2.25 0 0110.5 6m3.75-3.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5zm0 12.75v.008c0 .896.724 1.624 1.624 1.624h.001A1.624 1.624 0 0018.375 18v-.008c0-.896-.724-1.624-1.624-1.624H15a1.624 1.624 0 00-1.624 1.624v.008zM4.5 12h.008v.008H4.5v-.008zm3.75 0h.008v.008H8.25v-.008zm3.75 0h.008v.008H12v-.008zm3.75 0h.008v.008H15.75v-.008zm3.75 0h.008v.008H19.5v-.008z" />
  </svg>
);


export const UserGroupIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-3.741m-2.55 3.741a3 3 0 01-3.741 0m2.55 0a3 3 0 00-3.741 0m-9.015-3.741a3 3 0 010-3.741m3.741 3.741a3 3 0 000-3.741m-3.741-2.55a3 3 0 013.741 0m0 0a3 3 0 013.741 0M2.279 16.5a3 3 0 010-3.741m18.902 3.741a3 3 0 000-3.741M12 11.25a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const AdjustmentsHorizontalIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 6v0A2.25 2.25 0 014.5 3.75h3.75M10.5 6a2.25 2.25 0 002.25 2.25h3.75m0 0A2.25 2.25 0 0121 6v0A2.25 2.25 0 0118.75 3.75h-3.75m0 0h.008v.008h-.008V3.75zm0 16.5h.008v.008h-.008v-.008zm0 0H6.75m0 0A2.25 2.25 0 014.5 18v0A2.25 2.25 0 016.75 15.75h3.75m0 0A2.25 2.25 0 0113.5 18v0A2.25 2.25 0 0115.75 15.75h3.75m0 0h-.008v.008h.008v-.008z" />
  </svg>
);

export const ShieldExclamationIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 9.75a9 9 0 110-19.5 9 9 0 010 19.5zm0-12.75h.008v.008H12v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M9.607 4.015A11.95 11.95 0 003 9.75c0 5.592 3.824 10.29 9 11.623 2.128-.535 4.02-1.63 5.485-3.11M3 9.75L4.726 6A9.014 9.014 0 0112 3c1.077 0 2.1.196 3.032.55" />
  </svg>
);

export const CheckBadgeIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-5.332 0c-.963-.678-1.593-1.8-1.593-3.068s.63-2.39 1.593-3.068a3.745 3.745 0 015.332 0c.963.678 1.593 1.8 1.593 3.068z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const MinusCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SwitchHorizontalIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-1.5-1.5L21 7.5m0 0L16.5 3M21 7.5H3" />
  </svg>
);

export const BlockchainIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /> {/* Simplified representation */}
  </svg>
);

export const NewspaperIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.625a2.25 2.25 0 01-2.25-2.25V6.375c0-.621.504-1.125 1.125-1.125H9M12 3.75L12 6M12 6H9m3 0V3.75M9 6v1.5M15 6v1.5m0-1.5V3.75M3 6.375L3 9m0-2.625h1.5M15 12V6.375m0 5.625v1.5m0-1.5V9.375M12 15V9.375" />
  </svg>
);

export const RocketLaunchIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a12.028 12.028 0 00-5.84 0m5.84 0H14.12a12.028 12.028 0 015.84 0M12 2.25C12 2.25 12 2.25 12 2.25m0 0A12.012 12.012 0 004.162 7.152l-.46.46m-.46-.46a12.012 12.012 0 0116.632-4.693l.46-.46m-.46.46C19.788 2.308 19.349 2.25 19.349 2.25M4.162 7.152c0 0 0 0 0 0M4.162 7.152A12.012 12.012 0 014.622 19.838l.46.46m-.46-.46C2.25 19.788 2.25 19.349 2.25 19.349m17.098 0c0 0 0 0 0 0m0 0A12.012 12.012 0 0019.349 4.622l-.46-.46m.46.46C21.75 4.212 21.75 3.651 21.75 3.651M12 2.25c-5.969 0-10.758 4.789-10.758 10.758 0 5.969 4.789 10.758 10.758 10.758 5.969 0 10.758-4.789 10.758-10.758 0-5.969-4.789-10.758-10.758-10.758zM12 6.75a.75.75 0 110 1.5.75.75 0 010 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 110 1.5.75.75 0 010 1.5z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.3" />
  </svg>
);

export const CloudArrowUpIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75m-7.5 3H4.5a2.25 2.25 0 01-2.25-2.25V15m0 0v-2.25A2.25 2.25 0 014.5 10.5h1.5v-1.5A2.25 2.25 0 018.25 6.75h7.5A2.25 2.25 0 0118 9v1.5h1.5a2.25 2.25 0 012.25 2.25v2.25m-18 0A2.25 2.25 0 004.5 19.5h15A2.25 2.25 0 0021.75 17.25v-2.25" />
  </svg>
);
