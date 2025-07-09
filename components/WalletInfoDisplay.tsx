
import React, { useState } from 'react';
import { SimulatedWallet, DEFAULT_CURRENCY, WalletType } from '../types';
import { EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from './Icons';

interface WalletInfoDisplayProps {
  wallet: SimulatedWallet;
  onCopy: (textToCopy: string, itemName: string) => void;
}

const InfoRow: React.FC<{ 
  label: string; 
  value: string; 
  sensitive?: boolean; 
  isSeedPhrase?: boolean;
  onCopy: () => void;
  showCopyInitially?: boolean;
}> = ({ label, value, sensitive = false, isSeedPhrase = false, onCopy, showCopyInitially = false }) => {
  const [visible, setVisible] = useState(sensitive ? false : true);
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayValue = sensitive && !visible ? '••••••••••••••••••••••••••••••' : value;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-300">{label}:</span>
        {sensitive && (
          <button 
            onClick={() => setVisible(!visible)} 
            className="text-sky-400 hover:text-sky-300 text-sm p-1 rounded hover:bg-sky-700/50 transition-colors"
            aria-label={visible ? `Ẩn ${label}` : `Hiện ${label}`}
          >
            {visible ? <EyeSlashIcon className="w-5 h-5 inline-block mr-1"/> : <EyeIcon className="w-5 h-5 inline-block mr-1"/>} 
            {visible ? 'Ẩn' : 'Hiện'}
          </button>
        )}
      </div>
      <div className={`flex items-center p-3 rounded-md bg-slate-800 shadow-sm ring-1 ring-slate-700 ${sensitive && !visible ? 'blur-sm' : ''}`}>
        <pre className={`text-sm ${isSeedPhrase ? 'whitespace-normal break-words' : 'truncate'} flex-grow ${sensitive && !visible ? 'text-transparent select-none' : 'text-sky-300'}`}>
          {displayValue}
        </pre>
        {(visible || showCopyInitially) && (
           <button 
            onClick={handleCopyClick} 
            title={`Sao chép ${label}`} 
            aria-label={`Sao chép ${label}`}
            className="ml-2 p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-colors">
            {copied ? <CheckCircleIcon className="w-5 h-5 text-green-400"/> : <DocumentDuplicateIcon className="w-5 h-5"/>}
          </button>
        )}
      </div>
      {sensitive && visible && ( // Show warning only if sensitive info is visible
        <div className="mt-1 flex items-center text-xs text-yellow-400/90">
          <ExclamationTriangleIcon className="w-4 h-4 mr-1 flex-shrink-0"/>
          <span>Đây là thông tin <strong className="font-semibold">MÔ PHỎNG</strong>. Không bao giờ chia sẻ khóa riêng tư hoặc cụm từ khôi phục thật.</span>
        </div>
      )}
    </div>
  );
};


const WalletInfoDisplay: React.FC<WalletInfoDisplayProps> = ({ wallet, onCopy }) => {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-gradient-to-r from-green-600/80 to-emerald-600/80 rounded-lg text-center shadow-lg ring-1 ring-green-500/50">
        <span className="block text-sm text-green-200">Số dư hiện tại</span>
        <span className="block text-3xl md:text-4xl font-bold text-white tracking-wider">
          {wallet.balance.toLocaleString()} {DEFAULT_CURRENCY.symbol}
        </span>
      </div>
      
      <InfoRow 
        label="Địa chỉ Ví (Công khai)" 
        value={wallet.address} 
        onCopy={() => onCopy(wallet.address, "Địa chỉ ví")}
        showCopyInitially={true}
      />
      <InfoRow 
        label="Khóa Riêng Tư (DEMO)" 
        value={wallet.privateKey} 
        sensitive 
        onCopy={() => onCopy(wallet.privateKey, "Khóa riêng tư")}
      />
      <InfoRow 
        label="Cụm Từ Khôi Phục (DEMO - 12 từ)" 
        value={wallet.seedPhrase.join(' ')} 
        sensitive 
        isSeedPhrase
        onCopy={() => onCopy(wallet.seedPhrase.join(' '), "Cụm từ khôi phục")}
      />
      <div className="mt-1 p-3 bg-sky-800/50 rounded-md text-sky-200 text-xs flex items-center ring-1 ring-sky-700">
        <InformationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 text-sky-400"/>
        <span>Ví này là một <strong className="font-semibold">{WalletType.SIMULATED_HOT}</strong>. Khóa của bạn được quản lý trong trình duyệt cho mục đích demo.</span>
      </div>
    </div>
  );
};

export default WalletInfoDisplay;