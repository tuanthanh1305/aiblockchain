
import React, { useState } from 'react';
import { 
    ComputerDesktopIcon, 
    SnowflakeIcon, 
    LinkIcon, 
    ArrowDownIcon, 
    SignatureIcon, 
    SparklesIcon, 
    DocumentTextIcon,
    ArrowRightCircleIcon, 
    CheckCircleIcon 
} from './Icons'; 
import { generateFakeAddress, generateRandomHexString } from '../utils/cryptoSim';

type DemoStage = 'initial' | 'prepared' | 'signed' | 'broadcasted';

interface TransactionData {
  toAddress: string;
  amount: string;
  fee: string;
  rawTxData?: string;
  signedTxData?: string;
}

interface StageDisplayProps {
  title: string;
  icon: React.ReactElement<{ className?: string }>; // Updated type
  active: boolean;
  children: React.ReactNode;
}

const StageDisplay: React.FC<StageDisplayProps> = 
({ title, icon, active, children }) => (
  <div className={`p-4 rounded-lg ring-1 transition-all duration-300 ${active ? 'bg-sky-700/30 ring-sky-500 shadow-sky-500/30 shadow-lg' : 'bg-slate-700/50 ring-slate-600 opacity-60'}`}>
    <div className="flex items-center mb-2">
      {React.cloneElement(icon, { className: `w-6 h-6 mr-2 ${active ? 'text-sky-300' : 'text-slate-500'}` })}
      <h4 className={`text-md font-semibold ${active ? 'text-sky-300' : 'text-slate-400'}`}>{title}</h4>
    </div>
    <div className={`text-xs space-y-2 ${active ? 'text-slate-200' : 'text-slate-400'}`}>
      {children}
    </div>
  </div>
);


