
import React, { useState } from 'react';
import { 
    BuildingStorefrontIcon, ArrowsRightLeftIcon, UserGroupIcon, ChartBarIcon, 
    AdjustmentsHorizontalIcon, ShieldExclamationIcon, LightBulbIcon, CheckBadgeIcon, MinusCircleIcon, AcademicCapIcon,
    SwitchHorizontalIcon, InformationCircleIcon
} from '../components/Icons';
import OrderBookDemo from '../components/OrderBookDemo'; // Completed import path
import SwapDemo from '../components/SwapDemo';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactElement;
  content: React.ReactNode;
}

const InfoPanel: React.FC<{title: string, children: React.ReactNode, icon?: React.ReactNode, className?: string}> = 
({title, children, icon, className=""}) => (
    <div className={`bg-slate-700/50 p-5 rounded-lg shadow-lg ring-1 ring-slate-600/50 ${className}`}>
        {icon && (
            <div className="flex items-center text-sky-400 mb-3">
                {React.cloneElement(icon as React.ReactElement<any>, {className: "w-6 h-6"})}
                <h3 className="text-xl font-semibold ml-2">{title}</h3>
            </div>
        )}
        {!icon && <h3 className="text-xl font-semibold text-sky-400 mb-3">{title}</h3>}
        <div className="text-slate-300 space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
);


