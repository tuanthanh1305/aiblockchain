
import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_CURRENCY, STBLF_ASSET, ETHF_ASSET, ExchangeAsset } from '../types';
import { SwitchHorizontalIcon, ArrowDownIcon } from './Icons';

interface SwapDemoProps {}

const assetsForSwap: ExchangeAsset[] = [
  { symbol: DEFAULT_CURRENCY.symbol, name: DEFAULT_CURRENCY.name, balance: 0 /* Not used in this simple demo */ },
  STBLF_ASSET,
  ETHF_ASSET,
];

// Simulated exchange rates (HARDCODED for demo)
// 1 Base Asset = X Quote Asset
const SIMULATED_RATES: { [key: string]: number } = {
  [`${DEFAULT_CURRENCY.symbol}_${STBLF_ASSET.symbol}`]: 0.5, // 1 DMC = 0.5 STBL-F
  [`${STBLF_ASSET.symbol}_${DEFAULT_CURRENCY.symbol}`]: 2,   // 1 STBL-F = 2 DMC
  
  [`${DEFAULT_CURRENCY.symbol}_${ETHF_ASSET.symbol}`]: 0.001, // 1 DMC = 0.001 ETH-F
  [`${ETHF_ASSET.symbol}_${DEFAULT_CURRENCY.symbol}`]: 1000,  // 1 ETH-F = 1000 DMC

  [`${STBLF_ASSET.symbol}_${ETHF_ASSET.symbol}`]: 0.002, // 1 STBL-F = 0.002 ETH-F (derived: 2 DMC * 0.001 ETH-F/DMC)
  [`${ETHF_ASSET.symbol}_${STBLF_ASSET.symbol}`]: 500,   // 1 ETH-F = 500 STBL-F (derived: 1000 DMC * 0.5 STBL-F/DMC)
};

const SIMULATED_POOL_FEE_PERCENT = 0.3; // 0.3%
const SIMULATED_SLIPPAGE_TOLERANCE_PERCENT = 0.5; // 0.5% (display only)