const OfflineSigningDemo: React.FC = () => {
  const [stage, setStage] = useState<DemoStage>('initial');
  const [txData, setTxData] = useState<TransactionData>({
    toAddress: generateFakeAddress(),
    amount: (Math.random() * 10).toFixed(2),
    fee: (Math.random() * 0.01).toFixed(4),
  });

  const handlePrepare = () => {
    // Simulate raw transaction data generation
    const rawData = `TO:${txData.toAddress},AMOUNT:${txData.amount},FEE:${txData.fee},NONCE:${Math.floor(Math.random()*10000)}`;
    setTxData(prev => ({ ...prev, rawTxData: `RAW_TX_DATA_HEX::${generateRandomHexString(40)}_${btoa(rawData).slice(0,30)}` })); // base64 for effect
    setStage('prepared');
  };

  const handleSign = () => {
    if (!txData.rawTxData) return;
    // Simulate signing (in reality, this happens inside the cold wallet with the private key)
    const signedData = `SIGNED_TX_HEX::${generateRandomHexString(60)}_${txData.rawTxData.slice(-20)}_${generateRandomHexString(20)}`;
    setTxData(prev => ({ ...prev, signedTxData: signedData }));
    setStage('signed');
  };

  const handleBroadcast = () => {
    setStage('broadcasted');
  };
  
  const handleReset = () => {
    setTxData({
        toAddress: generateFakeAddress(),
        amount: (Math.random() * 10).toFixed(2),
        fee: (Math.random() * 0.01).toFixed(4),
        rawTxData: undefined,
        signedTxData: undefined
    });
    setStage('initial');
  }

  const InputField: React.FC<{label:string, value:string, onChange:(val:string)=>void, placeholder?:string, disabled?:boolean}> = 
  ({label,value,onChange,placeholder, disabled}) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-0.5">{label}:</label>
        <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full text-xs p-1.5 bg-slate-800 border border-slate-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-70"
        />
    </div>
  );


  return (
    <div className="p-4 bg-slate-800/70 rounded-lg shadow-inner ring-1 ring-slate-700 space-y-6">
        
      <div className="grid md:grid-cols-3 gap-4 items-start">
        {/* Stage 1: Prepare Online */}
        <StageDisplay title="1. Chuẩn Bị (Online)" icon={<ComputerDesktopIcon />} active={stage === 'initial' || stage === 'prepared'}>
          <InputField label="Địa chỉ nhận (Mô phỏng)" value={txData.toAddress} onChange={val => setTxData(p=>({...p, toAddress:val}))} disabled={stage !== 'initial'} />
          <InputField label="Số lượng gửi (Mô phỏng)" value={txData.amount} onChange={val => setTxData(p=>({...p, amount:val}))} disabled={stage !== 'initial'} />
          <InputField label="Phí giao dịch (Mô phỏng)" value={txData.fee} onChange={val => setTxData(p=>({...p, fee:val}))} disabled={stage !== 'initial'} />
          {stage === 'initial' && (
            <button onClick={handlePrepare} className="w-full mt-2 text-xs bg-sky-600 hover:bg-sky-500 text-white py-1.5 px-3 rounded-md shadow-md flex items-center justify-center">
              <DocumentTextIcon className="w-3.5 h-3.5 mr-1.5" /> Chuẩn Bị Giao Dịch Thô
            </button>
          )}
          {txData.rawTxData && (stage === 'prepared' || stage === 'signed' || stage === 'broadcasted') && (
            <div className="mt-2 pt-2 border-t border-slate-600">
                <p className="font-semibold text-sky-400 text-xs">Dữ liệu giao dịch thô (chưa ký):</p>
                <pre className="whitespace-pre-wrap break-all text-orange-400 text-[10px] bg-slate-900 p-1.5 rounded">{txData.rawTxData}</pre>
                <p className="text-[10px] text-slate-500 mt-1">Dữ liệu này sẽ được chuyển sang ví lạnh.</p>
            </div>
          )}
        </StageDisplay>

        {/* Arrow / Separator */}
        <div className="flex justify-center items-center h-full">
            <ArrowDownIcon className="w-6 h-6 text-slate-500 md:hidden"/>
            <ArrowRightCircleIcon className="w-6 h-6 text-slate-500 hidden md:block"/>
        </div>

        {/* Stage 2: Sign Offline */}
        <StageDisplay title="2. Ký (Ví Lạnh - Offline)" icon={<SnowflakeIcon />} active={stage === 'prepared' || stage === 'signed'}>
          {stage === 'prepared' && (
             <button onClick={handleSign} className="w-full mt-2 text-xs bg-teal-600 hover:bg-teal-500 text-white py-1.5 px-3 rounded-md shadow-md flex items-center justify-center" disabled={!txData.rawTxData}>
              <SignatureIcon className="w-3.5 h-3.5 mr-1.5" /> Ký Giao Dịch (Mô Phỏng Offline)
            </button>
          )}
          {txData.signedTxData && (stage === 'signed' || stage === 'broadcasted') && (
             <div className="mt-2 pt-2 border-t border-slate-600">
                <p className="font-semibold text-teal-400 text-xs">Giao dịch đã ký:</p>
                <pre className="whitespace-pre-wrap break-all text-green-400 text-[10px] bg-slate-900 p-1.5 rounded">{txData.signedTxData}</pre>
                <p className="text-[10px] text-slate-500 mt-1">Giao dịch đã ký này an toàn để chuyển lại thiết bị online.</p>
            </div>
          )}
           {stage !== 'signed' && stage !== 'broadcasted' && !txData.signedTxData && <p className="italic text-slate-500 text-xs mt-1">Chờ dữ liệu giao dịch thô và nhấn nút ký...</p>}
        </StageDisplay>
        
        {/* Arrow / Separator - This should ideally be between stage 2 and 3 */}
         {/* This is a bit tricky with grid, for now, it's just a placeholder conceptually */}
      </div>
      
      {/* Separator and Stage 3 - placed below for better flow on mobile */}
       <div className="flex flex-col md:flex-row items-center justify-center my-3 md:my-0">
            <div className="flex justify-center items-center md:hidden w-full my-2"> {/* Mobile separator */}
                <ArrowDownIcon className="w-6 h-6 text-slate-500"/>
            </div>
             {/* Desktop separator between column 2 and 3 (conceptual) - handled by grid gap */}
        </div>


        <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="md:col-start-2 flex justify-center items-center h-full"> {/* Desktop Arrow from stage 2 to 3 */}
                 <ArrowRightCircleIcon className="w-6 h-6 text-slate-500 hidden md:block"/>
            </div>
            <StageDisplay title="3. Phát Tán (Online)" icon={<LinkIcon />} active={stage === 'signed' || stage === 'broadcasted'}>
            {stage === 'signed' && (
                <button onClick={handleBroadcast} className="w-full mt-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 px-3 rounded-md shadow-md flex items-center justify-center" disabled={!txData.signedTxData}>
                <LinkIcon className="w-3.5 h-3.5 mr-1.5" /> Phát Tán Lên Mạng (Mô Phỏng)
                </button>
            )}
            {stage === 'broadcasted' && (
                <div className="mt-1 p-2 bg-green-700/30 text-green-300 rounded-md text-center">
                <CheckCircleIcon className="w-5 h-5 mx-auto mb-1" />
                <p className="font-semibold text-xs">Giao dịch đã được phát tán lên mạng blockchain (mô phỏng)!</p>
                <p className="text-[10px]">Nó sẽ được đưa vào một khối và xác nhận bởi mạng lưới.</p>
                </div>
            )}
            {stage !== 'broadcasted' && !txData.signedTxData && <p className="italic text-slate-500 text-xs mt-1">Chờ giao dịch đã ký...</p>}
            </StageDisplay>
        </div>


      {(stage === 'broadcasted' || stage === 'initial' && !txData.rawTxData) && (
        <div className="mt-6 text-center">
            <button onClick={handleReset} className="text-xs bg-slate-600 hover:bg-slate-500 text-white py-1.5 px-4 rounded-md shadow-md flex items-center justify-center mx-auto">
                <SparklesIcon className="w-3.5 h-3.5 mr-1.5" /> Bắt Đầu Lại Demo
            </button>
        </div>
      )}
       <p className="text-xs text-yellow-400/80 bg-yellow-800/30 p-2 rounded-md ring-1 ring-yellow-600/50 mt-4">
        <strong>Lưu ý:</strong> Đây là một mô phỏng đơn giản hóa. Quy trình thực tế có thể sử dụng mã QR, file, hoặc các giao thức phần cứng chuyên dụng để chuyển dữ liệu giữa thiết bị online và offline một cách an toàn. Khóa riêng tư không bao giờ lộ ra ngoài ví lạnh.
      </p>
    </div>
  );
};

export default OfflineSigningDemo;
