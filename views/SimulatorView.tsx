
import React, { useState, useCallback, useEffect } from 'react';
import { SimulatedWallet, SimulatedTransaction, TransactionType, DEFAULT_CURRENCY, WalletType, AppNotification, NotificationType, SimulatedBlock } from '../types';
import { 
    generateFakeAddress, 
    generateFakePrivateKey, 
    generateFakeSeedPhrase, 
    generateFakeBlockHash,
    generateFakeGasPrice, 
    generateFakeGasUsed,   
    generateFakeNonce      
} from '../utils/cryptoSim';
import WalletDashboard from '../components/WalletDashboard';
import CreateWalletView from '../components/CreateWalletView';
import BlockchainLedgerDisplay from '../components/BlockchainLedgerDisplay'; 
import Modal from '../components/Modal'; 
import TransactionExplorerDetail from '../components/TransactionExplorerDetail'; 
import { LightBulbIcon } from '../components/Icons';

const SIMULATOR_TRANSACTIONS_KEY = 'simulatorTransactions_v1';
const SIMULATOR_BLOCKCHAIN_KEY = 'simulatorBlockchain_v1';
const SIMULATOR_WALLET_KEY = 'simulatorWallet_v1';


interface SimulatorViewProps {
  onCopy: (textToCopy: string, itemName: string) => void;
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const SimulatorView: React.FC<SimulatorViewProps> = ({ onCopy, addNotification }) => {
  const [simulatedWallet, setSimulatedWallet] = useState<SimulatedWallet | null>(() => {
    const savedWallet = localStorage.getItem(SIMULATOR_WALLET_KEY);
    return savedWallet ? JSON.parse(savedWallet) : null;
  });
  const [transactions, setTransactions] = useState<SimulatedTransaction[]>(() => {
    const savedTransactions = localStorage.getItem(SIMULATOR_TRANSACTIONS_KEY);
    return savedTransactions ? (JSON.parse(savedTransactions) as SimulatedTransaction[]).map(tx => ({...tx, timestamp: new Date(tx.timestamp)})) : [];
  });
  const [simulatedBlockchain, setSimulatedBlockchain] = useState<SimulatedBlock[]>(() => {
    const savedBlockchain = localStorage.getItem(SIMULATOR_BLOCKCHAIN_KEY);
    return savedBlockchain ? (JSON.parse(savedBlockchain) as SimulatedBlock[]).map(block => ({...block, timestamp: new Date(block.timestamp), transactions: block.transactions.map(tx => ({...tx, timestamp: new Date(tx.timestamp)})) })) : [];
  });
  const [userNonce, setUserNonce] = useState<{[address: string]: number}>({}); // Track nonce per address

  // For Transaction Explorer Modal
  const [explorerModalOpen, setExplorerModalOpen] = useState(false);
  const [selectedTxForExplorer, setSelectedTxForExplorer] = useState<{tx: SimulatedTransaction, block: SimulatedBlock | undefined} | null>(null);

  useEffect(() => {
    if (simulatedWallet) {
      localStorage.setItem(SIMULATOR_WALLET_KEY, JSON.stringify(simulatedWallet));
    } else {
      localStorage.removeItem(SIMULATOR_WALLET_KEY);
    }
    localStorage.setItem(SIMULATOR_TRANSACTIONS_KEY, JSON.stringify(transactions));
    localStorage.setItem(SIMULATOR_BLOCKCHAIN_KEY, JSON.stringify(simulatedBlockchain));
  }, [simulatedWallet, transactions, simulatedBlockchain]);

  const addTransactionToBlock = useCallback((transactionDraft: Omit<SimulatedTransaction, 'blockId'>): SimulatedBlock => {
    const lastBlock = simulatedBlockchain.length > 0 ? simulatedBlockchain[simulatedBlockchain.length - 1] : null;
    const previousHashValue = lastBlock ? lastBlock.blockHash : '0x0000000000000000000000000000000000000000000000000000000000000000';
    const newBlockId = (simulatedBlockchain.length + 1).toString();
    const newBlockDataToHash = `${previousHashValue}${JSON.stringify(transactionDraft)}${new Date().toISOString()}${Math.random()}`;
    const newBlockHash = generateFakeBlockHash(newBlockDataToHash);

    const transactionInBlock: SimulatedTransaction = {
      ...transactionDraft,
      blockId: newBlockId,
    };

    const newBlock: SimulatedBlock = {
      id: newBlockId,
      previousHash: previousHashValue,
      blockHash: newBlockHash,
      timestamp: new Date(),
      transactions: [transactionInBlock],
      nonce: Math.floor(Math.random() * 1000000),
    };

    setSimulatedBlockchain(prevChain => [...prevChain, newBlock]);
    return newBlock;
  }, [simulatedBlockchain]);


  const createWallet = useCallback(() => {
    const address = generateFakeAddress();
    const privateKey = generateFakePrivateKey();
    const seedPhrase = generateFakeSeedPhrase();
    const initialBalance = 100;

    const newWallet: SimulatedWallet = {
      address,
      privateKey,
      seedPhrase,
      balance: initialBalance,
      walletTypeConcept: WalletType.SIMULATED_HOT,
    };
    setSimulatedWallet(newWallet);
    setUserNonce(prev => ({...prev, [address]: 0}));

    const gasPrice = generateFakeGasPrice();
    const gasUsed = generateFakeGasUsed();

    const initialTransactionDraft: Omit<SimulatedTransaction, 'blockId'> = {
      id: crypto.randomUUID(),
      type: TransactionType.INITIAL,
      amount: initialBalance,
      fromAddress: "0x0000000000000000000000000000000000000000", // Genesis source
      toAddress: address,
      timestamp: new Date(),
      description: `Khởi tạo ví với ${initialBalance} ${DEFAULT_CURRENCY.symbol}`,
      gasPrice: gasPrice,
      gasUsed: gasUsed,
      transactionFee: parseFloat(((gasPrice * gasUsed) / 1e9).toFixed(5)), 
      nonce: 0, 
    };
    
    const newBlock = addTransactionToBlock(initialTransactionDraft);
    const transactionWithBlockId: SimulatedTransaction = {...initialTransactionDraft, blockId: newBlock.id};
    
    setTransactions([transactionWithBlockId]);
    
    addNotification(`Ví mô phỏng mới đã được tạo thành công!`, 'success');
  }, [addNotification, addTransactionToBlock]);

  const handleSendTransaction = useCallback((toAddress: string, amount: number): boolean => {
    if (!simulatedWallet || simulatedWallet.balance < amount) {
      addNotification("Số dư không đủ hoặc ví không tồn tại.", 'error');
      return false;
    }
    if (amount <= 0) {
      addNotification("Số tiền gửi phải lớn hơn 0.", 'error');
      return false;
    }
    if (toAddress === simulatedWallet.address) {
      addNotification("Bạn không thể gửi ${DEFAULT_CURRENCY.symbol} cho chính mình.", 'error');
      return false;
    }

    const currentAddressNonce = userNonce[simulatedWallet.address] || 0;
    const gasPrice = generateFakeGasPrice();
    const gasUsed = generateFakeGasUsed();
    const transactionFee = parseFloat(((gasPrice * gasUsed) / 1e9).toFixed(5)); // Example conversion, in real scenario, this would be BigInt

    if (simulatedWallet.balance < amount + transactionFee) {
        addNotification(`Số dư không đủ để gửi ${amount} ${DEFAULT_CURRENCY.symbol} và trả phí ${transactionFee} ${DEFAULT_CURRENCY.symbol}.`, 'error');
        return false;
    }


    const newTransactionDraft: Omit<SimulatedTransaction, 'blockId'> = {
      id: crypto.randomUUID(),
      type: TransactionType.SEND,
      amount,
      fromAddress: simulatedWallet.address,
      toAddress,
      timestamp: new Date(),
      description: `Gửi ${amount} ${DEFAULT_CURRENCY.symbol} tới ${toAddress.substring(0,10)}...`,
      gasPrice: gasPrice,
      gasUsed: gasUsed,
      transactionFee: transactionFee,
      nonce: generateFakeNonce(currentAddressNonce),
    };

    const newBlock = addTransactionToBlock(newTransactionDraft);
    const transactionWithBlockId: SimulatedTransaction = {...newTransactionDraft, blockId: newBlock.id};

    setTransactions(prev => [transactionWithBlockId, ...prev]);
    setSimulatedWallet(prev => prev ? { ...prev, balance: prev.balance - amount - transactionFee } : null);
    setUserNonce(prev => ({...prev, [simulatedWallet.address]: (prev[simulatedWallet.address] || 0) + 1}));
    
    addNotification(`Đã gửi ${amount} ${DEFAULT_CURRENCY.symbol} thành công!`, 'success');
    return true;
  }, [simulatedWallet, userNonce, addNotification, addTransactionToBlock]);

  const handleReceiveFromFaucet = useCallback(() => {
    if (!simulatedWallet) {
      addNotification("Vui lòng tạo ví trước khi nhận từ Faucet.", 'error');
      return;
    }
    const faucetAmount = 50; // Amount from faucet
    const gasPrice = generateFakeGasPrice(); // Faucet tx might also have simulated gas details
    const gasUsed = 21000; // Simplified gas for a transfer-like operation
    const transactionFee = parseFloat(((gasPrice * gasUsed) / 1e9).toFixed(5));

    const faucetTransactionDraft: Omit<SimulatedTransaction, 'blockId'> = {
      id: crypto.randomUUID(),
      type: TransactionType.FAUCET,
      amount: faucetAmount,
      fromAddress: "0xFaucetAddressSimulated00000000000000000", // Simulated Faucet Address
      toAddress: simulatedWallet.address,
      timestamp: new Date(),
      description: `Nhận ${faucetAmount} ${DEFAULT_CURRENCY.symbol} từ Faucet`,
      gasPrice: gasPrice,
      gasUsed: gasUsed,
      transactionFee: transactionFee, 
      nonce: 0, // Faucet transactions might not follow user nonce, or have their own
    };

    const newBlock = addTransactionToBlock(faucetTransactionDraft);
    const transactionWithBlockId: SimulatedTransaction = {...faucetTransactionDraft, blockId: newBlock.id};

    setTransactions(prev => [transactionWithBlockId, ...prev]);
    setSimulatedWallet(prev => prev ? { ...prev, balance: prev.balance + faucetAmount } : null);
    
    addNotification(`Đã nhận ${faucetAmount} ${DEFAULT_CURRENCY.symbol} từ Faucet!`, 'success');
  }, [simulatedWallet, addNotification, addTransactionToBlock]);

  const handleResetWallet = () => {
    setSimulatedWallet(null);
    setTransactions([]);
    setSimulatedBlockchain([]);
    setUserNonce({});
    localStorage.removeItem(SIMULATOR_WALLET_KEY);
    localStorage.removeItem(SIMULATOR_TRANSACTIONS_KEY);
    localStorage.removeItem(SIMULATOR_BLOCKCHAIN_KEY);
    addNotification("Ví mô phỏng và lịch sử giao dịch đã được xóa.", 'info');
  };

  const handleViewTransactionDetails = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (tx) {
        const block = simulatedBlockchain.find(b => b.id === tx.blockId);
        setSelectedTxForExplorer({tx, block});
        setExplorerModalOpen(true);
    } else {
        addNotification("Không tìm thấy chi tiết giao dịch.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-down">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-3">Mô Phỏng Ví Tài Sản Mã Hoá</h1>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Thực hành tạo ví, gửi và nhận ${DEFAULT_CURRENCY.symbol} (Tài sản mã hoá mô phỏng). Tìm hiểu về địa chỉ ví, khóa riêng tư và cụm từ khôi phục trong môi trường an toàn.
        </p>
      </section>

      {!simulatedWallet ? (
        <CreateWalletView onCreateWallet={createWallet} />
      ) : (
        <WalletDashboard 
          wallet={simulatedWallet} 
          transactions={transactions}
          onSend={handleSendTransaction}
          onReceive={handleReceiveFromFaucet}
          onResetWallet={handleResetWallet}
          onCopy={onCopy}
          onViewDetails={handleViewTransactionDetails}
        />
      )}
      
      <section className="mt-10 p-4 md:p-6 bg-slate-800/40 rounded-xl shadow-xl ring-1 ring-slate-700/50">
          <h2 className="text-2xl md:text-3xl font-semibold text-sky-400 mb-4 text-center">
            Sổ Cái Blockchain Mô Phỏng ({DEFAULT_CURRENCY.symbol})
          </h2>
          <p className="text-sm text-slate-400 text-center mb-1">
            Mỗi khi bạn thực hiện một hành động (tạo ví, gửi/nhận ${DEFAULT_CURRENCY.symbol}), một khối mới (block) chứa giao dịch đó sẽ được thêm vào chuỗi (chain) bên dưới.
          </p>
          <p className="text-xs text-slate-500 text-center mb-6">
            Đây là một phiên bản đơn giản hóa của sổ cái blockchain, minh họa cách các giao dịch được ghi lại một cách công khai và bất biến.
          </p>
          <BlockchainLedgerDisplay blockchain={simulatedBlockchain} onViewDetails={handleViewTransactionDetails} />
      </section>

      <div className="mt-8 p-4 bg-sky-800/30 text-sky-200 text-sm rounded-md ring-1 ring-sky-700/50 flex items-start">
        <LightBulbIcon className="w-6 h-6 mr-3 flex-shrink-0 text-sky-400" />
        <div>
          <strong className="font-semibold">Mẹo học tập:</strong>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>Sao chép địa chỉ ví mô phỏng của bạn và thử gửi ${DEFAULT_CURRENCY.symbol} cho chính nó (sẽ bị từ chối).</li>
            <li>Thử gửi một số lượng ${DEFAULT_CURRENCY.symbol} lớn hơn số dư hiện có.</li>
            <li>Quan sát cách các khối mới được thêm vào sổ cái blockchain mô phỏng sau mỗi giao dịch.</li>
            <li>Nhấn vào nút kính lúp trên mỗi giao dịch để xem chi tiết giao dịch và khối chứa nó.</li>
          </ul>
        </div>
      </div>

       {selectedTxForExplorer && (
        <Modal 
            isOpen={explorerModalOpen} 
            onClose={() => setExplorerModalOpen(false)}
            title={`Chi Tiết Giao Dịch (Mô Phỏng)`}
            size="lg"
        >
            <TransactionExplorerDetail 
                transaction={selectedTxForExplorer.tx} 
                block={selectedTxForExplorer.block} 
            />
        </Modal>
      )}

    </div>
  );
};

export default SimulatorView;
