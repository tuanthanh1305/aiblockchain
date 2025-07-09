

export interface SimulatedWallet {
  address: string;
  privateKey: string; // Emphasize this is FAKE
  seedPhrase: string[]; // Emphasize this is FAKE
  balance: number;
  walletTypeConcept: WalletType; // To remind user what this sim represents
}

export enum TransactionType {
  SEND = "GỬI",
  RECEIVE = "NHẬN",
  INITIAL = "KHỞI TẠO",
  FAUCET = "FAUCET" // New type for receiving from faucet
}

export interface SimulatedTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  toAddress?: string;
  fromAddress?: string;
  timestamp: Date;
  description: string;
  // Fields for Block Explorer Simulation
  gasPrice?: number; // Simulated gas price (e.g., in Gwei, but as a number here)
  gasUsed?: number;  // Simulated gas units used
  transactionFee?: number; // Simulated transaction fee (gasPrice * gasUsed)
  nonce?: number; // Simulated transaction nonce for the sender's address
  blockId?: string; // ID of the block this transaction is included in
}

export interface SimulatedBlock {
  id: string; // Could be a block number or hash
  previousHash: string;
  blockHash: string;
  timestamp: Date;
  transactions: SimulatedTransaction[]; // Array of transactions in this block
  nonce: number; // For PoW simulation, or just a random number
}

export enum WalletType {
  HOT = "Ví Nóng (Tài sản mã hoá)",
  COLD = "Ví Lạnh (Tài sản mã hoá)",
  HARDWARE = "Ví Phần Cứng (Tài sản mã hoá)",
  SOFTWARE = "Ví Phần Mềm (Tài sản mã hoá)",
  PAPER = "Ví Giấy (Tài sản mã hoá)",
  SIMULATED_HOT = "Ví Nóng Mô Phỏng", // This specific type for the simulation itself can retain "Hot" for clarity of its nature
  CUSTODIAL = "Ví Lưu Ký (Custodial)",
  NON_CUSTODIAL = "Ví Không Lưu Ký (Non-Custodial)"
}

export interface EducationalWalletType {
  type: WalletType;
  title: string;
  description: string;
  iconName: string; // To map to an icon component
  details?: string[]; // Optional more details for WalletTypesView
  pros?: string[];
  cons?: string[];
  howItWorksOffline?: string[]; // New field for offline transaction explanation
}

// Word list for generating fake seed phrases
export const DEMO_SEED_WORDS: string[] = [
  "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew",
  "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry",
  "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yuzu", "zucchini",
  "apricot", "blueberry", "coconut", "cranberry", "currant", "durian", "gooseberry", "guava",
  "lime", "lychee", "mandarin", "mulberry", "olive", "peach", "pear", "persimmon",
  "pineapple", "plum", "pomegranate", "pomelo", "starfruit", "tomato", "walnut", "yam"
];

export const DEFAULT_CURRENCY = {
  name: "DEMO Coin", // Name of the specific simulated asset
  symbol: "DMC"
};

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // Optional: duration in ms
}

export type ViewName = 'home' | 'keyGeneration' | 'walletTypes' | 'simulator' | 'glossary' | 'transactionsExplained' | 'exchangesExplained' | 'blockchainDemo' | 'tokenLifecycle' | 'projectTestAutomation';


export interface KeyPair {
  simulatedEntropy: string;
  privateKey: string;
  publicKey: string;
  address: string;
}

export interface NavItem {
  id: ViewName;
  label: string;
  icon: React.FC<{ className?: string }>; // Icon component type updated
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean; // For AI messages that are being fetched
  error?: string; // If AI response failed
}

// For styling blocks in the ledger
export type BlockIconType = 'genesis' | 'standard' | 'faucet';

// For Exchange Simulator (placeholders, expand as needed)
export enum ExchangeType {
  CEX = "Sàn Tập Trung (CEX)",
  DEX = "Sàn Phi Tập Trung (DEX)"
}

export interface ExchangeAsset {
  symbol: string; // e.g., DMC, BTC-Fake, USD-Fake
  name: string;
  balance: number; // For user's balance on the simulated exchange
  icon?: string; // Optional: path to an icon
}

export const STBLF_ASSET: ExchangeAsset = { // Stablecoin-Fake
    symbol: "STBL-F",
    name: "StableFake Coin",
    balance: 0, 
};

export const ETHF_ASSET: ExchangeAsset = { // Ether-Fake
    symbol: "ETH-F",
    name: "EtherFake",
    balance: 0,
};


export enum OrderType {
  MARKET = "Lệnh Thị Trường",
  LIMIT = "Lệnh Giới Hạn"
}

export interface ExchangeOrder {
  id: string;
  pair: string; // e.g., DMC/USD-Fake
  type: OrderType;
  side: 'buy' | 'sell';
  amount: number; // Amount of base asset
  price?: number; // For limit orders
  status: 'open' | 'filled' | 'cancelled';
  timestamp: Date;
}

// For Blockchain Demo View
export interface BlockchainDemoBlockState {
  idChain: number; // Unique ID within its specific chain instance (block number for that chain)
  nonce: string; 
  data: string;
  prevHash: string; // Hash of the previous block in its specific chain
  hash: string; // Calculated hash of this block
  isMined: boolean; // True if hash meets difficulty criteria for its data & nonce
  uniqueId: string; // A globally unique ID for React keys, especially in distributed view
}

export interface BlockchainDemoPeerState {
  id: string; // Peer A, Peer B, etc.
  name: string;
  chain: BlockchainDemoBlockState[];
}

export interface SourceAttribution {
  uri: string;
  title: string;
}

// For Blockchain News View (used by DailyBlockchainNewsSection on HomeView)
export interface BlockchainNewsItem {
  id: string; // Unique ID for React key
  tieuDe: string;
  tomTat: string;
  urlNguon?: string; // Original URL if provided directly by prompt
  thoiGian?: string; // Optional: publish time if available, e.g., "HH:mm DD/MM/YYYY" or "YYYY-MM-DD HH:mm"
  sourceAttributions?: SourceAttribution[]; // For Google Search grounding
}

// For Real-time Scam Alerts
export interface ScamAlertItem {
  id: string;
  tieuDeCanhBao: string;
  moTaChiTiet: string;
  dauHieuNhanBiet: string[];
  cachPhongTranh: string[];
  ngayCapNhat?: string;
  urlNguonCanhBao?: string;
  sourceAttributions?: SourceAttribution[]; // For Google Search grounding
}

// For Project Test Automation
export enum ProjectStage {
  NEW_LAUNCH = "new_launch",
  ACTIVE = "active",
  PRE_LAUNCH = "pre_launch"
}

export interface ProjectTestData {
  analysis: string;
  sourceAttributions?: SourceAttribution[];
}