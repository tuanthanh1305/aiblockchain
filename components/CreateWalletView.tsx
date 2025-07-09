
import React from 'react';
import { SparklesIcon } from './Icons';
import { DEFAULT_CURRENCY } from '../types';

interface CreateWalletViewProps {
  onCreateWallet: () => void;
}

const CreateWalletView: React.FC<CreateWalletViewProps> = ({ onCreateWallet }) => {
  return (
    <div className="space-y-10 text-center">
      <div className="p-6 md:p-8 bg-slate-700/60 rounded-xl shadow-2xl ring-1 ring-slate-600/30">
        <div className="flex flex-col items-center justify-center text-sky-300 mb-4">
          <SparklesIcon className="w-10 h-10 mr-0 mb-2 md:mb-0 md:mr-3 text-sky-400" />
          <h2 className="text-2xl md:text-3xl font-semibold">Bắt Đầu Mô Phỏng Ví</h2>
        </div>
        <p className="text-slate-300 mb-6 text-base leading-relaxed">
          Sẵn sàng để thực hành? Tạo một ví mô phỏng để gửi và nhận ${DEFAULT_CURRENCY.symbol} (Tài sản mã hoá mô phỏng).
          <br/>
          Ví này chỉ dành cho mục đích học tập và không sử dụng tài sản mã hoá thật.
        </p>
        <button
          onClick={onCreateWallet}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:shadow-sky-500/40 transition-all duration-300 transform hover:scale-105 text-lg focus:outline-none focus:ring-4 focus:ring-sky-400/50"
          aria-label="Tạo Ví Mô Phỏng Mới"
        >
          Tạo Ví Mô Phỏng Ngay
        </button>
      </div>

      {/* 
        The detailed educational cards previously here:
        - "Kiến Thức Cơ Bản Về Ví" (What is a Wallet, Public Address, Private Key, Seed Phrase) are now part of HomeView.
        - "Tìm Hiểu Các Loại Ví Phổ Biến" (Hot, Cold, Hardware, Software, Paper) are now expanded in WalletTypesView.
        This keeps CreateWalletView focused on its role within the Simulator context.
      */}
       <div className="mt-8 p-4 bg-sky-800/30 text-sky-200 text-sm rounded-md ring-1 ring-sky-700/50">
        <p>Sau khi tạo ví, bạn sẽ có thể:</p>
        <ul className="list-disc list-inside ml-4 mt-2 text-left">
            <li>Xem địa chỉ ví, khóa riêng tư (giả) và cụm từ khôi phục (giả).</li>
            <li>Kiểm tra số dư ${DEFAULT_CURRENCY.symbol} (Tài sản mã hoá mô phỏng).</li>
            <li>Thực hiện giao dịch gửi ${DEFAULT_CURRENCY.symbol} (Tài sản mã hoá mô phỏng) đến địa chỉ khác (mô phỏng).</li>
            <li>Nhận ${DEFAULT_CURRENCY.symbol} (Tài sản mã hoá mô phỏng) từ "Faucet" (vòi phát token mô phỏng).</li>
            <li>Xem lịch sử giao dịch mô phỏng.</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateWalletView;