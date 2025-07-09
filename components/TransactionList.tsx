
import React from 'react';
import { SimulatedTransaction, TransactionType, DEFAULT_CURRENCY } from '../types';
import { ArrowUpCircleIcon, ArrowDownCircleIcon, SparklesIcon, GiftIcon, MagnifyingGlassCircleIcon } from './Icons';

interface TransactionItemProps {
  tx: SimulatedTransaction;
  isNew?: boolean; // For animation
  onViewDetails: (txId: string) => void; 
}

const TransactionItem: React.FC<TransactionItemProps> = ({ tx, isNew, onViewDetails }) => {
  const isSend = tx.type === TransactionType.SEND;
  const isReceive = tx.type === TransactionType.RECEIVE;
  const isInitial = tx.type === TransactionType.INITIAL;
  const isFaucet = tx.type === TransactionType.FAUCET;

  let icon, amountColor, amountPrefix, title;

  if (isSend) {
    icon = <ArrowUpCircleIcon className="w-6 h-6 text-red-400" />;
    amountColor = 'text-red-400';
    amountPrefix = '-';
    title = `Đã gửi ${DEFAULT_CURRENCY.symbol}`;
  } else if (isReceive) {
    icon = <ArrowDownCircleIcon className="w-6 h-6 text-green-400" />;
    amountColor = 'text-green-400';
    amountPrefix = '+';
    title = `Đã nhận ${DEFAULT_CURRENCY.symbol}`;
  } else if (isFaucet) {
    icon = <GiftIcon className="w-6 h-6 text-yellow-400" />;
    amountColor = 'text-yellow-400';
    amountPrefix = '+';
    title = `Nhận từ Faucet`;
  } else { // INITIAL
    icon = <SparklesIcon className="w-6 h-6 text-sky-400" />;
    amountColor = 'text-sky-400';
    amountPrefix = '';
    title = 'Ví được tạo';
  }

  const animationClass = isNew ? 'animate-fade-in-down' : '';

  return (
    <li 
      className={`py-3 px-4 bg-slate-800 rounded-lg mb-2 shadow-md hover:bg-slate-700/70 transition-all duration-200 ${animationClass}`}
      style={{ animationFillMode: 'backwards' }} 
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
          <span className="mr-3 flex-shrink-0">{icon}</span>
          <div className="flex-grow min-w-0">
            <p className={`font-semibold ${amountColor} truncate`}>
              {title}: {amountPrefix}{tx.amount.toLocaleString()} {DEFAULT_CURRENCY.symbol}
            </p>
            <p className="text-xs text-slate-400 truncate" title={tx.description}>{tx.description}</p>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0 ml-2">
            <button 
                onClick={() => onViewDetails(tx.id)}
                title="Xem Chi Tiết Giao Dịch"
                className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-700 rounded-full transition-colors mr-2"
            >
                <MagnifyingGlassCircleIcon className="w-5 h-5"/>
            </button>
            <span className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString('vi-VN')}</span>
        </div>
      </div>
    </li>
  );
};

export interface TransactionListProps {
  transactions: SimulatedTransaction[];
  onViewDetails: (txId: string) => void; 
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onViewDetails }) => {
  if (transactions.length === 0) {
    return <p className="text-slate-400 text-center py-4">Chưa có giao dịch nào.</p>;
  }

  return (
    <div className="max-h-96 overflow-y-auto pr-1 custom-scrollbar">
      <ul className="space-y-1">
        {transactions.map((tx, index) => (
          <TransactionItem 
            key={tx.id} 
            tx={tx} 
            isNew={index === 0} 
            onViewDetails={onViewDetails} 
          />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;