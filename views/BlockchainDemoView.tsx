
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BlockchainDemoBlockState, BlockchainDemoPeerState } from '../types';
import { sha256 } from '../utils/cryptoSim';
import { 
    CubeTransparentIcon, 
    CogIcon, 
    LinkIcon, 
    UserGroupIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    AcademicCapIcon, 
    InformationCircleIcon,
    IconProps // Import IconProps
} from '../components/Icons';

const MINING_DIFFICULTY = 4; // Number of leading zeros for a valid hash
const HASH_ZERO_PREFIX = '0'.repeat(MINING_DIFFICULTY);

interface DemoBlockProps {
  block: BlockchainDemoBlockState;
  onDataChange?: (blockUniqueId: string, newData: string) => void;
  onNonceChange?: (blockUniqueId: string, newNonce: string) => void;
  onMine?: (blockUniqueId: string) => void;
  isBlockchainContext?: boolean; // True if part of a chain, to show prevHash input
  isFirstInChain?: boolean; // True if it's the genesis block in a chain context
  highlightColor?: string; // e.g. 'bg-green-700/30' for valid, 'bg-red-700/30' for invalid
}

const DemoBlockComponent: React.FC<DemoBlockProps> = ({
  block,
  onDataChange,
  onNonceChange,
  onMine,
  isBlockchainContext = false,
  isFirstInChain = false,
  highlightColor
}) => {
  const baseBg = highlightColor || (block.isMined ? 'bg-green-700/20 ring-green-500/70' : 'bg-red-700/20 ring-red-500/70');
  const canEdit = !!onDataChange || !!onNonceChange;

  return (
    <div className={`p-3 md:p-4 border rounded-lg shadow-md transition-all duration-300 ${baseBg} hover:shadow-lg`}>
      <h4 className="text-sm font-semibold mb-2 text-sky-300">Khối #{block.idChain}</h4>
      <div className="space-y-2 text-xs">
        {isBlockchainContext && (
          <div>
            <label htmlFor={`prevHash-${block.uniqueId}`} className="block text-slate-400 mb-0.5">Hash Khối Trước:</label>
            <input
              type="text"
              id={`prevHash-${block.uniqueId}`}
              value={block.prevHash}
              readOnly
              className="w-full p-1.5 bg-slate-800/50 border border-slate-600 rounded text-slate-500 text-[10px] font-mono truncate"
              title={block.prevHash}
            />
          </div>
        )}
        <div>
          <label htmlFor={`nonce-${block.uniqueId}`} className="block text-slate-400 mb-0.5">Nonce:</label>
          <input
            type="text"
            id={`nonce-${block.uniqueId}`}
            value={block.nonce}
            onChange={onNonceChange ? (e) => onNonceChange(block.uniqueId, e.target.value) : undefined}
            readOnly={!onNonceChange || !canEdit}
            className={`w-full p-1.5 bg-slate-700 border border-slate-600 rounded text-slate-100 ${!canEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
            aria-label={`Nonce cho khối ${block.idChain}`}
          />
        </div>
        <div>
          <label htmlFor={`data-${block.uniqueId}`} className="block text-slate-400 mb-0.5">Dữ Liệu:</label>
          <textarea
            id={`data-${block.uniqueId}`}
            value={block.data}
            onChange={onDataChange ? (e) => onDataChange(block.uniqueId, e.target.value) : undefined}
            readOnly={!onDataChange || !canEdit}
            rows={isBlockchainContext ? 2 : 3}
            className={`w-full p-1.5 bg-slate-700 border border-slate-600 rounded text-slate-100 custom-scrollbar ${!canEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
            aria-label={`Dữ liệu cho khối ${block.idChain}`}
          />
        </div>
        <div>
          <label htmlFor={`hash-${block.uniqueId}`} className="block text-slate-400 mb-0.5">Hash Khối Này:</label>
          <input
            type="text"
            id={`hash-${block.uniqueId}`}
            value={block.hash}
            readOnly
            className={`w-full p-1.5 bg-slate-800/50 border border-slate-600 rounded text-[10px] font-mono truncate ${block.isMined ? 'text-green-400' : 'text-red-400'}`}
            title={block.hash}
          />
        </div>
        {onMine && canEdit && (
          <button
            onClick={() => onMine(block.uniqueId)}
            disabled={block.isMined && !isBlockchainContext} // In blockchain context, can always re-mine
            className="w-full mt-2 py-1.5 px-3 text-xs bg-sky-600 hover:bg-sky-500 text-white rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <CogIcon className="w-3.5 h-3.5 mr-1.5" /> Đào (Mine)
          </button>
        )}
      </div>
    </div>
  );
};


// --- Hash Section ---
const HashDemoSection: React.FC = () => {
  const [data, setData] = useState<string>('Xin chào bạn đến với demo blockchain của Trần Tuấn Thành (trantuanthanh.net)! Hãy thử thay đổi nội dung này.');
  const [currentHash, setCurrentHash] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateHash = useCallback(async (inputData: string) => {
    setIsCalculating(true);
    const hashValue = await sha256(inputData);
    setCurrentHash(hashValue);
    setIsCalculating(false);
  }, []);

  useEffect(() => {
    calculateHash(data);
  }, [data, calculateHash]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-sky-400">1. Hàm Băm (Hash Function)</h2>
      <p className="text-sm text-slate-300">
        Hàm băm là một thuật toán nhận đầu vào là dữ liệu bất kỳ (văn bản, tệp, v.v.) và trả về một chuỗi ký tự có độ dài cố định, được gọi là "giá trị băm" (hash value).
        Trong blockchain, hàm băm SHA-256 (Secure Hash Algorithm 256-bit) thường được sử dụng.
      </p>
      <div className="p-4 bg-slate-700/50 rounded-lg shadow-md">
        <label htmlFor="hash-data-input" className="block text-sm font-medium text-slate-300 mb-1">Dữ liệu đầu vào:</label>
        <textarea
          id="hash-data-input"
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={4}
          className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500 custom-scrollbar"
          placeholder="Nhập dữ liệu bất kỳ ở đây..."
        />
      </div>
      <div className="p-4 bg-slate-700/50 rounded-lg shadow-md">
        <label htmlFor="hash-output" className="block text-sm font-medium text-slate-300 mb-1">Giá trị băm SHA-256 (Output):</label>
        <input
          id="hash-output"
          type="text"
          value={isCalculating ? "Đang tính toán..." : currentHash}
          readOnly
          className={`w-full p-2 bg-slate-800 border border-slate-600 rounded-md font-mono text-sm break-all ${isCalculating ? 'text-slate-500' : 'text-green-400'}`}
        />
      </div>
      <div className="text-sm text-slate-400 space-y-1">
        <p><strong className="text-sky-300">Đặc điểm chính của hàm băm (SHA-256):</strong></p>
        <ul className="list-disc list-inside pl-4">
          <li><strong>Tính xác định (Deterministic):</strong> Cùng một đầu vào luôn tạo ra cùng một giá trị băm.</li>
          <li><strong>Hiệu ứng thác đổ (Avalanche Effect):</strong> Một thay đổi nhỏ ở đầu vào (dù chỉ một ký tự) sẽ tạo ra một giá trị băm hoàn toàn khác biệt.</li>
          <li><strong>Tính một chiều (One-way):</strong> Rất khó (gần như không thể) suy ngược lại dữ liệu gốc từ giá trị băm.</li>
          <li><strong>Chống xung đột (Collision Resistant):</strong> Rất khó tìm thấy hai đầu vào khác nhau lại tạo ra cùng một giá trị băm. (Mặc dù trên lý thuyết có thể, nhưng với SHA-256, khả năng này cực kỳ thấp).</li>
        </ul>
      </div>
    </section>
  );
};

// --- Block Section ---
const BlockDemoSection: React.FC = () => {
  const initialBlockData: BlockchainDemoBlockState = {
    uniqueId: 'single-block-demo',
    idChain: 1,
    nonce: "12345",
    data: "Xin chào, tôi là một khối (block)!",
    prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "",
    isMined: false,
  };
  const [block, setBlock] = useState<BlockchainDemoBlockState>(initialBlockData);
  const [isMining, setIsMining] = useState(false);

  const calculateBlockHash = useCallback(async (b: BlockchainDemoBlockState): Promise<BlockchainDemoBlockState> => {
    const stringToHash = `${b.idChain}${b.prevHash}${b.nonce}${b.data}`;
    const newHash = await sha256(stringToHash);
    const isMined = newHash.startsWith(HASH_ZERO_PREFIX);
    return { ...b, hash: newHash, isMined };
  }, []);

  useEffect(() => {
    calculateBlockHash(block).then(setBlock);
  }, [block.data, block.nonce, block.prevHash, block.idChain, calculateBlockHash]);

  const handleDataChange = (_blockId: string, newData: string) => {
    setBlock(prev => ({ ...prev, data: newData, isMined: false }));
  };

  const handleNonceChange = (_blockId: string, newNonce: string) => {
    setBlock(prev => ({ ...prev, nonce: newNonce, isMined: false }));
  };

  const mineBlock = async (_blockId: string) => {
    setIsMining(true);
    let currentNonce = 0;
    let tempBlock = { ...block, nonce: String(currentNonce) };
    let newBlockState = await calculateBlockHash(tempBlock);

    while (!newBlockState.isMined) {
      currentNonce++;
      // Add a small delay to prevent freezing the browser during intense computation & allow UI update
      if (currentNonce % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0)); 
      }
      tempBlock = { ...block, nonce: String(currentNonce) };
      newBlockState = await calculateBlockHash(tempBlock);
      if (currentNonce > 200000) { // Safety break for demo
          console.warn("Mining stopped after 200,000 attempts for demo purposes.");
          setBlock(prev => ({...prev, nonce: String(currentNonce), hash: newBlockState.hash, isMined: newBlockState.isMined})); // Update with last attempt
          break;
      }
    }
    setBlock(newBlockState);
    setIsMining(false);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-sky-400">2. Khối (Block)</h2>
      <p className="text-sm text-slate-300">
        Một khối trong blockchain là một tập hợp các dữ liệu. Quan trọng nhất, nó chứa một giá trị băm (hash) của chính nó, giá trị băm của khối trước đó (tạo thành chuỗi), và một "nonce".
        Việc "đào" một khối (mining) là quá trình tìm ra một giá trị Nonce sao cho khi kết hợp với các dữ liệu khác trong khối và băm lại, giá trị băm kết quả phải thỏa mãn một điều kiện nhất định (ví dụ: bắt đầu bằng một số lượng số 0 nhất định - đây là Proof-of-Work).
      </p>
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <DemoBlockComponent
          block={block}
          onDataChange={handleDataChange}
          onNonceChange={handleNonceChange}
          onMine={mineBlock}
        />
        <div className="text-sm text-slate-300 space-y-2 p-4 bg-slate-700/30 rounded-lg">
          <p><strong className="text-sky-300">Thành phần của một khối (mô phỏng):</strong></p>
          <ul className="list-disc list-inside pl-4 text-xs">
            <li><strong>Số Khối (Block #):</strong> Số thứ tự của khối trong chuỗi.</li>
            <li><strong>Nonce:</strong> Một con số tùy ý mà thợ đào thay đổi để tìm ra hash hợp lệ.</li>
            <li><strong>Dữ Liệu (Data):</strong> Nội dung của khối, thường là danh sách các giao dịch (trong demo này là văn bản tự do).</li>
            <li><strong>Hash Khối Trước (Prev. Hash):</strong> Giá trị băm của khối đứng ngay trước nó trong chuỗi. Khối đầu tiên (genesis block) thường có giá trị này là toàn số 0.</li>
            <li><strong>Hash:</strong> Giá trị băm của toàn bộ nội dung khối này (bao gồm cả số khối, nonce, dữ liệu, và hash khối trước).</li>
          </ul>
          <p className="mt-2">
            Nếu bạn thay đổi Dữ liệu hoặc Nonce, giá trị Hash sẽ thay đổi. Khối sẽ chuyển sang màu đỏ (không hợp lệ).
            Nhấn nút "Đào (Mine)" để máy tính tự động tìm Nonce sao cho Hash bắt đầu bằng <code className="bg-slate-600 px-1 rounded text-xs">{MINING_DIFFICULTY}</code> số 0 (màu xanh lá = hợp lệ).
          </p>
          {isMining && <p className="text-yellow-400 animate-pulse">Đang đào khối... (Có thể mất một chút thời gian)</p>}
        </div>
      </div>
    </section>
  );
};


// --- Blockchain (Chain of Blocks) Section ---
const BlockchainChainDemoSection: React.FC = () => {
  const createNewBlockState = (idChain: number, prevHash: string, data: string = ""): BlockchainDemoBlockState => ({
    uniqueId: crypto.randomUUID(),
    idChain,
    nonce: "0",
    data: data || `Dữ liệu cho khối ${idChain}`,
    prevHash,
    hash: "",
    isMined: false,
  });

  const [chain, setChain] = useState<BlockchainDemoBlockState[]>(() => {
    const genesisBlock = createNewBlockState(1, "0".repeat(64), "Khối Nguyên Thủy (Genesis Block)");
    // Calculate initial hash for genesis block
    // This is simplified; in reality, genesis block might be pre-mined or have specific rules
    return [genesisBlock]; 
  });
  const [miningBlockId, setMiningBlockId] = useState<string | null>(null);

  // Function to re-calculate hash for a single block and update its state
  const calculateAndUpdateSingleBlock = useCallback(async (currentBlock: BlockchainDemoBlockState): Promise<BlockchainDemoBlockState> => {
    const stringToHash = `${currentBlock.idChain}${currentBlock.prevHash}${currentBlock.nonce}${currentBlock.data}`;
    const newHash = await sha256(stringToHash);
    const isMined = newHash.startsWith(HASH_ZERO_PREFIX);
    return { ...currentBlock, hash: newHash, isMined };
  }, []);

  // Effect to initialize/update hashes for all blocks when chain is first set up or structure changes
  useEffect(() => {
    const initializeHashes = async () => {
      let previousValidHash = "0".repeat(64);
      const newChain = [];
      for (let i = 0; i < chain.length; i++) {
        let currentBlock = { ...chain[i], prevHash: i === 0 ? "0".repeat(64) : previousValidHash };
        currentBlock = await calculateAndUpdateSingleBlock(currentBlock);
        newChain.push(currentBlock);
        if (currentBlock.isMined) { // Only update previousValidHash if the block is mined
             previousValidHash = currentBlock.hash;
        } else { // If a block is not mined, subsequent blocks are technically invalid (or rely on an invalid prevHash)
            // For demo purposes, we can let them use the calculated hash of the unmined block
            // or mark them as dependent on an unmined block.
            // For simplicity here, we use its current hash, but visually it will be red.
             previousValidHash = currentBlock.hash; 
        }
      }
      setChain(newChain);
    };
    if (chain.length > 0 && chain.some(b => b.hash === "")) { // Only run if hashes need initialization
        initializeHashes();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to init hashes, or if chain structure changes fundamentally (not content)


  const updateChainHashesFromIndex = useCallback(async (startIndex: number, currentChain: BlockchainDemoBlockState[]): Promise<BlockchainDemoBlockState[]> => {
    const updatedChain = [...currentChain];
    for (let i = startIndex; i < updatedChain.length; i++) {
      if (i > 0) {
        updatedChain[i].prevHash = updatedChain[i-1].hash; // Link to the new hash of the previous block
      }
      const revalidatedBlock = await calculateAndUpdateSingleBlock(updatedChain[i]);
      updatedChain[i] = revalidatedBlock;
    }
    return updatedChain;
  }, [calculateAndUpdateSingleBlock]);
  
  const handleBlockDataChange = useCallback(async (blockUniqueId: string, newData: string) => {
    setChain(prevChain => {
        const blockIndex = prevChain.findIndex(b => b.uniqueId === blockUniqueId);
        if (blockIndex === -1) return prevChain;

        const newChain = prevChain.map((b, idx) => 
            idx === blockIndex ? { ...b, data: newData, isMined: false } : b
        );
        // Asynchronously update subsequent hashes
        updateChainHashesFromIndex(blockIndex, newChain).then(setChain);
        return newChain; // Return immediately for responsiveness, async update follows
    });
  }, [updateChainHashesFromIndex]);

  const handleBlockNonceChange = useCallback(async (blockUniqueId: string, newNonce: string) => {
     setChain(prevChain => {
        const blockIndex = prevChain.findIndex(b => b.uniqueId === blockUniqueId);
        if (blockIndex === -1) return prevChain;
        
        const newChain = prevChain.map((b, idx) => 
            idx === blockIndex ? { ...b, nonce: newNonce, isMined: false } : b
        );
        updateChainHashesFromIndex(blockIndex, newChain).then(setChain);
        return newChain;
    });
  }, [updateChainHashesFromIndex]);


  const mineBlockInChain = useCallback(async (blockUniqueId: string) => {
    setMiningBlockId(blockUniqueId);
    let currentChain = [...chain];
    const blockIndex = currentChain.findIndex(b => b.uniqueId === blockUniqueId);

    if (blockIndex === -1) {
      setMiningBlockId(null);
      return;
    }

    let currentNonce = 0;
    let tempBlock = { ...currentChain[blockIndex], nonce: String(currentNonce) };
    if (blockIndex > 0) { // Ensure prevHash is correct before mining
        tempBlock.prevHash = currentChain[blockIndex-1].hash;
    }
    
    let newBlockState = await calculateAndUpdateSingleBlock(tempBlock);

    while (!newBlockState.isMined) {
      currentNonce++;
      if (currentNonce % 1000 === 0) {
        setChain(prev => prev.map(b => b.uniqueId === blockUniqueId ? {...newBlockState, nonce: String(currentNonce)} : b)); // Update UI periodically
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      tempBlock = { ...currentChain[blockIndex], nonce: String(currentNonce) };
       if (blockIndex > 0) {
           tempBlock.prevHash = currentChain[blockIndex-1].hash; // Re-ensure prevHash consistency during loop
       }
      newBlockState = await calculateAndUpdateSingleBlock(tempBlock);
      if (currentNonce > 200000) { // Safety break
        console.warn("Mining stopped after 200,000 attempts for demo purposes.");
        break;
      }
    }
    
    currentChain[blockIndex] = newBlockState;
    const finalUpdatedChain = await updateChainHashesFromIndex(blockIndex, currentChain); // Update current block and all subsequent
    
    setChain(finalUpdatedChain);
    setMiningBlockId(null);
  }, [chain, calculateAndUpdateSingleBlock, updateChainHashesFromIndex]);

  const addDemoBlock = () => {
    setChain(prevChain => {
      const lastBlock = prevChain[prevChain.length - 1];
      const newBlock = createNewBlockState(prevChain.length + 1, lastBlock.hash, `Khối mới #${prevChain.length + 1}`);
      // Calculate hash for the new block before adding
      calculateAndUpdateSingleBlock(newBlock).then(calculatedNewBlock => {
          setChain(currentChain => [...currentChain, calculatedNewBlock]);
      });
      return prevChain; // Return old chain for now, async update will add the new block
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-sky-400">3. Chuỗi Khối (Blockchain)</h2>
      <p className="text-sm text-slate-300">
        Blockchain là một chuỗi các khối được liên kết với nhau bằng mật mã. Mỗi khối (trừ khối nguyên thủy) chứa giá trị băm của khối trước đó.
        Điều này tạo ra một chuỗi bất biến: nếu dữ liệu trong một khối bị thay đổi, giá trị băm của khối đó sẽ thay đổi, làm cho liên kết với khối tiếp theo bị sai lệch, và do đó toàn bộ chuỗi từ điểm đó trở đi sẽ không hợp lệ.
        Bạn phải "đào" lại khối bị thay đổi và tất cả các khối sau nó để làm cho chuỗi hợp lệ trở lại.
      </p>
       <button 
        onClick={addDemoBlock}
        className="mb-4 py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded shadow-md text-sm"
      >
        Thêm Khối Demo
      </button>
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto custom-scrollbar pb-4 items-start">
        {chain.map((b, index) => (
          <div key={b.uniqueId} className="md:min-w-[280px] md:max-w-[320px] w-full flex-shrink-0 relative">
             { index > 0 && 
                <div className="absolute left-1/2 -top-3.5 transform -translate-x-1/2 rotate-90 md:left-auto md:top-1/2 md:-left-2.5 md:-translate-y-1/2 md:rotate-0 z-0">
                    <LinkIcon className={`w-5 h-5 ${chain[index-1].isMined && b.prevHash === chain[index-1].hash ? 'text-green-500' : 'text-red-500 animate-pulse'}`} />
                </div>
            }
            <DemoBlockComponent
              block={b}
              onDataChange={handleBlockDataChange}
              onNonceChange={handleBlockNonceChange}
              onMine={mineBlockInChain}
              isBlockchainContext={true}
              isFirstInChain={index === 0}
              highlightColor={ (b.isMined && (index === 0 || b.prevHash === chain[index-1].hash)) ? 'bg-green-700/20 ring-green-500/70' : 'bg-red-700/20 ring-red-500/70'}
            />
            {miningBlockId === b.uniqueId && <p className="text-xs text-yellow-400 animate-pulse text-center mt-1">Đang đào...</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Distributed Ledger Section ---
const DistributedLedgerDemoSection: React.FC = () => {
  const createInitialChain = (length: number = 3, peerName: string): BlockchainDemoBlockState[] => {
    const newChain: BlockchainDemoBlockState[] = [];
    let prevHash = "0".repeat(64);
    for (let i = 0; i < length; i++) {
      const blockData = `Khối ${i+1} của ${peerName}`;
      const block = {
        uniqueId: `${peerName}-block-${i+1}-${crypto.randomUUID()}`,
        idChain: i + 1,
        nonce: "0", // Will be mined
        data: blockData,
        prevHash: prevHash,
        hash: "",
        isMined: false,
      };
      newChain.push(block);
      // In a real scenario, we'd need to calculate/mine this hash to set next prevHash
      // For setup, we'll use placeholder hashes and then "mine" them all.
      prevHash = `placeholder_hash_for_${block.idChain}`; 
    }
    return newChain;
  };
  
  const [peers, setPeers] = useState<BlockchainDemoPeerState[]>(() => [
    { id: 'peerA', name: "Peer A", chain: createInitialChain(3, "Peer A") },
    { id: 'peerB', name: "Peer B", chain: createInitialChain(3, "Peer B") },
    { id: 'peerC', name: "Peer C", chain: createInitialChain(3, "Peer C") },
  ]);

  const [miningState, setMiningState] = useState<{peerId: string, blockUniqueId: string} | null>(null);

  // Function to calculate and update a single block's hash and mined status
  const calculateBlockDetails = useCallback(async (block: BlockchainDemoBlockState): Promise<BlockchainDemoBlockState> => {
    const stringToHash = `${block.idChain}${block.prevHash}${block.nonce}${block.data}`;
    const hash = await sha256(stringToHash);
    const isMined = hash.startsWith(HASH_ZERO_PREFIX);
    return { ...block, hash, isMined };
  }, []);

  // Mine an entire chain for a peer
  const mineEntirePeerChain = useCallback(async (peerId: string) => {
    setPeers(prevPeers => 
        prevPeers.map(p => {
            if (p.id === peerId) {
                // Mark all blocks for this peer as needing mining update
                return {...p, chain: p.chain.map(b => ({...b, isMined: false, hash: ''}))};
            }
            return p;
        })
    );
    
    // Simulate mining sequentially for visual effect and to avoid race conditions
    // This is a simplified "mine all" function
    const peerIndex = peers.findIndex(p => p.id === peerId);
    if (peerIndex === -1) return;

    let currentChain = [...peers[peerIndex].chain];
    let newPeerChain: BlockchainDemoBlockState[] = [];

    for (let i = 0; i < currentChain.length; i++) {
        setMiningState({ peerId, blockUniqueId: currentChain[i].uniqueId });
        let blockToMine = { ...currentChain[i] };
        blockToMine.prevHash = i === 0 ? "0".repeat(64) : newPeerChain[i-1].hash;
        
        let currentNonce = 0;
        blockToMine.nonce = String(currentNonce);
        let minedBlock = await calculateBlockDetails(blockToMine);

        while(!minedBlock.isMined) {
            currentNonce++;
            blockToMine.nonce = String(currentNonce);
            if (currentNonce % 1000 === 0) { // UI update and yield
                 setPeers(prev => prev.map(p => p.id === peerId ? {...p, chain: [...newPeerChain, {...minedBlock, nonce: String(currentNonce)}]} : p));
                 await new Promise(resolve => setTimeout(resolve, 0));
            }
            minedBlock = await calculateBlockDetails(blockToMine);
            if(currentNonce > 200000) { console.warn("Safety break for distributed mine"); break; }
        }
        newPeerChain.push(minedBlock);
        // Update state progressively for this peer
        setPeers(prev => prev.map(p => p.id === peerId ? {...p, chain: [...newPeerChain, ...currentChain.slice(i+1)]} : p));
    }
    setMiningState(null);
  }, [peers, calculateBlockDetails]);


  // Initialize all peer chains by mining them
  useEffect(() => {
    const initializeAllPeers = async () => {
        for (const peer of peers) {
            if (peer.chain.some(b => !b.isMined || b.hash === "")) {
                await mineEntirePeerChain(peer.id);
            }
        }
    };
    initializeAllPeers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  const handlePeerBlockDataChange = (peerId: string, blockUniqueId: string, newData: string) => {
    setPeers(prevPeers => prevPeers.map(peer => {
      if (peer.id === peerId) {
        let blockIndex = -1;
        const updatedChain = peer.chain.map((b, idx) => {
          if (b.uniqueId === blockUniqueId) {
            blockIndex = idx;
            return { ...b, data: newData, isMined: false };
          }
          return b;
        });
        
        // Propagate invalidity (simplified: just mark subsequent as unmined and recalculate their hashes)
        if (blockIndex !== -1) {
            for(let i = blockIndex + 1; i < updatedChain.length; i++) {
                updatedChain[i].isMined = false;
            }
            // Recalculate hashes from the changed block onwards
            const recalculateAndUpdate = async () => {
                let tempChain = [...updatedChain];
                for (let i = blockIndex; i < tempChain.length; i++) {
                    if (i > 0) tempChain[i].prevHash = tempChain[i-1].hash; // Update prevHash
                    tempChain[i] = await calculateBlockDetails(tempChain[i]);
                }
                setPeers(currentPeers => currentPeers.map(p => p.id === peerId ? {...p, chain: tempChain} : p));
            };
            recalculateAndUpdate();
        }
        return { ...peer, chain: updatedChain };
      }
      return peer;
    }));
  };
  
  const handlePeerBlockMine = async (peerId: string, blockUniqueId: string) => {
    setMiningState({ peerId, blockUniqueId });
    const peerIndex = peers.findIndex(p => p.id === peerId);
    if (peerIndex === -1) { setMiningState(null); return; }

    let currentPeerChain = [...peers[peerIndex].chain];
    const blockIndex = currentPeerChain.findIndex(b => b.uniqueId === blockUniqueId);
    if (blockIndex === -1) { setMiningState(null); return; }

    let blockToMine = { ...currentPeerChain[blockIndex] };
    if (blockIndex > 0) { // Ensure prevHash is correct from previous block in THIS peer's chain
      blockToMine.prevHash = currentPeerChain[blockIndex - 1].hash;
    }
    
    let currentNonceVal = 0;
    blockToMine.nonce = String(currentNonceVal);
    let minedBlock = await calculateBlockDetails(blockToMine);

    while(!minedBlock.isMined) {
        currentNonceVal++;
        blockToMine.nonce = String(currentNonceVal);
         if (currentNonceVal % 1000 === 0) { // UI update and yield
            setPeers(prev => prev.map(p => {
                if(p.id === peerId) {
                    const tempChain = [...p.chain];
                    tempChain[blockIndex] = {...minedBlock, nonce: String(currentNonceVal)};
                    return {...p, chain: tempChain};
                }
                return p;
            }));
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        minedBlock = await calculateBlockDetails(blockToMine);
        if(currentNonceVal > 200000) { console.warn("Safety break for distributed mine single block"); break;}
    }
    
    currentPeerChain[blockIndex] = minedBlock;
    
    // After mining, recalculate all subsequent blocks for this peer
    for (let i = blockIndex + 1; i < currentPeerChain.length; i++) {
        currentPeerChain[i].prevHash = currentPeerChain[i-1].hash; // Link to the newly mined block
        currentPeerChain[i] = await calculateBlockDetails(currentPeerChain[i]); // Recalc hash, isMined will likely be false
    }

    setPeers(prev => prev.map(p => p.id === peerId ? {...p, chain: currentPeerChain} : p));
    setMiningState(null);
  };


  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-sky-400">4. Sổ Cái Phân Tán (Distributed Ledger)</h2>
      <p className="text-sm text-slate-300">
        Một trong những đặc điểm cốt lõi của blockchain là tính phi tập trung. Thay vì một sổ cái duy nhất được kiểm soát bởi một thực thể, nhiều bản sao của sổ cái (blockchain) được lưu trữ trên nhiều máy tính (gọi là "peer" hoặc "node") trong mạng lưới.
      </p>
      <p className="text-sm text-slate-300">
        Khi bạn thay đổi dữ liệu trong một khối trên một peer, chỉ có chuỗi của peer đó trở nên không hợp lệ (màu đỏ). Các peer khác vẫn giữ chuỗi hợp lệ của họ. Điều này minh họa cách mạng lưới có thể phát hiện sự giả mạo. Trong thực tế, các cơ chế đồng thuận (consensus mechanisms) phức tạp hơn được sử dụng để quyết định phiên bản nào của chuỗi là "đúng".
      </p>
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {peers.map(peer => (
          <div key={peer.id} className="p-3 bg-slate-700/30 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-center mb-3 text-sky-300">{peer.name}</h3>
            <div className="space-y-3">
              {peer.chain.map((block, index) => (
                <div key={block.uniqueId} className="relative">
                 { index > 0 && 
                    <div className="absolute left-1/2 -top-1.5 transform -translate-x-1/2 rotate-90 z-0">
                        <LinkIcon className={`w-3 h-3 ${block.isMined && peer.chain[index-1].isMined && block.prevHash === peer.chain[index-1].hash ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                  }
                  <DemoBlockComponent
                    block={block}
                    onDataChange={(blockUId, data) => handlePeerBlockDataChange(peer.id, blockUId, data)}
                    onMine={(blockUId) => handlePeerBlockMine(peer.id, blockUId)}
                    isBlockchainContext={true}
                    isFirstInChain={index === 0}
                    highlightColor={ (block.isMined && (index === 0 || block.prevHash === peer.chain[index-1].hash)) ? 'bg-green-700/20 ring-green-500/70' : 'bg-red-700/20 ring-red-500/70'}
                  />
                  {miningState?.peerId === peer.id && miningState?.blockUniqueId === block.uniqueId && <p className="text-xs text-yellow-400 animate-pulse text-center mt-1">Đang đào...</p>}
                </div>
              ))}
            </div>
             <button 
                onClick={() => mineEntirePeerChain(peer.id)}
                className="w-full mt-3 py-1.5 px-3 text-xs bg-orange-600 hover:bg-orange-500 text-white rounded shadow-md flex items-center justify-center"
              >
                <CogIcon className="w-3.5 h-3.5 mr-1.5" /> Đào Lại Toàn Bộ Chuỗi Của Peer Này
              </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Tokens Section (Conceptual) ---
const TokensDemoSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-sky-400">5. Giao Dịch Token (Tokens)</h2>
      <div className="p-4 bg-slate-700/50 rounded-lg shadow-md text-sm text-slate-300 space-y-3">
        <p>
          Phần "Dữ Liệu" (Data) trong một khối không chỉ là văn bản tự do. Trong các blockchain thực tế như Bitcoin hay Ethereum, phần dữ liệu này thường chứa một danh sách các <strong className="text-yellow-300">giao dịch</strong>.
        </p>
        <p>
          Một giao dịch cơ bản thường bao gồm:
        </p>
        <ul className="list-disc list-inside pl-4 text-xs">
          <li><strong>Người gửi (From):</strong> Địa chỉ ví của người gửi token.</li>
          <li><strong>Người nhận (To):</strong> Địa chỉ ví của người nhận token.</li>
          <li><strong>Số lượng (Amount):</strong> Số token được chuyển.</li>
          <li><strong>Phí giao dịch (Fee):</strong> Một khoản phí nhỏ trả cho thợ đào/người xác thực để xử lý giao dịch.</li>
          <li><strong>Chữ ký số (Digital Signature):</strong> Được tạo bằng khóa riêng tư của người gửi, chứng minh quyền sở hữu và sự đồng ý với giao dịch.</li>
        </ul>
        <p>
          Ví dụ, một giao dịch có thể trông như thế này (đơn giản hóa):
        </p>
        <pre className="bg-slate-800 p-2 rounded text-xs font-mono text-sky-300 overflow-x-auto custom-scrollbar">
{`{
  "from": "0xA1b2C3...",
  "to": "0xD4e5F6...",
  "amount": "1.5 ETH",
  "fee": "0.001 ETH",
  "signature": "0xsig123..."
}`}
        </pre>
        <p>
          Nhiều giao dịch như vậy được gom lại và đưa vào trường "Dữ Liệu" của một khối mới. Khi khối đó được đào và thêm vào blockchain, tất cả các giao dịch bên trong nó được coi là đã xác nhận.
          Mô hình này cho phép chuyển giá trị (token, tài sản mã hoá) một cách an toàn và minh bạch trên mạng lưới phi tập trung.
        </p>
         <div className="mt-3 p-3 bg-sky-800/30 text-sky-200 text-xs rounded-md ring-1 ring-sky-700/50 flex items-start">
            <InformationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 text-sky-400 mt-0.5"/>
            <span>Phần "Mô Phỏng Ví" trong ứng dụng này cho phép bạn thực hành tạo ví và gửi/nhận token mô phỏng, giúp bạn hình dung rõ hơn về quá trình này.</span>
        </div>
      </div>
    </section>
  );
};

// --- Coinbase Section (Conceptual) ---
const CoinbaseDemoSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-sky-400">6. Giao Dịch Coinbase (Phần Thưởng Khối)</h2>
      <div className="p-4 bg-slate-700/50 rounded-lg shadow-md text-sm text-slate-300 space-y-3">
        <p>
          Khi một thợ đào (miner) hoặc người xác thực (validator) thành công trong việc tạo ra một khối mới và thêm nó vào blockchain, họ sẽ nhận được một phần thưởng. Phần thưởng này có hai phần chính:
        </p>
        <ol className="list-decimal list-inside pl-4 text-xs">
          <li><strong>Phần thưởng khối (Block Reward):</strong> Một lượng token mới được tạo ra và trao cho người đào/xác thực. Ví dụ, trong Bitcoin, ban đầu phần thưởng là 50 BTC mỗi khối, và nó giảm một nửa sau mỗi 210,000 khối (sự kiện "halving").</li>
          <li><strong>Phí giao dịch (Transaction Fees):</strong> Toàn bộ phí từ các giao dịch được bao gồm trong khối đó cũng được trao cho người đào/xác thực.</li>
        </ol>
        <p>
          Giao dịch đặc biệt ghi nhận phần thưởng này được gọi là <strong className="text-yellow-300">giao dịch coinbase</strong>. Đây thường là giao dịch đầu tiên trong một khối. Nó không có người gửi (hoặc người gửi là "coinbase"), và người nhận chính là địa chỉ ví của thợ đào/người xác thực.
        </p>
        <p>
          Ví dụ về một giao dịch coinbase (đơn giản hóa):
        </p>
        <pre className="bg-slate-800 p-2 rounded text-xs font-mono text-sky-300 overflow-x-auto custom-scrollbar">
{`{
  "type": "coinbase",
  "to": "0xMinerAddress789...",
  "block_reward": "6.25 BTC", 
  "transaction_fees_collected": "0.12 BTC",
  "total_reward": "6.37 BTC" 
}`}
        </pre>
        <p>
          Giao dịch coinbase là động lực kinh tế quan trọng khuyến khích mọi người tham gia vào việc bảo mật và duy trì mạng lưới blockchain. Nó cũng là cách các token mới được đưa vào lưu thông trong nhiều hệ thống blockchain.
        </p>
      </div>
    </section>
  );
};

// --- Main BlockchainDemoView ---
const BlockchainDemoView: React.FC = () => {
  type DemoTabId = 'hash' | 'block' | 'blockchain' | 'distributed' | 'tokens' | 'coinbase';
  const [activeTab, setActiveTab] = useState<DemoTabId>('hash');

  const tabs: { id: DemoTabId; label: string; icon: React.ReactElement<IconProps> }[] = [
    { id: 'hash', label: 'Hàm Băm', icon: <AcademicCapIcon /> },
    { id: 'block', label: 'Khối', icon: <CubeTransparentIcon /> },
    { id: 'blockchain', label: 'Chuỗi Khối', icon: <LinkIcon /> },
    { id: 'distributed', label: 'Sổ Cái Phân Tán', icon: <UserGroupIcon /> },
    { id: 'tokens', label: 'Giao Dịch Token', icon: <CubeTransparentIcon /> },
    { id: 'coinbase', label: 'Giao Dịch Coinbase', icon: <CubeTransparentIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'hash': return <HashDemoSection />;
      case 'block': return <BlockDemoSection />;
      case 'blockchain': return <BlockchainChainDemoSection />;
      case 'distributed': return <DistributedLedgerDemoSection />;
      case 'tokens': return <TokensDemoSection />;
      case 'coinbase': return <CoinbaseDemoSection />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in-down space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-sky-400 text-center">Khám Phá Công Nghệ Blockchain (Tương Tác)</h1>
      <p className="text-slate-300 max-w-3xl mx-auto text-center text-sm">
        Tìm hiểu các khái niệm cốt lõi của blockchain thông qua các ví dụ tương tác. Nội dung được lấy cảm hứng và Việt hóa từ <a href="https://blockchaindemo.io/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">blockchaindemo.io</a> (tác giả gốc: Sean Han).
      </p>

      <div className="flex flex-wrap justify-center gap-1 border-b border-slate-700 pb-2 mb-4 sticky top-[70px] md:top-[80px] z-20 bg-slate-800/90 backdrop-blur-md py-2 rounded-b-md">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:scale-105
              ${activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
          >
            {React.cloneElement(tab.icon, {className: "w-4 h-4 mr-1.5 hidden sm:inline"})}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-1 md:p-2 min-h-[400px] bg-slate-800/50 rounded-lg shadow-inner ring-1 ring-slate-700/50">
        {renderContent()}
      </div>
    </div>
  );
};

export default BlockchainDemoView;
