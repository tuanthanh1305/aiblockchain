
import React from 'react';
import { SimulatedTransaction, SimulatedBlock, TransactionType, DEFAULT_CURRENCY } from '../types';
import { CubeTransparentIcon, LinkIcon, CheckCircleIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, SparklesIcon, GiftIcon, InformationCircleIcon, ExternalLinkIcon } from './Icons';

interface TransactionExplorerDetailProps {
  transaction: SimulatedTransaction;
  block?: SimulatedBlock;
}

const DetailRow: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode; isHash?: boolean; title?: string }> = ({ label, value, children, isHash, title }) => (
  <div className="py-2 px-3 even:bg-slate-700/40 odd:bg-slate-700/20 rounded-md">
    <div className="flex justify-between items-center">
      <span className="text-xs font-medium text-slate-400 w-1/3">{label}:</span>
      {children ? (
        <div className="text-xs text-sky-200 w-2/3 break-words text-right">{children}</div>
      ) : (
        <span 
          className={`text-xs w-2/3 break-words text-right ${isHash ? 'text-cyan-400 font-mono' : 'text-sky-200'}`}
          title={title || (typeof value === 'string' ? value : undefined)}
        >
          {typeof value === 'string' && isHash ? `${value.substring(0, 10)}...${value.slice(-8)}` : (value ?? 'N/A')}
        </span>
      )}
    </div>
  </div>
);

const TransactionExplorerDetail: React.FC<TransactionExplorerDetailProps> = ({ transaction, block }) => {
  const getTransactionStatusIcon = () => {
    // For simulation, all transactions in blocks are "confirmed"
    return <CheckCircleIcon className="w-4 h-4 text-green-400 mr-1.5" />;
  };

  const getTransactionTypeIconAndText = () => {
    switch (transaction.type) {
      case TransactionType.SEND:
        return { icon: <ArrowUpCircleIcon className="w-4 h-4 text-red-400 mr-1.5" />, text: "Gửi Tài Sản Mã Hoá" };
      case TransactionType.RECEIVE: // Not directly used as a type for 'to' side, but for general display
        return { icon: <ArrowDownCircleIcon className="w-4 h-4 text-green-400 mr-1.5" />, text: "Nhận Tài Sản Mã Hoá" };
      case TransactionType.FAUCET:
        return { icon: <GiftIcon className="w-4 h-4 text-yellow-400 mr-1.5" />, text: "Nhận Từ Faucet" };
      case TransactionType.INITIAL:
        return { icon: <SparklesIcon className="w-4 h-4 text-sky-400 mr-1.5" />, text: "Khởi Tạo Ví" };
      default:
        return { icon: <InformationCircleIcon className="w-4 h-4 text-slate-400 mr-1.5" />, text: "Giao Dịch Chung" };
    }
  };
  
  const { icon: typeIcon, text: typeText } = getTransactionTypeIconAndText();

  return (
    <div className="space-y-4 text-sm">
      <div className="p-3 bg-slate-700/50 rounded-lg shadow-md ring-1 ring-slate-600/50">
        <h3 className="text-base font-semibold text-sky-400 mb-2 flex items-center">
          <CubeTransparentIcon className="w-5 h-5 mr-2"/>Tổng Quan Giao Dịch
        </h3>
        <div className="space-y-1">
          <DetailRow label="Mã Giao Dịch (TxHash)" value={transaction.id} isHash title={transaction.id} />
          <DetailRow label="Trạng Thái">
            <span className="flex items-center justify-end">
              {getTransactionStatusIcon()} Đã xác nhận (Mô phỏng)
            </span>
          </DetailRow>
          <DetailRow label="Khối (Block #)" value={transaction.blockId ?? 'Chưa xác nhận'} />
          <DetailRow label="Thời Gian" value={new Date(transaction.timestamp).toLocaleString('vi-VN')} />
        </div>
      </div>

      <div className="p-3 bg-slate-700/50 rounded-lg shadow-md ring-1 ring-slate-600/50">
        <h3 className="text-base font-semibold text-sky-400 mb-2 flex items-center">
          {typeIcon} {typeText}
        </h3>
        <div className="space-y-1">
          <DetailRow label="Từ địa chỉ" value={transaction.fromAddress} isHash title={transaction.fromAddress} />
          <DetailRow label="Tới địa chỉ" value={transaction.toAddress} isHash title={transaction.toAddress} />
          <DetailRow label="Giá trị gửi">
            {transaction.amount.toLocaleString()} {DEFAULT_CURRENCY.symbol}
          </DetailRow>
          <DetailRow label="Mô tả" value={transaction.description} />
        </div>
      </div>
      
      <div className="p-3 bg-slate-700/50 rounded-lg shadow-md ring-1 ring-slate-600/50">
        <h3 className="text-base font-semibold text-sky-400 mb-2 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2"/>Chi Tiết Phí & Dữ Liệu (Mô Phỏng)
        </h3>
        <div className="space-y-1">
            <DetailRow label="Phí Giao Dịch">
                {transaction.transactionFee?.toFixed(5) ?? 'N/A'} {DEFAULT_CURRENCY.symbol}
            </DetailRow>
            <DetailRow label="Giá Gas (Gwei Mô Phỏng)" value={transaction.gasPrice ?? 'N/A'} />
            <DetailRow label="Lượng Gas Sử Dụng" value={transaction.gasUsed?.toLocaleString() ?? 'N/A'} />
            <DetailRow label="Nonce (Giao dịch thứ)" value={transaction.nonce ?? 'N/A'}/>
        </div>
      </div>

      {block && (
         <div className="p-3 bg-slate-700/50 rounded-lg shadow-md ring-1 ring-slate-600/50">
            <h3 className="text-base font-semibold text-sky-400 mb-2 flex items-center">
                <CubeTransparentIcon className="w-5 h-5 mr-2 text-yellow-400"/>Thông Tin Khối Chứa Giao Dịch
            </h3>
            <div className="space-y-1">
                <DetailRow label="Mã Khối (Block ID)" value={block.id}/>
                <DetailRow label="Hash Khối" value={block.blockHash} isHash title={block.blockHash}/>
                <DetailRow label="Hash Khối Trước" value={block.previousHash} isHash title={block.previousHash}/>
                <DetailRow label="Thời Gian Khối" value={new Date(block.timestamp).toLocaleString('vi-VN')}/>
                <DetailRow label="Số Giao Dịch Trong Khối" value={block.transactions.length}/>
                <DetailRow label="Nonce Khối" value={block.nonce}/>
            </div>
        </div>
      )}
      <div className="text-center mt-4">
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert("Đây là link mô phỏng, không dẫn đến explorer thật!"); }}
            className="inline-flex items-center text-xs text-sky-400 hover:text-sky-300 hover:underline"
        >
            Xem trên Block Explorer (Mô Phỏng) <ExternalLinkIcon className="w-3 h-3 ml-1"/>
        </a>
      </div>
       <p className="mt-4 text-xs text-yellow-400/80 bg-yellow-800/30 p-2 rounded-md ring-1 ring-yellow-600/50">
        <InformationCircleIcon className="w-4 h-4 inline mr-1" />
        Các thông số như Gas, Phí, Nonce ở đây đều được mô phỏng để minh họa. Trong thực tế, chúng được tính toán và xác định bởi mạng lưới blockchain.
      </p>
    </div>
  );
};

export default TransactionExplorerDetail;
