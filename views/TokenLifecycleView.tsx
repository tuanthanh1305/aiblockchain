
import React, { useState } from 'react';
import { NotificationType, STBLF_ASSET, ETHF_ASSET, DEFAULT_CURRENCY } from '../types';
import { 
    RocketLaunchIcon, 
    AcademicCapIcon, 
    SparklesIcon, 
    ArrowsRightLeftIcon, 
    UserGroupIcon, 
    ShieldExclamationIcon,
    InformationCircleIcon,
    BuildingStorefrontIcon,
    ExclamationTriangleIcon,
    ExternalLinkIcon, // Added for social links
    IconProps
} from '../components/Icons';

interface TokenLifecycleViewProps {
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

type TokenLifecycleTabId = 'intro' | 'creation' | 'initialLiquidity' | 'listingAndTrading' | 'ecosystem' | 'risksAndConsiderations';

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactElement<IconProps>;
}> = ({ label, isActive, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:scale-105
            ${isActive
                ? 'bg-sky-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
    >
        {React.cloneElement(icon, {className: "w-4 h-4 mr-1.5 hidden sm:inline"})}
        {label}
    </button>
);

const InfoPanel: React.FC<{title: string, children: React.ReactNode, icon?: React.ReactNode, className?: string}> = 
({title, children, icon, className=""}) => (
    <div className={`bg-slate-700/50 p-5 rounded-lg shadow-lg ring-1 ring-slate-600/50 ${className}`}>
        {icon && (
            <div className="flex items-center text-sky-400 mb-3">
                {React.cloneElement(icon as React.ReactElement<IconProps>, {className: "w-6 h-6"})}
                <h3 className="text-xl font-semibold ml-2">{title}</h3>
            </div>
        )}
        {!icon && <h3 className="text-xl font-semibold text-sky-400 mb-3">{title}</h3>}
        <div className="text-slate-300 space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
);


const TokenLifecycleView: React.FC<TokenLifecycleViewProps> = ({ addNotification }) => {
  const [activeTab, setActiveTab] = useState<TokenLifecycleTabId>('intro');

  const [tokenName, setTokenName] = useState('My Awesome Token');
  const [tokenSymbol, setTokenSymbol] = useState('MAT');
  const [totalSupply, setTotalSupply] = useState('1000000000');

  const [tokenAmountLP, setTokenAmountLP] = useState('500000000'); 
  const [pairedAssetLP, setPairedAssetLP] = useState(ETHF_ASSET.symbol);
  const [pairedAssetAmountLP, setPairedAssetAmountLP] = useState('1');


  const tabs: { id: TokenLifecycleTabId; label: string; icon: React.ReactElement<IconProps> }[] = [
    { id: 'intro', label: 'Giới Thiệu Token/Coin', icon: <AcademicCapIcon /> },
    { id: 'creation', label: 'Khởi Tạo Token (Khái niệm)', icon: <SparklesIcon /> },
    { id: 'initialLiquidity', label: 'Thanh Khoản Ban Đầu & Định Giá', icon: <ArrowsRightLeftIcon /> },
    { id: 'listingAndTrading', label: 'Niêm Yết & Giao Dịch', icon: <BuildingStorefrontIcon /> },
    { id: 'ecosystem', label: 'Cộng Đồng & Hệ Sinh Thái', icon: <UserGroupIcon /> },
    { id: 'risksAndConsiderations', label: 'Rủi Ro & Cân Nhắc', icon: <ShieldExclamationIcon /> },
  ];

  const handleMockCreateToken = () => {
    if(!tokenName.trim() || !tokenSymbol.trim() || !parseFloat(totalSupply) || parseFloat(totalSupply) <=0) {
        addNotification("Vui lòng nhập đầy đủ thông tin hợp lệ cho token mô phỏng.", "error");
        return;
    }
    addNotification(`Mô phỏng: Token "${tokenName}" (${tokenSymbol}) với tổng cung ${parseFloat(totalSupply).toLocaleString()} đã được "khởi tạo"!`, "success", 4000);
  }
  
  const calculateInitialPrice = () => {
    const mcAmount = parseFloat(tokenAmountLP);
    const pairedAmount = parseFloat(pairedAssetAmountLP);
    if (mcAmount > 0 && pairedAmount > 0 && tokenSymbol.trim() !== '') {
        const pricePerToken = pairedAmount / mcAmount;
        return `1 ${tokenSymbol || 'TOKEN'} ≈ ${pricePerToken.toExponential(4)} ${pairedAssetLP}`;
    }
    return "N/A (Vui lòng nhập Ký Hiệu Token ở mục Khởi Tạo)";
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <InfoPanel title="Giới Thiệu Chung Về Token và Coin" icon={<AcademicCapIcon />}>
            <p>Trong thế giới blockchain, thuật ngữ "coin" và "token" thường được sử dụng, đôi khi thay thế cho nhau, nhưng có sự khác biệt cơ bản:</p>
            <p><strong>Coin (Native Coin/Cryptocurrency):</strong></p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li>Là tài sản mã hoá gốc của một blockchain cụ thể. Ví dụ: Bitcoin (BTC) trên blockchain Bitcoin, Ether (ETH) trên blockchain Ethereum, SOL trên Solana.</li>
              <li>Thường được sử dụng để trả phí giao dịch (gas fees) trên mạng lưới của nó và có thể có các vai trò khác như staking để bảo mật mạng.</li>
              <li>Hoạt động trên blockchain riêng của nó.</li>
            </ul>
            <p><strong>Token:</strong></p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li>Được xây dựng <strong className="text-yellow-300">trên một blockchain đã có sẵn</strong>, sử dụng các tiêu chuẩn token của blockchain đó. Ví dụ: token ERC-20 trên Ethereum, token BEP-20 trên BNB Smart Chain, token SPL trên Solana.</li>
              <li>Có thể đại diện cho nhiều thứ: tiện ích (utility token - quyền truy cập dịch vụ), quản trị (governance token - quyền biểu quyết), tài sản (asset-backed token), hoặc đơn giản là một loại tiền tệ trong một ứng dụng cụ thể.</li>
              <li>Không có blockchain riêng mà dựa vào cơ sở hạ tầng của blockchain mẹ.</li>
            </ul>
            <p>Mục này sẽ tập trung vào quy trình chung cho cả việc phát hành một "coin" mới (nếu bạn tạo blockchain riêng) hoặc phổ biến hơn là "token" trên một nền tảng có sẵn.</p>
            
            <div className="mt-6 pt-4 border-t border-slate-600 text-xs text-slate-400">
              <p className="font-semibold mb-1">Thông tin hỗ trợ:</p>
              <p>
                <a href="https://abaii.vn/about-us/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                    © 2025 Bộ phận Đào tạo - Viện Công nghệ Blockchain và Trí tuệ nhân tạo (ABAII)
                </a>
              </p>
              <p className="mt-1">
                Hỗ trợ, phản ảnh kỹ thuật:{" "}
                <a href="https://trantuanthanh.net" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                  GV Trần Tuấn Thành
                </a>
              </p>
              <p className="mt-1">Kết nối:</p>
              <ul className="list-disc list-inside ml-4">
                <li><a href="https://www.youtube.com/@ABAII-2024" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center">Kênh YouTube <ExternalLinkIcon className="w-3 h-3 ml-1" /></a></li>
                <li><a href="https://www.tiktok.com/@taisanso.abaii" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center">Kênh TikTok <ExternalLinkIcon className="w-3 h-3 ml-1" /></a></li>
                <li><a href="https://www.facebook.com/ABAIIacademy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center">Fanpage Facebook <ExternalLinkIcon className="w-3 h-3 ml-1" /></a></li>
              </ul>
            </div>
          </InfoPanel>
        );
      case 'creation':
        return (
          <InfoPanel title="Khởi Tạo Token (Khái Niệm)" icon={<SparklesIcon />}>
            <p>Việc "tạo" một token mới thường liên quan đến việc triển khai một <strong className="text-yellow-300">hợp đồng thông minh (smart contract)</strong> trên một nền tảng blockchain hỗ trợ. Hợp đồng này là một chương trình máy tính tự thực thi, định nghĩa các quy tắc và thuộc tính của token.</p>
            <p>Các thông tin cơ bản cần xác định khi tạo token:</p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li><strong>Tên Token (Token Name):</strong> Tên đầy đủ của token (ví dụ: "My Awesome Token").</li>
              <li><strong>Ký Hiệu Token (Token Symbol):</strong> Mã viết tắt của token (ví dụ: "MAT", thường 3-5 ký tự).</li>
              <li><strong>Tổng Cung (Total Supply):</strong> Tổng số lượng token sẽ được tạo ra và tồn tại.</li>
              <li><strong>Số Thập Phân (Decimals):</strong> Số chữ số thập phân mà token có thể được chia nhỏ (ví dụ: 18 là phổ biến cho token trên Ethereum, tương tự ETH).</li>
              <li><strong>Tiêu Chuẩn Token (Token Standard):</strong> Tuân theo một tiêu chuẩn chung như ERC-20 (Ethereum), BEP-20 (BNB Smart Chain), SPL (Solana) để đảm bảo tính tương thích với ví và sàn giao dịch.</li>
            </ul>
            <p>Nhiều công cụ và nền tảng "no-code" hoặc "low-code" hiện nay cho phép người dùng tạo token một cách dễ dàng mà không cần kiến thức lập trình chuyên sâu, bằng cách điền vào các mẫu có sẵn.</p>
            
            <div className="mt-4 p-4 bg-slate-800/60 rounded-lg ring-1 ring-slate-700 space-y-3">
                <h4 className="text-md font-semibold text-sky-300 text-center">Mô Phỏng Thông Số Token</h4>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Tên Token:</label>
                    <input type="text" value={tokenName} onChange={e => setTokenName(e.target.value)} placeholder="Ví dụ: My Awesome Token" className="w-full p-2 text-sm bg-slate-700 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Ký Hiệu Token (3-5 ký tự):</label>
                    <input type="text" value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value.toUpperCase())} placeholder="Ví dụ: MAT" maxLength={5} className="w-full p-2 text-sm bg-slate-700 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500" />
                </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Tổng Cung Token:</label>
                    <input type="number" value={totalSupply} onChange={e => setTotalSupply(e.target.value)} placeholder="Ví dụ: 1000000000" className="w-full p-2 text-sm bg-slate-700 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500" />
                </div>
                <button 
                    onClick={handleMockCreateToken}
                    className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded shadow-md transition-colors"
                >
                    Mô Phỏng "Triển Khai Token"
                </button>
            </div>
            <div className="mt-4 p-3 bg-yellow-700/30 text-yellow-200 text-xs rounded-md ring-1 ring-yellow-600/50">
                <ExclamationTriangleIcon className="w-5 h-5 inline mr-1.5 align-middle" />
                <strong>Lưu ý:</strong> Đây chỉ là mô phỏng khái niệm. Không có token thật nào được tạo ra trên blockchain. Việc tạo và triển khai token thật sự phức tạp hơn và có chi phí (phí gas).
            </div>
          </InfoPanel>
        );
      case 'initialLiquidity':
        return (
          <InfoPanel title="Thanh Khoản Ban Đầu & Định Giá" icon={<ArrowsRightLeftIcon />}>
            <p>Sau khi token được "tạo" (triển khai hợp đồng thông minh), nó thường chưa có giá trị thị trường và không thể giao dịch được ngay. Để token có thể được mua bán trên các <strong className="text-yellow-300">Sàn Giao Dịch Phi Tập Trung (DEX)</strong>, người tạo hoặc cộng đồng cần cung cấp <strong className="text-yellow-300">thanh khoản ban đầu</strong>.</p>
            <p>Điều này thường được thực hiện bằng cách tạo một <strong className="text-yellow-300">Pool Thanh Khoản (Liquidity Pool)</strong> trên một DEX sử dụng cơ chế <strong className="text-yellow-300">AMM (Automated Market Maker)</strong>. Người cung cấp thanh khoản (Liquidity Provider - LP) sẽ nạp một lượng token mới tạo của họ và một lượng tài sản khác (thường là một stablecoin như USDT/USDC hoặc một tài sản cơ sở của blockchain như ETH, BNB, SOL) vào pool theo một tỷ lệ nhất định. Tỷ lệ này sẽ xác định <strong className="text-yellow-300">giá khởi điểm</strong> của token.</p>
            <p>Ví dụ: Nếu cung cấp 500 triệu Token_X và 1 ETH vào pool, giá ban đầu sẽ là 1 ETH = 500 triệu Token_X.</p>
             <div className="mt-4 p-4 bg-slate-800/60 rounded-lg ring-1 ring-slate-700 space-y-3">
                <h4 className="text-md font-semibold text-sky-300 text-center">Mô Phỏng Cung Cấp Thanh Khoản Ban Đầu</h4>
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Lượng Token ({tokenSymbol || 'TOKEN'}) cung cấp:</label>
                    <input type="number" value={tokenAmountLP} onChange={e => setTokenAmountLP(e.target.value)} className="w-full p-2 text-sm bg-slate-700 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Tài sản đối ứng (ví dụ: ETH-F, STBL-F):</label>
                    <select value={pairedAssetLP} onChange={e => setPairedAssetLP(e.target.value)} className="w-full p-2 text-sm bg-slate-700 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500">
                        <option value={ETHF_ASSET.symbol}>{ETHF_ASSET.name} ({ETHF_ASSET.symbol})</option>
                        <option value={STBLF_ASSET.symbol}>{STBLF_ASSET.name} ({STBLF_ASSET.symbol})</option>
                        <option value={DEFAULT_CURRENCY.symbol}>{DEFAULT_CURRENCY.name} ({DEFAULT_CURRENCY.symbol})</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Lượng tài sản đối ứng cung cấp:</label>
                    <input type="number" value={pairedAssetAmountLP} onChange={e => setPairedAssetAmountLP(e.target.value)} className="w-full p-2 text-sm bg-slate-700 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500" />
                </div>
                <div className="p-2 bg-slate-900 rounded text-center">
                    <p className="text-xs text-slate-400">Giá khởi điểm ước tính (mô phỏng):</p>
                    <p className="text-sm font-semibold text-green-400">{calculateInitialPrice()}</p>
                </div>
                <button 
                    onClick={() => addNotification(`Mô phỏng: Đã cung cấp thanh khoản cho cặp ${tokenSymbol || 'TOKEN'}/${pairedAssetLP}!`, "success")}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded shadow-md transition-colors"
                    disabled={!tokenSymbol.trim()}
                >
                    Mô Phỏng "Thêm Thanh Khoản"
                </button>
            </div>
            <p className="mt-2">Khi người dùng mua token từ pool, lượng token trong pool giảm và lượng tài sản đối ứng tăng, làm giá token tăng theo thuật toán của AMM. Ngược lại khi bán. Đây là cơ chế cốt lõi giúp xác định giá và tạo thị trường cho token mới trên DEX.</p>
            <p>Tham khảo <button onClick={() => { addNotification("Truy cập 'Tìm Hiểu Sàn G.D' từ menu chính, sau đó chọn phần 'Swap Demo'.", "info"); }} className="text-sky-400 hover:underline">Swap Demo</button> trong mục "Tìm Hiểu Sàn G.D" để hiểu rõ hơn về AMM và pool thanh khoản.</p>
          </InfoPanel>
        );
      case 'listingAndTrading':
        return (
          <InfoPanel title="Niêm Yết & Giao Dịch Token" icon={<BuildingStorefrontIcon />}>
            <p><strong>Trên Sàn Phi Tập Trung (DEX):</strong> Việc "niêm yết" một token mới thường đơn giản là tạo một pool thanh khoản cho nó như đã mô tả ở mục trước. Sau khi pool được tạo và có thanh khoản, bất kỳ ai cũng có thể giao dịch (swap) token đó bằng cách tương tác với pool thông qua giao diện của DEX (ví dụ: Uniswap, PancakeSwap).</p>
            <p><strong>Trên Sàn Tập Trung (CEX):</strong> Việc niêm yết token trên các sàn CEX lớn (như Binance, Coinbase) là một quá trình phức tạp hơn nhiều. Dự án token thường phải:</p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
                <li>Nộp đơn đăng ký niêm yết.</li>
                <li>Đáp ứng các tiêu chí của sàn: khối lượng giao dịch dự kiến, số lượng người nắm giữ, tính hợp pháp của dự án, uy tín và hoạt động của cộng đồng, kiểm toán hợp đồng thông minh, v.v.</li>
                <li>Có thể phải trả phí niêm yết (listing fee), đôi khi rất cao.</li>
                <li>Quyết định niêm yết cuối cùng thuộc về sàn CEX.</li>
            </ul>
            <p>Khi token đã có thanh khoản và được niêm yết (ít nhất trên DEX), người dùng có thể mua bán token. Giá sẽ biến động dựa trên cung cầu thị trường, tin tức liên quan đến dự án, hoạt động của cộng đồng, và các yếu tố thị trường chung.</p>
             <div className="mt-4 p-3 bg-sky-800/30 text-sky-200 text-xs rounded-md ring-1 ring-sky-700/50">
                <InformationCircleIcon className="w-5 h-5 inline mr-1.5 align-middle" />
                Truy cập mục "<strong className="font-semibold">Tìm Hiểu Sàn G.D</strong>" từ menu chính để tương tác với mô phỏng Sổ Lệnh (Order Book) và Swap, giúp hình dung rõ hơn về cơ chế giao dịch trên CEX và DEX.
            </div>
          </InfoPanel>
        );
      case 'ecosystem':
        return (
          <InfoPanel title="Cộng Đồng & Hệ Sinh Thái" icon={<UserGroupIcon />}>
            <p>Đối với sự thành công và phát triển bền vững của một dự án token/coin, việc xây dựng một <strong className="text-yellow-300">cộng đồng mạnh mẽ</strong> và một <strong className="text-yellow-300">hệ sinh thái (ecosystem)</strong> có giá trị là vô cùng quan trọng, đặc biệt đối với các token có mục tiêu tiện ích hoặc quản trị thực sự.</p>
            <p><strong>Các yếu tố xây dựng cộng đồng và hệ sinh thái:</strong></p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li><strong>Truyền thông rõ ràng và minh bạch:</strong> Cập nhật thường xuyên về tiến độ dự án, lộ trình (roadmap), và các quyết định quan trọng.</li>
              <li><strong>Tương tác tích cực:</strong> Xây dựng các kênh giao tiếp hiệu quả (Telegram, Discord, Twitter/X, diễn đàn) để lắng nghe và tương tác với cộng đồng.</li>
              <li><strong>Phát triển tiện ích (Utility):</strong> Token cần có mục đích sử dụng cụ thể trong một sản phẩm, dịch vụ hoặc nền tảng. Tiện ích càng rõ ràng và cần thiết, giá trị của token càng được củng cố.</li>
              <li><strong>Quản trị phi tập trung (Decentralized Governance):</strong> Cho phép cộng đồng (những người nắm giữ token) tham gia vào quá trình ra quyết định liên quan đến sự phát triển của dự án thông qua bỏ phiếu.</li>
              <li><strong>Đối tác chiến lược (Partnerships):</strong> Hợp tác với các dự án, tổ chức khác để mở rộng phạm vi ứng dụng và tiếp cận người dùng.</li>
              <li><strong>Chương trình khuyến khích (Incentive Programs):</strong> Airdrops, staking rewards, liquidity mining programs để thu hút người dùng và nhà cung cấp thanh khoản.</li>
              <li><strong>Marketing và Phát triển Kinh doanh:</strong> Không chỉ là "hype" nhất thời, mà là các chiến lược dài hạn để quảng bá dự án và thu hút người dùng/nhà đầu tư thực sự.</li>
            </ul>
            <p>Một hệ sinh thái mạnh mẽ giúp tăng nhu cầu sử dụng token, tạo ra giá trị bền vững và giảm sự phụ thuộc vào các yếu tố đầu cơ ngắn hạn. Ngay cả với các dự án ban đầu mang tính "meme", việc phát triển tiện ích và cộng đồng thực chất là chìa khóa để tồn tại lâu dài.</p>
          </InfoPanel>
        );
      case 'risksAndConsiderations':
        return (
          <InfoPanel title="Rủi Ro & Cân Nhắc Khi Tham Gia Dự Án Token" icon={<ShieldExclamationIcon />} className="bg-red-800/30 ring-red-600/70">
            <p className="text-red-300 font-semibold text-lg">CẢNH BÁO: Đầu tư vào bất kỳ token/coin nào, đặc biệt là các dự án mới và ít tên tuổi, đều tiềm ẩn rủi ro cao. Bạn có thể mất một phần hoặc toàn bộ số tiền đầu tư.</p>
            <p className="text-red-200"><strong>Các rủi ro và điểm cần cân nhắc chính:</strong></p>
            <ul className="list-disc list-inside ml-4 text-red-300 text-sm space-y-2">
              <li>
                <strong className="text-red-100">Biến động giá (Volatility):</strong> Giá trị của token/coin có thể thay đổi rất nhanh chóng và mạnh mẽ do nhiều yếu tố thị trường.
              </li>
              <li>
                <strong className="text-red-100">Rủi ro dự án thất bại:</strong> Nhiều dự án token không đạt được mục tiêu đề ra, không phát triển được sản phẩm hoặc không thu hút được người dùng, dẫn đến token mất giá trị.
              </li>
              <li>
                <strong className="text-red-100">Lừa đảo (Scams):</strong>
                <ul className="list-circle list-inside ml-4 text-xs text-red-400 space-y-0.5 mt-0.5">
                    <li><strong>Rug Pull (Kéo Thảm):</strong> Nhà phát triển ẩn danh rút toàn bộ thanh khoản khỏi pool và biến mất. Rất phổ biến với các token mới trên DEX.</li>
                    <li><strong>Pump and Dump (Bơm và Xả):</strong> Một nhóm người thổi phồng giá token sau đó bán tháo.</li>
                    <li>Các hình thức lừa đảo phishing, giả mạo dự án khác.</li>
                </ul>
              </li>
              <li>
                <strong className="text-red-100">Thiếu tiện ích thực tế:</strong> Nhiều token được tạo ra mà không có mục đích sử dụng rõ ràng, giá trị chủ yếu dựa trên đầu cơ.
              </li>
              <li>
                <strong className="text-red-100">Rủi ro hợp đồng thông minh (Smart Contract Vulnerabilities):</strong> Lỗi trong mã nguồn của hợp đồng thông minh có thể bị khai thác, dẫn đến mất mát token. Luôn ưu tiên các dự án đã được kiểm toán (audit) bởi các công ty uy tín.
              </li>
              <li>
                <strong className="text-red-100">Thanh khoản thấp (Low Liquidity):</strong> Khó khăn trong việc mua/bán số lượng lớn token mà không làm ảnh hưởng đáng kể đến giá.
              </li>
               <li>
                <strong className="text-red-100">Rủi ro pháp lý và quy định (Regulatory Risks):</strong> Môi trường pháp lý cho tài sản mã hoá vẫn đang phát triển và có thể thay đổi, ảnh hưởng đến hoạt động của dự án.
              </li>
               <li>
                <strong className="text-red-100">Thông tin không minh bạch hoặc sai lệch:</strong> Cẩn trọng với các dự án có đội ngũ ẩn danh, lộ trình không rõ ràng, hoặc hứa hẹn lợi nhuận phi thực tế.
              </li>
            </ul>
            <p className="mt-4 text-red-100 font-bold">Lời khuyên QUAN TRỌNG:</p>
            <ul className="list-decimal list-inside ml-4 text-red-200 text-sm space-y-1">
                <li><strong className="uppercase">Luôn tự nghiên cứu kỹ lưỡng (DYOR - Do Your Own Research)</strong> trước khi đầu tư vào bất kỳ dự án token nào.</li>
                <li>Chỉ đầu tư số tiền bạn sẵn sàng mất. Đừng bao giờ đầu tư nhiều hơn số tiền đó.</li>
                <li>Tìm hiểu về đội ngũ phát triển, công nghệ, tiện ích thực tế, cộng đồng và các yếu tố kinh tế của token (tokenomics).</li>
                <li>Đa dạng hóa danh mục đầu tư, không nên "bỏ tất cả trứng vào một giỏ".</li>
                <li>Cẩn thận với FOMO (Fear Of Missing Out) và những lời khuyên đầu tư từ các nguồn không đáng tin cậy.</li>
                <li>Nền tảng này chỉ cung cấp thông tin giáo dục, <strong className="uppercase">không phải lời khuyên đầu tư</strong>.</li>
            </ul>
          </InfoPanel>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in-down space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-sky-400 text-center flex items-center justify-center">
        <RocketLaunchIcon className="w-8 h-8 md:w-10 md:h-10 mr-3" />
        Vòng Đời Của Một Token/Coin (Giáo Dục & Cân Nhắc)
      </h1>
      <p className="text-slate-300 max-w-3xl mx-auto text-center text-sm">
        Tìm hiểu các giai đoạn (khái niệm) trong vòng đời của một token/coin, từ ý tưởng ban đầu, khởi tạo, cung cấp thanh khoản, đến các yếu tố hệ sinh thái và những rủi ro quan trọng cần cân nhắc.
      </p>

      <div className="flex flex-wrap justify-center gap-1 border-b border-slate-700 pb-2 mb-4 sticky top-[70px] md:top-[80px] z-20 bg-slate-800/90 backdrop-blur-md py-2 rounded-b-md">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
          />
        ))}
      </div>
      <div className="p-1 md:p-2 min-h-[400px] bg-slate-800/50 rounded-lg shadow-inner ring-1 ring-slate-700/50">
        {renderContent()}
      </div>
    </div>
  );
};

export default TokenLifecycleView;
