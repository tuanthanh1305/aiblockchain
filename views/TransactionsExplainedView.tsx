
import React from 'react';
import { AcademicCapIcon, CubeTransparentIcon, LinkIcon, ShieldCheckIcon, SnowflakeIcon, CommandLineIcon, ArrowDownIcon, ComputerDesktopIcon, ArrowRightCircleIcon } from '../components/Icons';
import OfflineSigningDemo from '../components/OfflineSigningDemo'; // Import new demo component

const InfoSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-slate-700/60 p-6 rounded-xl shadow-xl ring-1 ring-slate-600/50 ${className}`}>
    <div className="flex items-center text-sky-400 mb-4">
      {icon}
      <h2 className="text-xl md:text-2xl font-semibold ml-3">{title}</h2>
    </div>
    <div className="space-y-3 text-slate-300 text-sm leading-relaxed">{children}</div>
  </div>
);

const Step: React.FC<{ number: number, title: string, children: React.ReactNode, icon?: React.ReactNode }> = ({ number, title, children, icon }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div>
                <div className="flex items-center justify-center w-8 h-8 border-2 border-sky-500 rounded-full text-sky-400 font-semibold">
                    {number}
                </div>
            </div>
            <div className="w-px h-full bg-slate-600"></div>
        </div>
        <div className="pb-6">
            <div className="flex items-center mb-1">
                {icon && <span className="mr-2 text-sky-400">{icon}</span>}
                <h3 className="font-semibold text-sky-300">{title}</h3>
            </div>
            <p className="text-slate-400 text-xs">{children}</p>
        </div>
    </div>
);

const DiagramBox: React.FC<{ title: string; description: string; icon: React.ReactNode; className?: string }> = 
({ title, description, icon, className = "" }) => (
  <div className={`p-3 border-2 border-slate-600 rounded-lg text-center bg-slate-700/30 shadow-md ${className}`}>
    <div className="flex flex-col items-center text-sky-400 mb-1">
      {icon}
      <h4 className="text-xs font-semibold mt-1">{title}</h4>
    </div>
    <p className="text-xs text-slate-400">{description}</p>
  </div>
);


const TransactionsExplainedView: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in-down">
      <section className="text-center">
        <div className="flex items-center justify-center text-sky-400 mb-3">
            <AcademicCapIcon className="w-10 h-10 md:w-12 md:h-12 mr-3"/>
            <h1 className="text-3xl md:text-4xl font-bold">Tìm Hiểu Giao Dịch Blockchain</h1>
        </div>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Khám phá cách các giao dịch tài sản mã hoá được thực hiện trên blockchain, vai trò của các khối, và làm thế nào ví ngoại tuyến (ví lạnh, ví giấy) có thể tương tác một cách an toàn.
        </p>
      </section>

      <InfoSection title="Vòng Đời Của Một Giao Dịch Blockchain (Đơn Giản Hóa)" icon={<CubeTransparentIcon className="w-7 h-7"/>}>
        <p>Giao dịch tài sản mã hoá trên blockchain không diễn ra tức thì như chuyển tiền ngân hàng truyền thống. Nó trải qua nhiều bước để đảm bảo tính bảo mật và phi tập trung.</p>
        <div className="mt-4 space-y-0"> {/* Removed space-y-4 here, Step component handles spacing */}
            <Step number={1} title="1. Tạo Giao Dịch" icon={<CommandLineIcon className="w-4 h-4"/>}>
                Người dùng (thông qua ví) quyết định gửi một lượng tài sản mã hoá đến một địa chỉ khác. Ví sẽ tạo một "thông điệp" giao dịch chứa thông tin: địa chỉ người gửi, địa chỉ người nhận, số lượng tài sản mã hoá, phí giao dịch (gas fee), v.v.
            </Step>
            <Step number={2} title="2. Ký Giao Dịch" icon={<ShieldCheckIcon className="w-4 h-4"/>}>
                Ví sử dụng Khóa Riêng Tư của người dùng để "ký" vào thông điệp giao dịch. Chữ ký này chứng minh rằng người dùng thực sự sở hữu tài sản mã hoá và đồng ý với giao dịch, mà không cần tiết lộ Khóa Riêng Tư.
            </Step>
            <Step number={3} title="3. Phát Tán Giao Dịch" icon={<LinkIcon className="w-4 h-4"/>}>
                Giao dịch đã ký được gửi đến mạng lưới blockchain. Các "node" (máy tính tham gia mạng) sẽ nhận và xác minh sơ bộ giao dịch này (ví dụ: chữ ký có hợp lệ, người gửi có đủ số dư không?).
            </Step>
            <Step number={4} title="4. Đưa Vào Khối (Mining/Validating)" icon={<CubeTransparentIcon className="w-4 h-4"/>}>
                Các "thợ đào" (miners trong Proof-of-Work) hoặc "người xác thực" (validators trong Proof-of-Stake) sẽ chọn các giao dịch hợp lệ từ một "mempool" (khu vực chờ) để đưa vào một khối mới. Họ giải các bài toán mật mã phức tạp (PoW) hoặc đặt cược tài sản (PoS) để có quyền tạo khối.
            </Step>
            <Step number={5} title="5. Xác Nhận Khối & Chuỗi" icon={<LinkIcon className="w-4 h-4"/>}>
                Khi một khối mới được tạo, nó được phát tán đến toàn mạng. Các node khác xác minh khối này. Nếu hợp lệ, khối được thêm vào cuối chuỗi blockchain hiện tại. Giao dịch của bạn giờ đây đã được "xác nhận" và ghi lại vĩnh viễn. Càng nhiều khối được thêm sau khối chứa giao dịch của bạn, giao dịch đó càng được coi là an toàn và khó bị đảo ngược.
            </Step>
        </div>
        <p className="mt-4 text-xs text-sky-300 bg-sky-800/30 p-2 rounded-md ring-1 ring-sky-700/50">
            <strong>Lưu ý:</strong> Đây là mô tả tổng quan. Các blockchain khác nhau (Bitcoin, Ethereum, Solana, ...) có thể có những chi tiết kỹ thuật và cơ chế đồng thuận (PoW, PoS, ...) khác nhau.
        </p>
      </InfoSection>

      <InfoSection title="Cách Ví Ngoại Tuyến (Ví Lạnh/Giấy) Thực Hiện Giao Dịch Tài Sản Mã Hoá" icon={<SnowflakeIcon className="w-7 h-7"/>}>
        <p>Một câu hỏi thường gặp là: "Làm thế nào một chiếc ví được tạo và giữ hoàn toàn offline (không bao giờ kết nối internet) có thể gửi tài sản mã hoá được?" Câu trả lời nằm ở việc tách biệt quá trình tạo, ký và phát tán giao dịch.</p>
        <p>Khóa riêng tư chỉ cần thiết cho việc <strong className="text-yellow-300">ký giao dịch</strong>, không phải để kết nối internet. Quá trình này thường được gọi là "ký ngoại tuyến" (offline signing).</p>
        
        <div className="my-6 p-4 bg-slate-900/50 rounded-xl shadow-xl ring-1 ring-slate-700">
            <h4 className="text-base font-semibold text-sky-400 mb-3 text-center">Sơ Đồ Ký Giao Dịch Ngoại Tuyến</h4>
            <div className="flex flex-col md:flex-row items-stretch justify-around gap-2 text-center">
                <DiagramBox title="Thiết bị Online" description="Chuẩn bị dữ liệu giao dịch (chưa ký)" icon={<ComputerDesktopIcon className="w-6 h-6"/>} className="flex-1"/>
                <div className="flex items-center justify-center p-2"><ArrowDownIcon className="w-6 h-6 text-slate-500 md:hidden"/><ArrowRightCircleIcon className="w-6 h-6 text-slate-500 hidden md:block"/></div>
                <DiagramBox title="Ví Lạnh/Thiết bị Offline" description="Ký giao dịch bằng khóa riêng tư (an toàn)" icon={<SnowflakeIcon className="w-6 h-6"/>} className="flex-1"/>
                <div className="flex items-center justify-center p-2"><ArrowDownIcon className="w-6 h-6 text-slate-500 md:hidden"/><ArrowRightCircleIcon className="w-6 h-6 text-slate-500 hidden md:block"/></div>
                <DiagramBox title="Thiết bị Online" description="Phát tán giao dịch đã ký lên mạng" icon={<LinkIcon className="w-6 h-6"/>} className="flex-1"/>
            </div>
        </div>

        <p><strong className="text-sky-300">Các bước chi tiết:</strong></p>
        <ol className="list-decimal list-inside space-y-2 text-slate-400 text-xs">
          <li><strong>Chuẩn bị giao dịch (Trên thiết bị Online):</strong> Sử dụng một phần mềm ví trên máy tính/điện thoại có kết nối internet, bạn nhập thông tin giao dịch (địa chỉ nhận, số lượng tài sản mã hoá, phí). Phần mềm này sẽ tạo ra "dữ liệu giao dịch thô" (raw transaction data) <strong className="text-yellow-400">chưa được ký</strong>.</li>
          <li><strong>Chuyển dữ liệu giao dịch thô sang thiết bị Offline:</strong> Dữ liệu này được chuyển sang thiết bị ví lạnh (ví dụ: qua USB cho ví phần cứng, QR code cho máy tính air-gapped, hoặc nhập thủ công cho một số trường hợp đơn giản).</li>
          <li><strong>Ký giao dịch (Trên thiết bị Offline):</strong> Ví lạnh sử dụng Khóa Riêng Tư được lưu trữ an toàn bên trong nó để ký vào dữ liệu giao dịch thô. <strong className="text-green-400">Khóa Riêng Tư không bao giờ rời khỏi thiết bị ví lạnh.</strong> Kết quả là một "giao dịch đã ký" (signed transaction).</li>
          <li><strong>Chuyển giao dịch đã ký trở lại thiết bị Online:</strong> Giao dịch đã ký (giờ chỉ là một chuỗi dữ liệu) được chuyển trở lại máy tính/điện thoại online.</li>
          <li><strong>Phát tán giao dịch (Trên thiết bị Online):</strong> Phần mềm ví trên thiết bị online sẽ gửi (phát tán) giao dịch đã ký này lên mạng lưới blockchain. Từ đây, nó sẽ được xử lý như các giao dịch thông thường.</li>
        </ol>
        <p className="mt-3">Bằng cách này, Khóa Riêng Tư luôn được giữ an toàn offline, giảm thiểu đáng kể rủi ro bị đánh cắp qua mạng. Đây là lý do ví lạnh cung cấp mức độ bảo mật cao cho tài sản mã hoá.</p>
        
        {/* Offline Signing Demo Integration */}
        <div className="mt-8 pt-6 border-t border-slate-600/50">
          <h3 className="text-xl font-semibold text-sky-300 mb-3 text-center">Mô Phỏng Ký Giao Dịch Ngoại Tuyến</h3>
          <p className="text-xs text-slate-400 mb-4 text-center">
            Hãy tương tác với quy trình dưới đây để hiểu rõ hơn cách một giao dịch được chuẩn bị online, ký offline (mô phỏng), và sau đó phát tán.
          </p>
          <OfflineSigningDemo />
        </div>
      </InfoSection>

    </div>
  );
};

export default TransactionsExplainedView;