
import React, { useState } from 'react';
import { DEFAULT_CURRENCY } from '../types';

interface TransactionFormProps {
  onSend: (toAddress: string, amount: number) => boolean;
  currentBalance: number;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSend, currentBalance }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numericAmount = parseFloat(amount);

    if (!toAddress.trim()) {
      setError('Địa chỉ người nhận không được để trống.');
      return;
    }
     // Basic address validation (starts with 0x and is hex) - very simplified
    if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress.trim())) {
      setError('Địa chỉ người nhận không hợp lệ. Phải bắt đầu bằng 0x và dài 42 ký tự hexa.');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Số tiền không hợp lệ. Phải là số dương.');
      return;
    }
    if (numericAmount > currentBalance) {
      setError('Số dư không đủ để thực hiện giao dịch này.');
      return;
    }

    if (onSend(toAddress.trim(), numericAmount)) {
      setToAddress('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="toAddress" className="block text-sm font-medium text-slate-300 mb-1">
          Địa chỉ người nhận (Mô phỏng)
        </label>
        <input
          type="text"
          id="toAddress"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="Ví dụ: 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12"
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-500 transition-colors"
          aria-label="Địa chỉ người nhận"
          maxLength={42}
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">
          Số lượng ${DEFAULT_CURRENCY.symbol}
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="any"
          min="0"
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-500 transition-colors"
          aria-label={`Số lượng ${DEFAULT_CURRENCY.symbol} cần gửi`}
        />
      </div>
      {error && <p className="text-sm text-red-400 animate-shake">{error}</p>} {/* Added a simple shake animation class */}
      <button
        type="submit"
        aria-label={`Gửi ${DEFAULT_CURRENCY.symbol}`}
        className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-sky-500/40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50"
      >
        Gửi ${DEFAULT_CURRENCY.symbol}
      </button>
    </form>
  );
};

export default TransactionForm;