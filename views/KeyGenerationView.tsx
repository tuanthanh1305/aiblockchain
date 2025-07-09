
import React, { useState, useCallback } from 'react';
import { KeyPair, AppNotification, NotificationType, DEMO_SEED_WORDS } from '../types';
import { generateFakeAddress, generateFakePrivateKey, generateRandomHexString } from '../utils/cryptoSim';
import { KeyIcon, DocumentDuplicateIcon, CheckCircleIcon, LightBulbIcon, SparklesIcon, ArrowDownIcon, BookOpenIcon } from '../components/Icons';
import SeedPhraseDemo from '../components/SeedPhraseDemo'; 

interface KeyGenerationViewProps {
  onCopy: (textToCopy: string, itemName: string) => void;
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

// Simplified Public Key and Address generation for demo
const generateFakePublicKeyFromPrivate = (privateKey: string): string => {
  // This is NOT cryptographically accurate. Just a visual simulation.
  // A real public key is derived via elliptic curve multiplication (e.g., secp256k1).
  // Here, we'll just hash the private key and take a slice to make it look different.
  // Using a simple hashing-like function for demo
  let hash = 0;
  for (let i = 0; i < privateKey.length; i++) {
    const char = privateKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `04${generateRandomHexString(62)}${Math.abs(hash).toString(16).slice(0, 30)}${privateKey.slice(2, 32)}`;
};

const generateFakeAddressFromPublic = (publicKey: string): string => {
  // This is also NOT cryptographically accurate for Ethereum (which uses Keccak-256 then takes last 20 bytes).
  // For demo: simple visual transformation.
  // We'll take parts of the public key and format it.
  return `0x${publicKey.slice(publicKey.length - 40)}`;
};


const InfoBlock: React.FC<{ title: string, children: React.ReactNode, icon?: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-slate-700/50 p-5 rounded-lg shadow-lg ring-1 ring-slate-600/50">
    <div className="flex items-center text-sky-400 mb-3">
      {icon || <LightBulbIcon className="w-6 h-6" />}
      <h3 className="text-xl font-semibold ml-2">{title}</h3>
    </div>
    <div className="text-slate-300 space-y-2 text-sm leading-relaxed">{children}</div>
  </div>
);

const GeneratedValueDisplay: React.FC<{ label: string; value: string; onCopy: (value: string, label: string) => void; explanation?: string; sensitive?: boolean }> = 
  ({ label, value, onCopy, explanation, sensitive = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy(value, label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-slate-800 rounded-md shadow-sm ring-1 ring-slate-700">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-300">{label}:</span>
      </div>
      <div className="flex items-center">
        <pre className={`text-sm flex-grow break-all ${sensitive ? 'text-red-400' : 'text-sky-300'}`}>{value}</pre>
        <button 
          onClick={handleCopyClick} 
          title={`Sao chép ${label}`} 
          aria-label={`Sao chép ${label}`}
          className="ml-2 p-1.5 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-colors"
        >
          {copied ? <CheckCircleIcon className="w-5 h-5 text-green-400"/> : <DocumentDuplicateIcon className="w-5 h-5"/>}
        </button>
      </div>
      {explanation && <p className="mt-2 text-xs text-slate-400">{explanation}</p>}
    </div>
  );
}

const KeyGenerationView: React.FC<KeyGenerationViewProps> = ({ onCopy, addNotification }) => {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);

  const generateNewKeyPair = useCallback(() => {
    const simulatedEntropy = generateRandomHexString(64); // Simulate large random number
    const privateKey = generateFakePrivateKey(); // Uses 0x + 64 hex
    const publicKey = generateFakePublicKeyFromPrivate(privateKey);
    const address = generateFakeAddressFromPublic(publicKey);
    
    setKeyPair({ simulatedEntropy, privateKey, publicKey, address });
    addNotification('Cặp khóa mô phỏng mới đã được tạo!', 'success', 2000);
  }, [addNotification]);

  const DiagramArrow: React.FC = () => (
    <div className="flex justify-center items-center my-2 md:my-0 md:mx-2">
      <ArrowDownIcon className="w-8 h-8 text-slate-500 transform md:rotate-[-90deg]" />
    </div>
  );
  
  const DiagramBox: React.FC<{title: string, content?: string, children?: React.ReactNode, className?: string}> = ({title, content, children, className=""}) => (
    <div className={`border-2 border-slate-600 p-3 rounded-lg text-center shadow-md bg-slate-700/30 ${className}`}>
        <h4 className="text-sm font-semibold text-sky-400 mb-1">{title}</h4>
        {content && <p className="text-xs text-slate-300 break-all">{content}</p>}
        {children}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-down">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-3">Nguyên Lý Sinh Khóa Trong Ví Tài Sản Mã Hoá</h1>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Tìm hiểu cách các thành phần cốt lõi của một ví tài sản mã hoá như Khóa Riêng Tư, Khóa Công Khai và Địa Chỉ Ví được tạo ra và liên kết với nhau.
        </p>
      </section>

      <InfoBlock title="Tổng Quan Về Quá Trình Sinh Khóa" icon={<KeyIcon className="w-6 h-6" />}>
        <p>Trong ví tài sản mã hoá, mọi thứ bắt đầu từ một nguồn ngẫu nhiên cực lớn. Từ đó, Khóa Riêng Tư được sinh ra. Khóa Riêng Tư là bí mật tuyệt đối của bạn. Từ Khóa Riêng Tư, Khóa Công Khai được tính toán thông qua các thuật toán mật mã một chiều (như Elliptic Curve Cryptography - ECC). Cuối cùng, Địa Chỉ Ví (dùng để nhận tài sản mã hoá) được tạo ra từ Khóa Công Khai, thường qua một bước băm (hashing) và định dạng.</p>
        <p className="font-semibold text-sky-300">Quy trình cơ bản: Nguồn Ngẫu Nhiên → Khóa Riêng Tư → Khóa Công Khai → Địa Chỉ Ví.</p>
        <p>Điều quan trọng: Rất dễ để đi từ Khóa Riêng Tư → Khóa Công Khai → Địa Chỉ, nhưng gần như <strong className="text-red-400">không thể</strong> đi ngược lại (ví dụ: từ Địa Chỉ suy ra Khóa Riêng Tư).</p>
      </InfoBlock>

      <section>
        <h2 className="text-2xl font-semibold text-sky-400 mb-4 text-center">Sơ Đồ Sinh Khóa (Mô Phỏng Đơn Giản Hóa)</h2>
        <div className="p-4 md:p-6 bg-slate-900/50 rounded-xl shadow-xl ring-1 ring-slate-700">
            <div className="flex flex-col md:flex-row md:items-center justify-around space-y-4 md:space-y-0 md:space-x-4">
                <DiagramBox title="1. Nguồn Ngẫu Nhiên" className="flex-1">
                    <p className="text-xs text-slate-400">Một số rất lớn, thực sự ngẫu nhiên (entropy).</p>
                    {keyPair && <p className="text-green-400 text-xs mt-1 truncate">({keyPair.simulatedEntropy.substring(0,10)}...)</p>}
                </DiagramBox>
                <DiagramArrow />
                <DiagramBox title="2. Khóa Riêng Tư" className="flex-1">
                    <p className="text-xs text-slate-400">Bí mật tối thượng, dùng để ký giao dịch. (Mô phỏng: 64 ký tự hex)</p>
                     {keyPair && <p className="text-red-400 text-xs mt-1 truncate">{keyPair.privateKey.substring(0,12)}...</p>}
                </DiagramBox>
                <DiagramArrow />
                <DiagramBox title="3. Khóa Công Khai" className="flex-1">
                    <p className="text-xs text-slate-400">Dùng để xác minh chữ ký, tạo địa chỉ. (Mô phỏng: Dài hơn, khác khóa riêng)</p>
                     {keyPair && <p className="text-yellow-400 text-xs mt-1 truncate">{keyPair.publicKey.substring(0,12)}...</p>}
                </DiagramBox>
                <DiagramArrow />
                <DiagramBox title="4. Địa Chỉ Ví" className="flex-1">
                    <p className="text-xs text-slate-400">Dùng để nhận tài sản mã hoá. (Mô phỏng: Định dạng 0x..., ngắn hơn)</p>
                     {keyPair && <p className="text-sky-300 text-xs mt-1 truncate">{keyPair.address}</p>}
                </DiagramBox>
            </div>
             <p className="text-center text-xs text-slate-500 mt-4">
                Mũi tên (<ArrowDownIcon className="w-3 h-3 inline transform md:rotate-[-90deg]" />) chỉ hướng suy ra. Quá trình này là một chiều.
            </p>
        </div>
      </section>
      
      <section className="bg-slate-700/80 p-6 rounded-lg shadow-xl ring-1 ring-slate-600/50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-sky-400 mb-2 sm:mb-0">Bộ Sinh Khóa Mô Phỏng</h2>
            <button
            onClick={generateNewKeyPair}
            className="flex items-center bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-sky-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50"
            >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Tạo Cặp Khóa Mô Phỏng Mới
            </button>
        </div>

        {keyPair ? (
          <div className="space-y-4">
            <GeneratedValueDisplay 
              label="1. Nguồn Ngẫu Nhiên Cực Lớn (Mô Phỏng Entropy)" 
              value={keyPair.simulatedEntropy} 
              onCopy={onCopy}
              explanation="Trong thực tế, đây là một số rất lớn, được tạo ra từ các nguồn ngẫu nhiên chất lượng cao (ví dụ: chuyển động chuột, nhiễu hệ thống). Đây là hạt giống cho khóa riêng tư."
            />
            <GeneratedValueDisplay 
              label="2. Khóa Riêng Tư (Mô Phỏng)" 
              value={keyPair.privateKey} 
              onCopy={onCopy}
              explanation="Đây là 'chìa khóa' thực sự của bạn, tuyệt đối bí mật. Nó thường là một số 256-bit, hiển thị dưới dạng 64 ký tự thập lục phân (hex). (LƯU Ý: KHÓA NÀY LÀ GIẢ)"
              sensitive={true}
            />
            <GeneratedValueDisplay 
              label="3. Khóa Công Khai (Mô Phỏng - Nén)" 
              value={keyPair.publicKey} 
              onCopy={onCopy}
              explanation="Được suy ra từ Khóa Riêng Tư bằng thuật toán Elliptic Curve Cryptography (ECC), ví dụ đường cong secp256k1. Không thể suy ngược lại Khóa Riêng Tư từ đây. (LƯU Ý: KHÓA NÀY LÀ GIẢ)"
            />
            <GeneratedValueDisplay 
              label="4. Địa Chỉ Ví (Mô Phỏng)" 
              value={keyPair.address} 
              onCopy={onCopy}
              explanation="Được suy ra từ Khóa Công Khai, thường qua một hàm băm (ví dụ: Keccak-256 cho Ethereum) và lấy một phần nhất định (ví dụ: 20 byte cuối). Đây là địa chỉ bạn chia sẻ để nhận tài sản mã hoá. (LƯU Ý: ĐỊA CHỈ NÀY LÀ GIẢ)"
            />
          </div>
        ) : (
          <p className="text-slate-400 text-center py-4">Nhấn nút "Tạo Cặp Khóa Mô Phỏng Mới" để xem ví dụ.</p>
        )}
         <div className="mt-6 text-xs text-yellow-300/80 bg-yellow-800/30 p-3 rounded-md ring-1 ring-yellow-600/50">
            <strong className="font-semibold">LƯU Ý QUAN TRỌNG:</strong> Tất cả các giá trị được tạo ở đây (khóa riêng tư, khóa công khai, địa chỉ) đều là <strong className="uppercase">GIẢ MẠO</strong> và được đơn giản hóa cho mục đích minh họa. Chúng <strong className="uppercase">KHÔNG</strong> an toàn và <strong className="uppercase">KHÔNG</strong> nên được sử dụng cho bất kỳ mục đích thực tế nào. Quá trình sinh khóa thực tế phức tạp hơn và sử dụng các thuật toán mật mã mạnh.
        </div>
      </section>

      <InfoBlock title="Cụm Từ Khôi Phục (Seed Phrase / Mnemonic Phrase)" icon={<BookOpenIcon className="w-6 h-6" />}>
        <p>Để dễ dàng sao lưu và khôi phục ví, người ta thường sử dụng Cụm Từ Khôi Phục (tiêu chuẩn phổ biến là BIP-39). Đây là một chuỗi từ 12 đến 24 từ dễ nhớ (ví dụ: "apple banana cherry ...") được lấy từ một danh sách từ cố định.</p>
        <p>Cụm từ này có thể được dùng để tạo ra một "khóa gốc" (master seed), từ đó tất cả các khóa riêng tư và địa chỉ trong ví tài sản mã hoá của bạn có thể được tái tạo một cách có hệ thống (ví dụ, trong các ví HD - Hierarchical Deterministic). Điều này có nghĩa là bạn chỉ cần sao lưu cụm từ này một cách an toàn là đủ để khôi phục toàn bộ ví.</p>
        <p className="font-semibold text-yellow-300">Cụm Từ Khôi Phục quan trọng tương đương Khóa Riêng Tư và cần được bảo vệ cẩn thận!</p>
        
        {/* Seed Phrase Demo Integration */}
        <div className="mt-6 pt-4 border-t border-slate-600/50">
          <h4 className="text-lg font-semibold text-sky-300 mb-3 text-center">Mô Phỏng Sinh Khóa Từ Cụm Từ Khôi Phục</h4>
          <p className="text-xs text-slate-400 mb-4 text-center">
            Hãy thử chọn một vài từ từ danh sách gợi ý để xem cách chúng (mô phỏng) có thể được dùng để tạo ra một "khóa gốc" và từ đó là "khóa riêng tư con". 
            Quy trình thực tế phức tạp hơn nhiều và sử dụng các thuật toán chuẩn hóa như PBKDF2.
          </p>
          <SeedPhraseDemo 
            seedWords={DEMO_SEED_WORDS} 
            onCopy={onCopy} 
            addNotification={addNotification}
          />
        </div>
      </InfoBlock>
    </div>
  );
};

export default KeyGenerationView;