const SwapDemo: React.FC<SwapDemoProps> = () => {
  const [fromAsset, setFromAsset] = useState<ExchangeAsset>(assetsForSwap[0]);
  const [toAsset, setToAsset] = useState<ExchangeAsset>(assetsForSwap[1]);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmountEstimated, setToAmountEstimated] = useState<string>('');
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const addToLog = (message: string) => {
    setSimulationLog(prev => [`[${new Date().toLocaleTimeString('vi-VN')}] ${message}`, ...prev.slice(0, 4)]);
  };

  const calculateToAmount = useCallback(() => {
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0 || !fromAsset || !toAsset) {
      setToAmountEstimated('');
      setCurrentRate(null);
      return;
    }

    const rateKey = `${fromAsset.symbol}_${toAsset.symbol}`;
    const rate = SIMULATED_RATES[rateKey];
    setCurrentRate(rate || null);

    if (rate) {
      const grossToAmount = amount * rate;
      const feeAmount = grossToAmount * (SIMULATED_POOL_FEE_PERCENT / 100);
      const netToAmount = grossToAmount - feeAmount;
      setToAmountEstimated(netToAmount.toFixed(5)); // Show 5 decimal places for precision
    } else {
      setToAmountEstimated('Không có tỷ giá');
    }
  }, [fromAsset, toAsset, fromAmount]);

  useEffect(() => {
    calculateToAmount();
  }, [calculateToAmount]);

  const handleFromAssetChange = (symbol: string) => {
    const selected = assetsForSwap.find(a => a.symbol === symbol);
    if (selected) {
      if (selected.symbol === toAsset.symbol) { // If new fromAsset is same as toAsset, swap them
        setToAsset(fromAsset);
      }
      setFromAsset(selected);
    }
  };

  const handleToAssetChange = (symbol: string) => {
    const selected = assetsForSwap.find(a => a.symbol === symbol);
    if (selected) {
      if (selected.symbol === fromAsset.symbol) { // If new toAsset is same as fromAsset, swap them
        setFromAsset(toAsset);
      }
      setToAsset(selected);
    }
  };
  
  const handleSwitchAssets = () => {
    const tempFrom = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempFrom);
    // Optionally also swap amounts if you want that behavior
    // const tempAmount = fromAmount;
    // setFromAmount(toAmountEstimated); // This might be tricky if toAmountEstimated is 'N/A'
  };

  const handleSwap = () => {
    const fAmount = parseFloat(fromAmount);
    const tAmount = parseFloat(toAmountEstimated);

    if (isNaN(fAmount) || fAmount <= 0 || isNaN(tAmount) || tAmount <=0 || !currentRate) {
      addToLog("Lỗi: Dữ liệu không hợp lệ để swap.");
      return;
    }
    addToLog(`Mô phỏng: Hoán đổi ${fAmount.toFixed(3)} ${fromAsset.symbol} sang ${tAmount.toFixed(3)} ${toAsset.symbol}.`);
    // In a real app, this would interact with balances, contracts, etc.
    // For this demo, we just log.
    setFromAmount(''); // Clear input after successful simulation
  };
  
  const AssetSelector: React.FC<{
    label: string;
    selectedAsset: ExchangeAsset;
    onAssetChange: (symbol: string) => void;
    otherAssetSymbol: string;
    amount?: string;
    onAmountChange?: (value: string) => void;
    isAmountEditable?: boolean;
    amountPlaceholder?: string;
  }> = ({ label, selectedAsset, onAssetChange, otherAssetSymbol, amount, onAmountChange, isAmountEditable = false, amountPlaceholder }) => (
    <div className="p-3 bg-slate-700 rounded-lg ring-1 ring-slate-600 space-y-2">
      <label className="block text-xs text-slate-400">{label}</label>
      <div className="flex items-center gap-2">
        <select 
          value={selectedAsset.symbol} 
          onChange={(e) => onAssetChange(e.target.value)}
          className="p-2 text-sm bg-slate-800 border border-slate-500 rounded-md focus:ring-sky-500 focus:border-sky-500 text-white min-w-[100px]"
        >
          {assetsForSwap.map(asset => (
            <option key={asset.symbol} value={asset.symbol} disabled={asset.symbol === otherAssetSymbol}>
              {asset.symbol}
            </option>
          ))}
        </select>
        <input 
          type="number"
          value={amount}
          onChange={onAmountChange ? (e) => onAmountChange(e.target.value) : undefined}
          readOnly={!isAmountEditable}
          placeholder={amountPlaceholder || "0.00"}
          className={`w-full p-2 text-sm text-right bg-slate-800 border border-slate-500 rounded-md focus:ring-sky-500 focus:border-sky-500 text-white ${!isAmountEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );

  return (
    <div className="p-3 md:p-4 bg-slate-800/70 rounded-lg shadow-inner ring-1 ring-slate-700 space-y-4 max-w-md mx-auto">
      <h5 className="text-sm font-semibold text-center text-slate-300">Hoán Đổi Tài Sản Mã Hoá (Mô Phỏng)</h5>
      
      <AssetSelector 
        label="Từ (Gửi)"
        selectedAsset={fromAsset}
        onAssetChange={handleFromAssetChange}
        otherAssetSymbol={toAsset.symbol}
        amount={fromAmount}
        onAmountChange={setFromAmount}
        isAmountEditable={true}
      />

      <div className="flex justify-center my-1">
        <button 
            onClick={handleSwitchAssets} 
            className="p-1.5 bg-slate-600 hover:bg-slate-500 rounded-full text-sky-300 transition-colors"
            title="Đảo chiều tài sản"
        >
            <ArrowDownIcon className="w-4 h-4 transform group-hover:rotate-180 transition-transform"/>
            {/* Or use SwitchHorizontalIcon with different rotation for better semantics */}
        </button>
      </div>

      <AssetSelector 
        label="Đến (Nhận - Ước tính)"
        selectedAsset={toAsset}
        onAssetChange={handleToAssetChange}
        otherAssetSymbol={fromAsset.symbol}
        amount={toAmountEstimated}
        amountPlaceholder="---"
      />

      {currentRate && fromAsset.symbol !== toAsset.symbol && (
        <div className="text-xs text-slate-400 space-y-1 p-2 bg-slate-700/50 rounded-md">
          <p>Tỷ giá mô phỏng: 1 {fromAsset.symbol} ≈ {currentRate.toFixed(5)} {toAsset.symbol}</p>
          <p>Phí Pool (mô phỏng): {SIMULATED_POOL_FEE_PERCENT}%</p>
          <p>Độ trượt giá cho phép (mô phỏng): {SIMULATED_SLIPPAGE_TOLERANCE_PERCENT}%</p>
        </div>
      )}
       {fromAsset.symbol === toAsset.symbol && (
         <p className="text-xs text-center text-red-400 p-2 bg-red-700/20 rounded-md">Không thể hoán đổi cùng một loại tài sản.</p>
       )}


      <button
        onClick={handleSwap}
        disabled={!parseFloat(fromAmount) || !parseFloat(toAmountEstimated) || fromAsset.symbol === toAsset.symbol || !currentRate}
        className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        <SwitchHorizontalIcon className="w-5 h-5 mr-2" />
        Thực Hiện Swap (Mô Phỏng)
      </button>

      {simulationLog.length > 0 && (
        <div className="mt-3 p-2 bg-slate-700/50 rounded-md ring-1 ring-slate-600 text-xs">
          <h6 className="font-semibold text-slate-400 mb-1">Nhật ký mô phỏng swap:</h6>
          <ul className="space-y-0.5 max-h-20 overflow-y-auto custom-scrollbar">
            {simulationLog.map((log, index) => (
              <li key={index} className={`text-slate-400 ${index === 0 ? 'text-sky-300 animate-fade-in-down' : ''}`}>
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-yellow-400/80 bg-yellow-800/30 p-2 rounded-md ring-1 ring-yellow-600/50 mt-3">
        <strong>Lưu ý:</strong> Demo này sử dụng tỷ giá cố định và không theo dõi số dư thực tế của các tài sản STBL-F hoặc ETH-F. Chỉ nhằm mục đích minh họa khái niệm swap.
      </p>
    </div>
  );
};

export default SwapDemo;
