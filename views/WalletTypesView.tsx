
import React from 'react';
import { WalletType, EducationalWalletType, DEFAULT_CURRENCY } from '../types';
import { FireIcon, SnowflakeIcon, CpuChipIcon, ComputerDesktopIcon, DocumentTextIcon, InfoIcon, ShieldCheckIcon, ShieldExclamationIcon, CheckBadgeIcon, MinusCircleIcon, UserGroupIcon } from '../components/Icons';

const walletTypesDetails: EducationalWalletType[] = [
  {
    type: WalletType.HOT,
    title: "Ví Nóng (Hot Wallet)",
    iconName: "FireIcon",
    description: "Luôn kết nối internet. Tiện lợi cho giao dịch thường xuyên nhưng tiềm ẩn rủi ro bảo mật cao hơn khi quản lý tài sản mã hoá.",
    details: [
      "Hoạt động trên các thiết bị có kết nối mạng như máy tính, điện thoại, trình duyệt web.",
      "Khóa riêng tư được lưu trữ và quản lý trên thiết bị đang online hoặc bởi một dịch vụ trực tuyến.",
      "Ưu điểm: Truy cập nhanh, dễ sử dụng, phù hợp cho giao dịch hàng ngày và giữ một lượng nhỏ tài sản mã hoá.",
      "Nhược điểm: Dễ bị tấn công bởi malware, phishing, keylogger nếu thiết bị hoặc dịch vụ bị xâm phạm."
    ],
    pros: ["Tiện lợi, nhanh chóng", "Dễ sử dụng cho người mới", "Thường miễn phí"],
    cons: ["Kém an toàn hơn ví lạnh", "Phụ thuộc vào bảo mật thiết bị/dịch vụ", "Rủi ro mất tài sản mã hoá nếu bị hack"]
  },
  {
    type: WalletType.COLD,
    title: "Ví Lạnh (Cold Wallet)",
    iconName: "SnowflakeIcon",
    description: "Lưu trữ khóa riêng tư ngoại tuyến (offline), an toàn hơn nhiều so với ví nóng. Thích hợp để lưu trữ tài sản mã hoá lâu dài.",
    details: [
      "Khóa riêng tư được tạo và lưu trữ trên một thiết bị không kết nối internet.",
      "Các giao dịch được ký ngoại tuyến và sau đó được phát lên mạng bằng một thiết bị online.",
      "Ví dụ điển hình: Ví phần cứng, ví giấy, hoặc máy tính air-gapped (cách ly mạng).",
      "Ưu điểm: Mức độ bảo mật cao nhất cho tài sản mã hoá, miễn nhiễm với các cuộc tấn công trực tuyến.",
      "Nhược điểm: Kém tiện lợi hơn cho giao dịch thường xuyên, có thể tốn kém (ví phần cứng)."
    ],
    pros: ["Bảo mật rất cao", "Lý tưởng cho lưu trữ dài hạn", "Kiểm soát hoàn toàn khóa riêng tư"],
    cons: ["Kém tiện lợi", "Có thể cần kiến thức kỹ thuật hơn", "Rủi ro mất mát vật lý hoặc hư hỏng"]
  },
  {
    type: WalletType.HARDWARE,
    title: "Ví Phần Cứng (Hardware Wallet)",
    iconName: "CpuChipIcon",
    description: "Một thiết bị vật lý chuyên dụng lưu trữ khóa riêng tư ngoại tuyến. Được coi là một trong những lựa chọn an toàn nhất để bảo vệ tài sản mã hoá.",
    details: [
      "Là một dạng ví lạnh. Thiết bị nhỏ gọn, thường giống USB.",
      "Khóa riêng tư không bao giờ rời khỏi thiết bị, ngay cả khi ký giao dịch.",
      "Kết nối với máy tính/điện thoại qua USB hoặc Bluetooth khi cần thực hiện giao dịch.",
      "Thường yêu cầu mã PIN và có thể có cụm từ khôi phục riêng.",
      "Ví dụ phổ biến: Ledger, Trezor."
    ],
    pros: ["Bảo mật xuất sắc (offline keys)", "Chống malware hiệu quả", "Hỗ trợ nhiều loại tài sản mã hoá"],
    cons: ["Giá thành tương đối cao", "Yêu cầu thiết bị vật lý", "Có thể bị mất hoặc hư hỏng vật lý"]
  },
  {
    type: WalletType.SOFTWARE,
    title: "Ví Phần Mềm (Software Wallet)",
    iconName: "ComputerDesktopIcon",
    description: "Ứng dụng trên máy tính (desktop), điện thoại (mobile) hoặc trình duyệt web (web wallet) để quản lý tài sản mã hoá.",
    details: [
      "Có thể là ví nóng (nếu khóa được quản lý trên thiết bị online) hoặc ví lạnh (nếu là phần mềm quản lý ví giấy/phần cứng).",
      "Ví Desktop: Cài đặt trên máy tính, cung cấp nhiều tính năng. Ví dụ: Electrum, Exodus.",
      "Ví Mobile: Ứng dụng trên điện thoại, tiện lợi cho giao dịch khi di chuyển. Ví dụ: Trust Wallet, MetaMask Mobile.",
      "Ví Web: Truy cập qua trình duyệt, có thể là dạng extension hoặc website. Ví dụ: MetaMask (extension), MyEtherWallet (website).",
    ],
    pros: ["Thường miễn phí và dễ cài đặt", "Nhiều lựa chọn đa dạng", "Tiện lợi cho người dùng phổ thông"],
    cons: ["Độ an toàn phụ thuộc vào loại (nóng/lạnh) và bảo mật thiết bị", "Ví web có thể dễ bị phishing"]
  },
  {
    type: WalletType.PAPER,
    title: "Ví Giấy (Paper Wallet)",
    iconName: "DocumentTextIcon",
    description: "Một bản in chứa địa chỉ công khai và khóa riêng tư (thường dưới dạng mã QR) cho tài sản mã hoá. Một dạng ví lạnh cơ bản.",
    details: [
      "Khóa được tạo ngoại tuyến và in ra giấy.",
      "Rất an toàn nếu được tạo và lưu trữ đúng cách (tránh ẩm, lửa, phai màu).",
      "Để chi tiêu tài sản mã hoá, khóa riêng tư cần được 'quét' (nhập) vào một ví phần mềm.",
      "Ngày nay ít phổ biến hơn do sự tiện lợi và an toàn của ví phần cứng.",
      "Cần cẩn thận khi tạo ví giấy để đảm bảo máy tính và máy in không bị nhiễm malware."
    ],
    pros: ["Hoàn toàn ngoại tuyến nếu tạo đúng cách", "Miễn phí (chỉ tốn giấy mực)", "Kiểm soát 100% khóa"],
    cons: ["Dễ bị hỏng, rách, mất, phai màu", "Bất tiện khi sử dụng", "Rủi ro nếu tạo trên máy tính không an toàn"]
  },
  {
    type: WalletType.CUSTODIAL,
    title: "Ví Lưu Ký (Custodial Wallet)",
    iconName: "UserGroupIcon",
    description: "Loại ví mà khóa riêng tư của bạn được quản lý bởi một bên thứ ba (ví dụ: sàn giao dịch CEX, một số dịch vụ ví trực tuyến). Bạn không trực tiếp giữ khóa của mình.",
    details: [
      "Bên thứ ba (sàn giao dịch, nhà cung cấp dịch vụ ví) chịu trách nhiệm bảo mật khóa riêng tư của bạn.",
      "Tiện lợi cho người mới bắt đầu vì không phải lo lắng về việc tự quản lý và bảo vệ khóa.",
      "Thường tích hợp sẵn với các dịch vụ của nền tảng như giao dịch, staking, lending.",
      "Sự an toàn của tài sản phụ thuộc hoàn toàn vào uy tín và năng lực bảo mật của bên thứ ba."
    ],
    pros: [
      "Dễ sử dụng, không cần tự quản lý khóa phức tạp.",
      "Quy trình khôi phục tài khoản có thể dễ dàng hơn thông qua hỗ trợ của bên thứ ba (ví dụ: quên mật khẩu).",
      "Tích hợp nhiều dịch vụ tiện ích."
    ],
    cons: [
      "Không toàn quyền kiểm soát tài sản (\"Not your keys, not your coins\").",
      "Rủi ro mất tài sản nếu bên thứ ba bị hack, phá sản, hoặc có hành vi gian lận.",
      "Có thể bị đóng băng tài khoản hoặc hạn chế rút tiền theo quy định của bên thứ ba hoặc yêu cầu pháp lý.",
      "Thường yêu cầu xác minh danh tính (KYC)."
    ]
  },
  {
    type: WalletType.NON_CUSTODIAL,
    title: "Ví Không Lưu Ký (Non-Custodial Wallet)",
    iconName: "ShieldCheckIcon",
    description: "Loại ví mà bạn hoàn toàn kiểm soát khóa riêng tư của mình. Bạn chịu trách nhiệm hoàn toàn cho việc bảo mật khóa.",
    details: [
      "Khóa riêng tư và cụm từ khôi phục được tạo ra và lưu trữ trực tiếp trên thiết bị của bạn (ví dụ: ví phần mềm như MetaMask, Trust Wallet; ví phần cứng như Ledger, Trezor) hoặc do bạn quản lý (ví dụ: ví giấy).",
      "Cung cấp chủ quyền tài chính thực sự, bạn là người duy nhất có quyền truy cập vào tài sản của mình.",
      "Yêu cầu người dùng phải có kiến thức và trách nhiệm cao trong việc bảo vệ khóa riêng tư và cụm từ khôi phục."
    ],
    pros: [
      "Toàn quyền kiểm soát tài sản của bạn.",
      "Mức độ riêng tư cao hơn, thường không yêu cầu KYC (đối với việc tạo ví).",
      "Khó bị kiểm duyệt hoặc đóng băng tài khoản bởi bên thứ ba.",
      "Lựa chọn tốt cho lưu trữ dài hạn và an toàn, đặc biệt là các ví lạnh non-custodial (ví phần cứng, ví giấy)."
    ],
    cons: [
      "Nếu mất khóa riêng tư hoặc cụm từ khôi phục, tài sản sẽ bị mất vĩnh viễn và không có cách nào lấy lại.",
      "Yêu cầu trách nhiệm cao hơn từ người dùng trong việc bảo mật.",
      "Có thể phức tạp hơn cho người mới bắt đầu làm quen.",
      "Người dùng tự chịu trách nhiệm nếu thiết bị bị nhiễm malware hoặc bị lừa đảo (phishing)."
    ]
  }
];


