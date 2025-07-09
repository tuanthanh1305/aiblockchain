
import React from 'react';
import { SimulatedWallet, SimulatedTransaction, DEFAULT_CURRENCY } from '../types';
import WalletInfoDisplay from './WalletInfoDisplay';
import TransactionForm from './TransactionForm';
import TransactionList, { TransactionListProps } from './TransactionList'; // Ensure TransactionListProps is exported or defined correctly if needed
import { ArrowPathIcon, GiftIcon, ArrowUpTrayIcon } from './Icons';


interface WalletDashboardProps {
  wallet: SimulatedWallet;
  transactions: SimulatedTransaction[];
  onSend: (toAddress: string, amount: number) => boolean;
  onReceive: () => void; // Will be for Faucet
  onResetWallet: () => void;
  onCopy: (textToCopy: string, itemName: string) => void;
  onViewDetails: (txId: string) => void; // Added prop
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({ wallet, transactions, onSend, onReceive, onResetWallet, onCopy, onViewDetails }) => {

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-700/60 rounded-lg shadow-xl ring-1 ring-slate-600/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-sky-400">Bảng Điều Khiển Ví</h2>
            <p className="text-slate-400">Quản lý ví mô phỏng của bạn.</p>
          </div>
          <button
            onClick={onResetWallet}
            aria-label="Tạo lại ví khác"
            className="mt-4 md:mt-0 flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Tạo Lại Ví Khác
          </button>
        </div>
        
        <WalletInfoDisplay wallet={wallet} onCopy={onCopy} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="p-6 bg-slate-700/60 rounded-lg shadow-xl ring-1 ring-slate-600/50 flex flex-col">
          <h3 className="text-xl md:text-2xl font-semibold text-sky-400 mb-2 flex items-center">
            <ArrowUpTrayIcon className="w-6 h-6 mr-2" />
            Gửi ${DEFAULT_CURRENCY.name}
          </h3>
          <p className="text-slate-400 mb-4 text-sm">Thực hiện giao dịch gửi mô phỏng.</p>
          <TransactionForm onSend={onSend} currentBalance={wallet.balance} />
           <button
            onClick={onReceive}
            aria-label={`Nhận ${DEFAULT_CURRENCY.name} từ Faucet`}
            className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400/50"
          >
            <GiftIcon className="w-5 h-5 mr-2" />
            Nhận từ Faucet (${DEFAULT_CURRENCY.symbol})
          </button>
        </div>

        <div className="p-6 bg-slate-700/60 rounded-lg shadow-xl ring-1 ring-slate-600/50 md:col-span-1">
           <h3 className="text-xl md:text-2xl font-semibold text-sky-400 mb-4">Lịch Sử Giao Dịch</h3>
          <TransactionList transactions={transactions} onViewDetails={onViewDetails} />
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;