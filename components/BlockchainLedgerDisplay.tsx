
import React from 'react';
import { SimulatedBlock, TransactionType, DEFAULT_CURRENCY, BlockIconType, SimulatedTransaction } from '../types';
import { CubeTransparentIcon, LinkIcon, SparklesIcon, ArrowUpCircleIcon, GiftIcon, MagnifyingGlassCircleIcon } from './Icons';

interface TransactionInBlockDisplayProps {
  tx: SimulatedTransaction;
  onViewDetails: (txId: string) => void;
}

const TransactionInBlockDisplay: React.FC<TransactionInBlockDisplayProps> = ({ tx, onViewDetails }) => {
  let icon, detailText;
  const amountStr = `${tx.amount.toLocaleString()} ${DEFAULT_CURRENCY.symbol}`;

  switch (tx.type) {
    case TransactionType.SEND:
      icon = <ArrowUpCircleIcon className="w-4 h-4 text-red-400 mr-1.5 shrink-0" />;
      detailText = `Gửi ${amountStr} tới ${tx.toAddress?.substring(0, 8)}...`;
      break;
    case TransactionType.FAUCET:
      icon = <GiftIcon className="w-4 h-4 text-green-400 mr-1.5 shrink-0" />;
      detailText = `Nhận ${amountStr} từ Faucet`;
      break;
    case TransactionType.INITIAL:
      icon = <SparklesIcon className="w-4 h-4 text-sky-400 mr-1.5 shrink-0" />;
      detailText = `Khởi tạo ví với ${amountStr}`;
      break;
    default:
      icon = <CubeTransparentIcon className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" />;
      detailText = `Giao dịch: ${amountStr}`;
  }

  return (
    <div className="flex items-center justify-between text-xs text-slate-300 py-1 px-2 bg-slate-700/50 rounded my-1 hover:bg-slate-600/50 transition-colors">
      <div className="flex items-center overflow-hidden">
        {icon}
        <span className="truncate" title={tx.description || detailText}>{detailText}</span>
      </div>
      <button 
        onClick={() => onViewDetails(tx.id)}
        title="Xem Chi Tiết Giao Dịch"
        className="p-0.5 text-slate-400 hover:text-sky-300 rounded-full ml-1"
      >
        <MagnifyingGlassCircleIcon className="w-3.5 h-3.5"/>
      </button>
    </div>
  );
};


interface BlockDisplayProps {
  block: SimulatedBlock;
  index: number; // Original index in the non-reversed array
  onViewDetails: (txId: string) => void;
}

const getBlockIcon = (block: SimulatedBlock): React.ReactElement => {
  let iconType: BlockIconType = 'standard';
  if (block.id === "1" || block.previousHash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
    iconType = 'genesis';
  } else if (block.transactions.some(tx => tx.type === TransactionType.FAUCET)) {
    iconType = 'faucet';
  }

  const baseClass = "w-8 h-8 md:w-10 md:h-10 mr-3 shrink-0";
  switch (iconType) {
    case 'genesis':
      return <SparklesIcon className={`${baseClass} text-yellow-400`} />;
    case 'faucet':
      return <GiftIcon className={`${baseClass} text-emerald-400`} />;
    default:
      return <CubeTransparentIcon className={`${baseClass} text-sky-400`} />;
  }
};

const BlockDisplay: React.FC<BlockDisplayProps> = ({ block, index, onViewDetails }) => {
  const isGenesis = block.id === "1" || block.previousHash === "0x0000000000000000000000000000000000000000000000000000000000000000";
  return (
    <div className="relative mb-8 p-1">
      {!isGenesis && (
        <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 rotate-90 md:left-auto md:top-1/2 md:-left-4 md:-translate-y-1/2 md:rotate-0">
          <LinkIcon className="w-5 h-5 text-slate-500" />
        </div>
      )}
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg ring-1 ring-slate-700 hover:ring-sky-600 transition-all duration-300">
        <div className="flex items-start mb-3">
          {getBlockIcon(block)}
          <div>
            <h3 className="text-lg font-semibold text-sky-400">
              Khối #{block.id} {isGenesis ? "(Genesis)" : ""}
            </h3>
            <p className="text-xs text-slate-500">
              {new Date(block.timestamp).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-slate-400 font-medium shrink-0 mb-0.5 sm:mb-0 sm:mr-2">Hash Khối Trước:</span>
            <span className="text-slate-500 truncate sm:text-right" title={block.previousHash}>
              {isGenesis ? "N/A (Khối đầu tiên)" : `${block.previousHash.substring(0, 10)}...${block.previousHash.slice(-4)}`}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-slate-400 font-medium shrink-0 mb-0.5 sm:mb-0 sm:mr-2">Hash Khối Này:</span>
            <span className="text-green-400 truncate sm:text-right" title={block.blockHash}>
              {`${block.blockHash.substring(0, 10)}...${block.blockHash.slice(-4)}`}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-slate-400 font-medium shrink-0 mb-0.5 sm:mb-0 sm:mr-2">Nonce (Mô phỏng):</span>
            <span className="text-slate-500 sm:text-right">{block.nonce}</span>
          </div>
        </div>
        {block.transactions.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-1">
              Giao dịch trong khối ({block.transactions.length}):
            </h4>
            <div className="max-h-24 overflow-y-auto custom-scrollbar pr-1">
              {block.transactions.map(tx => (
                <TransactionInBlockDisplay key={tx.id} tx={tx} onViewDetails={onViewDetails} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface BlockchainLedgerDisplayProps {
  blockchain: SimulatedBlock[];
  onViewDetails: (txId: string) => void;
}

const BlockchainLedgerDisplay: React.FC<BlockchainLedgerDisplayProps> = ({ blockchain, onViewDetails }) => {
  if (!blockchain || blockchain.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <CubeTransparentIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
        <p className="text-lg">Sổ cái blockchain mô phỏng trống.</p>
        <p className="text-sm">Thực hiện một giao dịch để bắt đầu tạo khối.</p>
      </div>
    );
  }

  const reversedBlockchain = [...blockchain].reverse();

  return (
    <div className="mt-6">
      <div className="relative flex flex-col md:flex-row items-start overflow-x-auto custom-scrollbar pb-4">
        {reversedBlockchain.map((block, index) => (
          <div key={block.id} className="md:min-w-[300px] md:max-w-[350px] w-full md:flex-shrink-0 md:mr-4 last:mr-0">
            <BlockDisplay block={block} index={blockchain.length - 1 - index} onViewDetails={onViewDetails} />
          </div>
        ))}
      </div>
       <p className="text-xs text-center text-slate-500 mt-4">
        Các khối mới nhất được hiển thị ở bên trái (hoặc trên cùng trên di động). Cuộn để xem các khối cũ hơn.
      </p>
    </div>
  );
};

export default BlockchainLedgerDisplay;