
import React from 'react';
import { ViewName, DEFAULT_CURRENCY, NotificationType } from '../types';
import { 
    InfoIcon, ShieldCheckIcon, KeyIcon as KeyInfoIcon, BookOpenIcon as BookIcon, 
    SparklesIcon, ArrowRightCircleIcon, BuildingStorefrontIcon, AcademicCapIcon,
    BlockchainIcon, RocketLaunchIcon, ExternalLinkIcon, MagnifyingGlassIcon // Added MagnifyingGlassIcon
} from '../components/Icons'; 
import DailyBlockchainNewsSection from '../components/DailyBlockchainNewsSection';
import RealtimeScamAlerts from '../components/RealtimeScamAlerts';

interface HomeViewProps {
  onNavigate: (view: ViewName) => void;
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const EducationalCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-slate-700/80 p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-slate-600/50 hover:ring-sky-500/70 ${className}`}>
    <div className="flex items-center text-sky-400 mb-3">
      {icon}
      <h3 className="text-lg font-semibold ml-3">{title}</h3>
    </div>
    <p className="text-slate-300 text-sm leading-relaxed">{children}</p>
  </div>
);

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; targetView: ViewName; onNavigate: (view: ViewName) => void;}> = 
  ({ title, description, icon, targetView, onNavigate }) => (
  <div 
    className="bg-slate-700 p-6 rounded-xl shadow-lg hover:shadow-sky-500/30 transition-shadow duration-300 cursor-pointer ring-1 ring-slate-600 hover:ring-sky-500 flex flex-col" // Added flex flex-col
    onClick={() => onNavigate(targetView)}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === 'Enter' && onNavigate(targetView)}
  >
    <div className="flex items-center text-sky-400 mb-3">
      {icon}
      <h3 className="ml-3 text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-slate-300 text-sm mb-4 flex-grow">{description}</p> {/* Added flex-grow */}
    <span className="text-sky-500 hover:text-sky-400 font-medium text-sm flex items-center mt-auto"> {/* Added mt-auto */}
      Tìm hiểu ngay <ArrowRightCircleIcon className="w-5 h-5 ml-1" />
    </span>
  </div>
);


const HomeView: React.FC<HomeViewProps> = ({ onNavigate, addNotification }) => {
  return (
    <div className="space-y-10 md:space-y-12 animate-fade-in-down">
      <section className="text-center p-6 md:p-8 bg-gradient-to-br from-slate-700/50 to-slate-800/30 rounded-xl shadow-2xl ring-1 ring-slate-600/30">
        <div className="flex flex-col items-center justify-center text-sky-300 mb-4">
          <SparklesIcon className="w-12 h-12 md:w-16 md:h-16 mr-0 mb-3 text-sky-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Chào Mừng Đến ABAII Blockchain Lab!</h1>
        </div>
        <p className="text-slate-300 mb-2 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Khám phá thế giới phức tạp của công nghệ blockchain một cách trực quan, an toàn và dễ hiểu.
          Nền tảng này được thiết kế để cung cấp kiến thức từ cơ bản đến nâng cao, cùng các demo tương tác, giúp bạn tự tin hơn khi tương tác với công nghệ blockchain.
        </p>
        <p className="text-xs text-slate-500 max-w-3xl mx-auto">Tất cả thông tin và công cụ mô phỏng chỉ dành cho mục đích giáo dục.</p>
        
        <div className="mt-6 pt-4 border-t border-slate-600/50 text-xs text-slate-400 max-w-2xl mx-auto">
          <p className="font-semibold mb-1 text-slate-300">Thông tin hỗ trợ:</p>
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
          <div className="mt-2 flex justify-center items-center space-x-4">
            <a href="https://www.youtube.com/@ABAII-2024" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 flex items-center" title="Kênh YouTube">
              <ExternalLinkIcon className="w-4 h-4 mr-1" /> YouTube
            </a>
            <a href="https://www.tiktok.com/@taisanso.abaii" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 flex items-center" title="Kênh TikTok">
              <ExternalLinkIcon className="w-4 h-4 mr-1" /> TikTok
            </a>
            <a href="https://www.facebook.com/ABAIIacademy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 flex items-center" title="Fanpage Facebook">
              <ExternalLinkIcon className="w-4 h-4 mr-1" /> Fanpage
            </a>
          </div>
        </div>
      </section>

      {/* Integrated Blockchain News Section */}
      <section className="p-4 md:p-6 bg-slate-800/40 rounded-xl shadow-xl ring-1 ring-slate-700/50">
        <DailyBlockchainNewsSection addNotification={addNotification} />
      </section>

      {/* Integrated Scam Alerts Section */}
      <section className="p-4 md:p-6 bg-red-900/20 rounded-xl shadow-xl ring-1 ring-red-700/50">
        <RealtimeScamAlerts addNotification={addNotification} />
      </section>


      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-sky-400 text-center">Bắt Đầu Hành Trình Của Bạn</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <FeatureCard 
            title="Nguyên Lý Sinh Khóa" 
            description="Tìm hiểu sâu về cách khóa riêng tư, khóa công khai và địa chỉ ví được tạo ra như thế nào. Khám phá các khái niệm mật mã cơ bản."
            icon={<KeyInfoIcon className="w-8 h-8"/>}
            targetView="keyGeneration"
            onNavigate={onNavigate}
          />
          <FeatureCard 
            title="Các Loại Ví Tài Sản Mã Hoá" 
            description="Phân biệt các loại ví nóng, ví lạnh, ví phần cứng, ví phần mềm, ví giấy và ưu nhược điểm của từng loại."
            icon={<BookIcon className="w-8 h-8"/>}
            targetView="walletTypes"
            onNavigate={onNavigate}
          />
          <FeatureCard 
            title="Tìm Hiểu Công Nghệ Blockchain" 
            description="Tương tác trực tiếp với các khái niệm như hàm băm, khối, chuỗi khối và sổ cái phân tán để hiểu rõ bản chất của blockchain."
            icon={<BlockchainIcon className="w-8 h-8"/>}
            targetView="blockchainDemo"
            onNavigate={onNavigate}
          />
           <FeatureCard 
            title="Mô Phỏng Ví Thực Hành" 
            description={`Tạo một ví mô phỏng, nhận và gửi '${DEFAULT_CURRENCY.symbol}' (Tài sản mã hoá mô phỏng) để hiểu rõ hơn về cách thức hoạt động của ví.`}
            icon={<SparklesIcon className="w-8 h-8"/>}
            targetView="simulator"
            onNavigate={onNavigate}
          />
          <FeatureCard 
            title="Tìm Hiểu Sàn Giao Dịch" 
            description="Khám phá các loại sàn giao dịch tài sản mã hoá (CEX, DEX), cách chúng hoạt động, và các khái niệm giao dịch cơ bản."
            icon={<BuildingStorefrontIcon className="w-8 h-8"/>}
            targetView="exchangesExplained"
            onNavigate={onNavigate}
          />
           <FeatureCard 
            title="Giao Dịch Blockchain" 
            description="Tìm hiểu vòng đời của một giao dịch trên blockchain và cách ví ngoại tuyến (ví lạnh) thực hiện giao dịch an toàn."
            icon={<AcademicCapIcon className="w-8 h-8"/>}
            targetView="transactionsExplained"
            onNavigate={onNavigate}
          />
          <FeatureCard 
            title="Vòng Đời Token" 
            description="Khám phá quy trình phát hành và lưu thông của một token/coin: từ ý tưởng, tạo token, cung cấp thanh khoản, đến rủi ro và các yếu tố hệ sinh thái."
            icon={<RocketLaunchIcon className="w-8 h-8"/>}
            targetView="tokenLifecycle"
            onNavigate={onNavigate}
          />
          <FeatureCard 
            title="🔍 Test Dự Án Blockchain" 
            description="Phân tích dự án blockchain theo các tiêu chí T.E.S.T.S (Token, Exchange, Security, Team, Social) bằng AI để có cái nhìn tổng quan."
            icon={<MagnifyingGlassIcon className="w-8 h-8"/>}
            targetView="projectTestAutomation"
            onNavigate={onNavigate}
          />
           <FeatureCard 
            title="Thuật Ngữ Blockchain" 
            description="Tra cứu và tìm hiểu các thuật ngữ quan trọng thường gặp trong không gian blockchain và tài sản mã hoá."
            icon={<InfoIcon className="w-8 h-8"/>}
            targetView="glossary"
            onNavigate={onNavigate}
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-sky-400 text-center mb-6">Kiến Thức Nền Tảng Về Ví Tài Sản Mã Hoá</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <EducationalCard title="Ví Tài sản mã hoá là gì?" icon={<ShieldCheckIcon className="w-7 h-7"/>}>
            Là công cụ kỹ thuật số cho phép bạn tương tác với mạng blockchain. Nó quản lý các khóa mật mã (khóa riêng tư và công khai) của bạn, cho phép bạn gửi, nhận và kiểm soát tài sản mã hoá. Ví không "lưu trữ" tài sản mã hoá của bạn trực tiếp; tài sản mã hoá được ghi trên blockchain.
          </EducationalCard>
          <EducationalCard title="Địa chỉ Công khai (Public Address)" icon={<InfoIcon className="w-7 h-7"/>}>
            Giống như số tài khoản ngân hàng của bạn trong thế giới tài sản mã hoá. Bạn có thể chia sẻ công khai địa chỉ này để nhận tài sản mã hoá. Nó được tạo ra từ khóa công khai của bạn.
          </EducationalCard>
          <EducationalCard title="Khóa Riêng tư (Private Key)" icon={<KeyInfoIcon className="w-7 h-7"/>}>
            Là mật khẩu tối thượng của bạn, cung cấp toàn quyền truy cập và kiểm soát tài sản mã hoá trong ví. 
            <strong className="text-red-400 block mt-1">TUYỆT ĐỐI BẢO MẬT! Không bao giờ chia sẻ khóa riêng tư thật với bất kỳ ai.</strong> Mất khóa riêng tư đồng nghĩa với mất tài sản mã hoá. (Trong các mô phỏng, chúng tôi chỉ dùng khóa giả.)
          </EducationalCard>
          <EducationalCard title="Cụm Từ Khôi Phục (Seed Phrase)" icon={<BookIcon className="w-7 h-7"/>}>
            Một chuỗi các từ (thường là 12 hoặc 24 từ) dùng để sao lưu và khôi phục toàn bộ ví của bạn. Quan trọng tương đương khóa riêng tư.
            <strong className="text-red-400 block mt-1">Cần được lưu trữ cẩn thận, ngoại tuyến và bí mật.</strong> (Các mô phỏng cũng dùng cụm từ giả.)
          </EducationalCard>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