const ExchangesExplainedView: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('intro');

  const tabs: Tab[] = [
    {
      id: 'intro',
      label: 'Giới Thiệu Sàn',
      icon: <BuildingStorefrontIcon className="w-4 h-4 mr-1.5" />,
      content: (
        <InfoPanel title="Sàn Giao Dịch Tài Sản Mã Hoá Là Gì?" icon={<AcademicCapIcon/>}>
            <p>Sàn giao dịch tài sản mã hoá là các nền tảng trực tuyến cho phép người dùng mua, bán và trao đổi các loại tài sản mã hoá khác nhau. Chúng đóng vai trò trung tâm trong hệ sinh thái tài sản mã hoá, cung cấp thanh khoản và cơ chế khám phá giá.</p>
            <p>Có hai loại sàn giao dịch chính:</p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li><strong>Sàn Giao Dịch Tập Trung (CEX - Centralized Exchange):</strong> Được điều hành bởi một công ty hoặc tổ chức. Người dùng thường gửi tài sản mã hoá của họ vào ví của sàn để giao dịch. Ví dụ: Binance, Coinbase, Kraken.</li>
              <li><strong>Sàn Giao Dịch Phi Tập Trung (DEX - Decentralized Exchange):</strong> Hoạt động dựa trên các hợp đồng thông minh trên blockchain, cho phép người dùng giao dịch trực tiếp từ ví cá nhân của họ (non-custodial). Ví dụ: Uniswap, PancakeSwap, SushiSwap.</li>
            </ul>
        </InfoPanel>
      )
    },
    {
      id: 'cex',
      label: 'Sàn Tập Trung (CEX)',
      icon: <UserGroupIcon className="w-4 h-4 mr-1.5" />,
      content: (
        <InfoPanel title="Đặc Điểm Của Sàn Tập Trung (CEX)" icon={<UserGroupIcon />}>
            <p><strong>Ưu điểm:</strong></p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li><strong>Thanh khoản cao:</strong> Thường có khối lượng giao dịch lớn, dễ dàng mua bán.</li>
              <li><strong>Tốc độ giao dịch nhanh:</strong> Giao dịch thường được xử lý ngoài chuỗi (off-chain) nhanh chóng.</li>
              <li><strong>Nhiều tính năng:</strong> Cung cấp các công cụ giao dịch nâng cao như margin trading, futures, staking, lending.</li>
              <li><strong>Hỗ trợ khách hàng:</strong> Thường có đội ngũ hỗ trợ giải quyết vấn đề.</li>
              <li><strong>Giao diện thân thiện:</strong> Dễ sử dụng cho người mới bắt đầu.</li>
            </ul>
            <p className="mt-2"><strong>Nhược điểm:</strong></p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li><strong>Rủi ro lưu ký (Custodial Risk):</strong> Bạn không trực tiếp kiểm soát khóa riêng tư của mình. Nếu sàn bị hack hoặc phá sản, bạn có thể mất tài sản. ("Not your keys, not your coins").</li>
              <li><strong>Yêu cầu KYC/AML:</strong> Thường yêu cầu xác minh danh tính (Know Your Customer/Anti-Money Laundering).</li>
              <li><strong>Thiếu minh bạch:</strong> Hoạt động nội bộ của sàn không hoàn toàn công khai.</li>
              <li><strong>Rủi ro bị đóng băng tài khoản:</strong> Sàn có thể đóng băng tài khoản của bạn theo yêu cầu pháp lý hoặc do vi phạm điều khoản.</li>
            </ul>
            <p className="mt-3 font-semibold">Cơ chế hoạt động chính:</p>
            <p>CEX sử dụng <strong className="text-yellow-300">Sổ Lệnh (Order Book)</strong> để khớp lệnh mua và bán từ người dùng. Đây là một danh sách các lệnh đang chờ ở các mức giá khác nhau. Bạn có thể đặt lệnh Thị Trường (khớp ngay giá tốt nhất) hoặc lệnh Giới Hạn (chờ khớp ở giá mong muốn).</p>
            
            <div className="mt-4 pt-4 border-t border-slate-600/50">
                <h4 className="text-md font-semibold text-sky-300 text-center mb-2">Mô Phỏng Sổ Lệnh (Order Book)</h4>
                <OrderBookDemo />
            </div>
        </InfoPanel>
      )
    },
    {
      id: 'dex',
      label: 'Sàn Phi Tập Trung (DEX)',
      icon: <ArrowsRightLeftIcon className="w-4 h-4 mr-1.5" />,
      content: (
         <InfoPanel title="Đặc Điểm Của Sàn Phi Tập Trung (DEX)" icon={<ArrowsRightLeftIcon />}>
            <p><strong>Ưu điểm:</strong></p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li><strong>Kiểm soát tài sản:</strong> Bạn giữ khóa riêng tư và giao dịch trực tiếp từ ví của mình (non-custodial).</li>
              <li><strong>Minh bạch:</strong> Mọi giao dịch đều được ghi lại trên blockchain.</li>
              <li><strong>Không yêu cầu KYC (thường):</strong> Cho phép giao dịch ẩn danh hơn (tùy thuộc vào DEX và khu vực pháp lý).</li>
              <li><strong>Khó bị kiểm duyệt:</strong> Khó bị chính phủ hoặc tổ chức nào đóng cửa.</li>
              <li><strong>Truy cập sớm token mới:</strong> Nhiều token mới thường xuất hiện trên DEX trước khi lên CEX.</li>
            </ul>
            <p className="mt-2"><strong>Nhược điểm:</strong></p>
            <ul className="list-disc list-inside ml-4 text-slate-400 text-xs space-y-1">
              <li><strong>Phí giao dịch (Gas fees):</strong> Có thể cao và biến động tùy thuộc vào mạng blockchain.</li>
              <li><strong>Trượt giá (Slippage):</strong> Giá có thể thay đổi trong quá trình thực hiện lệnh, đặc biệt với thanh khoản thấp.</li>
              <li><strong>Giao diện phức tạp hơn:</strong> Có thể khó sử dụng hơn cho người mới.</li>
              <li><strong>Rủi ro hợp đồng thông minh:</strong> Lỗi trong smart contract của DEX có thể bị khai thác.</li>
              <li><strong>Tốc độ giao dịch chậm hơn:</strong> Phụ thuộc vào tốc độ của blockchain.</li>
            </ul>
            <p className="mt-3 font-semibold">Cơ chế hoạt động chính:</p>
            <p>Nhiều DEX hiện đại sử dụng cơ chế <strong className="text-yellow-300">AMM (Automated Market Maker)</strong>. Thay vì sổ lệnh, AMM sử dụng các <strong className="text-yellow-300">Pool Thanh Khoản (Liquidity Pools)</strong>. Người dùng cung cấp tài sản vào pool để nhận phí giao dịch, và các giao dịch (swap) được thực hiện dựa trên thuật toán định giá của pool.</p>
            
             <div className="mt-4 pt-4 border-t border-slate-600/50">
                <h4 className="text-md font-semibold text-sky-300 text-center mb-2">Mô Phỏng Hoán Đổi (Swap) trên AMM</h4>
                <SwapDemo />
            </div>
        </InfoPanel>
      )
    },
     {
      id: 'risks',
      label: 'Rủi Ro & Lưu Ý',
      icon: <ShieldExclamationIcon className="w-4 h-4 mr-1.5" />,
      content: (
        <InfoPanel title="Rủi Ro và Những Điều Cần Lưu Ý Khi Giao Dịch" icon={<ShieldExclamationIcon />} className="bg-red-800/30 ring-red-600/70">
            <p className="text-red-200">Giao dịch tài sản mã hoá luôn tiềm ẩn rủi ro. Dưới đây là một số điểm quan trọng cần ghi nhớ:</p>
            <ul className="list-disc list-inside ml-4 text-red-300 text-sm space-y-2">
                <li>
                    <strong className="text-red-100">Biến động thị trường (Volatility):</strong> Giá tài sản mã hoá có thể thay đổi rất nhanh và mạnh.
                </li>
                <li>
                    <strong className="text-red-100">Bảo mật tài khoản:</strong> Sử dụng mật khẩu mạnh, xác thực hai yếu tố (2FA). Cẩn thận với các email/tin nhắn lừa đảo (phishing) yêu cầu thông tin đăng nhập.
                </li>
                <li>
                    <strong className="text-red-100">Rủi ro sàn giao dịch:</strong>
                    <ul className="list-circle list-inside ml-4 text-xs text-red-400 space-y-0.5 mt-0.5">
                        <li><strong>Với CEX:</strong> Rủi ro mất tài sản nếu sàn bị hack, phá sản, hoặc đóng băng tài khoản.</li>
                        <li><strong>Với DEX:</strong> Rủi ro từ lỗi hợp đồng thông minh, trượt giá cao, hoặc các dự án lừa đảo (rug pulls) trong pool thanh khoản.</li>
                    </ul>
                </li>
                <li>
                    <strong className="text-red-100">Nghiên cứu kỹ (DYOR - Do Your Own Research):</strong> Tìm hiểu về dự án, token trước khi đầu tư. Đừng tin vào các lời khuyên "kèo thơm" mà không tự kiểm chứng.
                </li>
                <li>
                    <strong className="text-red-100">Phí giao dịch:</strong> Hiểu rõ các loại phí (phí giao dịch, phí nạp/rút, phí gas) để tránh bất ngờ.
                </li>
                <li>
                    <strong className="text-red-100">Pháp lý và Quy định:</strong> Quy định về tài sản mã hoá khác nhau ở mỗi quốc gia và có thể thay đổi.
                </li>
            </ul>
            <p className="mt-4 text-red-100 font-bold">Lời khuyên:</p>
            <ul className="list-decimal list-inside ml-4 text-red-200 text-sm space-y-1">
                <li>Bắt đầu với số vốn nhỏ mà bạn sẵn sàng mất.</li>
                <li>Không bao giờ chia sẻ khóa riêng tư hoặc cụm từ khôi phục ví của bạn.</li>
                <li>Sử dụng ví phần cứng để lưu trữ lượng lớn tài sản mã hoá lâu dài.</li>
                <li>Đa dạng hóa danh mục đầu tư.</li>
                <li>Luôn cập nhật kiến thức và cảnh giác với các hình thức lừa đảo mới.</li>
            </ul>
             <div className="mt-4 p-3 bg-yellow-700/30 text-yellow-200 text-xs rounded-md ring-1 ring-yellow-600/50">
                <InformationCircleIcon className="w-5 h-5 inline mr-1.5 align-middle" />
                Nền tảng này chỉ cung cấp thông tin và mô phỏng cho mục đích giáo dục, <strong className="uppercase">không phải lời khuyên đầu tư</strong>.
            </div>
        </InfoPanel>
      )
    }
  ];


  return (
    <div className="space-y-8 animate-fade-in-down">
      <section className="text-center">
        <div className="flex items-center justify-center text-sky-400 mb-3">
            <BuildingStorefrontIcon className="w-10 h-10 md:w-12 md:h-12 mr-3"/>
            <h1 className="text-3xl md:text-4xl font-bold">Tìm Hiểu Về Sàn Giao Dịch Tài Sản Mã Hoá</h1>
        </div>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Khám phá cách hoạt động của các sàn giao dịch tài sản mã hoá, sự khác biệt giữa sàn tập trung (CEX) và phi tập trung (DEX), cùng các khái niệm giao dịch cơ bản thông qua mô phỏng.
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-1 border-b border-slate-700 pb-2 mb-4 sticky top-[70px] md:top-[80px] z-20 bg-slate-800/90 backdrop-blur-md py-2 rounded-b-md">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:scale-105
              ${activeTabId === tab.id
                ? 'bg-sky-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-1 md:p-2 min-h-[400px] bg-slate-800/50 rounded-lg shadow-inner ring-1 ring-slate-700/50">
        {tabs.find(tab => tab.id === activeTabId)?.content}
      </div>

    </div>
  );
};

export default ExchangesExplainedView;