const getIconForWalletType = (iconName: string, className: string = "w-10 h-10") => {
  switch (iconName) {
    case "FireIcon": return <FireIcon className={className} />;
    case "SnowflakeIcon": return <SnowflakeIcon className={className} />;
    case "CpuChipIcon": return <CpuChipIcon className={className} />;
    case "ComputerDesktopIcon": return <ComputerDesktopIcon className={className} />;
    case "DocumentTextIcon": return <DocumentTextIcon className={className} />;
    case "UserGroupIcon": return <UserGroupIcon className={className} />;
    case "ShieldCheckIcon": return <ShieldCheckIcon className={className} />;
    default: return <InfoIcon className={className} />;
  }
};

const WalletTypeCard: React.FC<{ info: EducationalWalletType }> = ({ info }) => {
  return (
    <div className="bg-slate-700/70 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ring-1 ring-slate-600/50 flex flex-col">
      <div className="flex items-center text-sky-400 mb-4">
        {getIconForWalletType(info.iconName)}
        <h3 className="text-2xl font-semibold ml-4">{info.title}</h3>
      </div>
      <p className="text-slate-300 text-sm mb-4 leading-relaxed">{info.description}</p>
      
      {info.details && info.details.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-sky-300 mb-1">Chi tiết:</h4>
          <ul className="list-disc list-inside text-slate-400 text-xs space-y-1 pl-1">
            {info.details.map((detail, index) => <li key={index}>{detail}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-600/50">
        {info.pros && info.pros.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-1 flex items-center"><CheckBadgeIcon className="w-5 h-5 mr-1.5"/> Ưu điểm:</h4>
            <ul className="list-disc list-inside text-slate-400 text-xs space-y-1 pl-1">
              {info.pros.map((pro, index) => <li key={index}>{pro}</li>)}
            </ul>
          </div>
        )}
        {info.cons && info.cons.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-1 flex items-center"><MinusCircleIcon className="w-5 h-5 mr-1.5"/> Nhược điểm:</h4>
            <ul className="list-disc list-inside text-slate-400 text-xs space-y-1 pl-1">
              {info.cons.map((con, index) => <li key={index}>{con}</li>)}
            </ul>
          </div>
        )}
      </div>
       {info.type === WalletType.SOFTWARE && <p className="mt-4 text-xs text-sky-300/70 bg-sky-800/30 p-2 rounded-md ring-1 ring-sky-700/50"><InfoIcon className="w-4 h-4 inline mr-1"/>Ví mô phỏng trên nền tảng này là một dạng ví phần mềm (web) hoạt động như một ví nóng cho ${DEFAULT_CURRENCY.symbol}. Đây cũng là một ví <strong className="font-semibold">không lưu ký (non-custodial)</strong> vì bạn (mô phỏng) kiểm soát khóa.</p>}
    </div>
  );
};


const WalletTypesView: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in-down">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-3">Phân Loại Ví Tài Sản Mã Hoá</h1>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Khám phá sự đa dạng của các loại ví tài sản mã hoá, hiểu rõ ưu nhược điểm và trường hợp sử dụng phù hợp cho từng loại để bảo vệ tài sản mã hoá của bạn một cách tốt nhất. Bao gồm cả khái niệm ví lưu ký và không lưu ký.
        </p>
      </section>
      
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {walletTypesDetails.map((walletInfo) => (
          <WalletTypeCard key={walletInfo.type} info={walletInfo} />
        ))}
      </div>

      <section className="mt-8 p-6 bg-slate-700/50 rounded-lg shadow-xl ring-1 ring-slate-600/50">
        <h2 className="text-2xl font-semibold text-sky-400 mb-3 flex items-center"><ShieldCheckIcon className="w-7 h-7 mr-2"/>Chọn Ví Nào Cho Bạn?</h2>
        <p className="text-slate-300 text-sm mb-2">Việc lựa chọn ví phụ thuộc vào nhu cầu và mức độ ưu tiên bảo mật của bạn đối với tài sản mã hoá:</p>
        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
          <li><strong className="text-sky-300">Giao dịch thường xuyên, số lượng nhỏ, chấp nhận rủi ro từ bên thứ ba:</strong> Ví lưu ký (Custodial) trên các sàn CEX lớn có thể tiện lợi.</li>
          <li><strong className="text-sky-300">Giao dịch thường xuyên, muốn tự kiểm soát khóa:</strong> Ví nóng không lưu ký (Non-Custodial software wallet) như MetaMask, Trust Wallet.</li>
          <li><strong className="text-sky-300">Lưu trữ số lượng lớn, dài hạn ("HODL"), ưu tiên bảo mật tối đa:</strong> Ví lạnh không lưu ký (Non-Custodial hardware wallet, paper wallet) là lựa chọn hàng đầu.</li>
          <li><strong className="text-sky-300">Cân bằng giữa an toàn và tiện lợi:</strong> Kết hợp sử dụng. Ví dụ, giữ phần lớn tài sản mã hoá trong ví lạnh không lưu ký và một phần nhỏ trong ví nóng (lưu ký hoặc không lưu ký) để giao dịch.</li>
        </ul>
        <p className="mt-3 text-xs text-yellow-300/80"><ShieldExclamationIcon className="w-4 h-4 inline mr-1"/>Luôn nghiên cứu kỹ và hiểu rõ cách hoạt động của ví trước khi chuyển một lượng lớn tài sản mã hoá vào đó. Nếu sử dụng ví không lưu ký, bảo mật khóa riêng tư và cụm từ khôi phục là <strong className="font-semibold">trách nhiệm tối cao của bạn</strong>.</p>
      </section>

    </div>
  );
};

export default WalletTypesView;