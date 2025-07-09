
import React, { useState } from 'react';
import { BookOpenIcon, MagnifyingGlassIcon } from '../components/Icons';

interface GlossaryTerm {
  term: string;
  definition: string;
  related?: string[];
  category: string;
}

const terms: GlossaryTerm[] = [
  { 
    term: "Address (Địa Chỉ Ví)", 
    definition: "Một chuỗi ký tự chữ và số dùng để gửi và nhận tài sản mã hoá. Tương tự như số tài khoản ngân hàng hoặc địa chỉ email trong thế giới tài sản mã hoá. Địa chỉ ví được tạo ra từ Khóa Công Khai.",
    related: ["Public Key", "Private Key"],
    category: "Cơ Bản"
  },
  { 
    term: "Private Key (Khóa Riêng Tư)", 
    definition: "Một chuỗi ký tự bí mật cho phép truy cập và kiểm soát tài sản mã hoá trong một địa chỉ ví. Phải được giữ tuyệt đối an toàn. Mất khóa riêng tư đồng nghĩa với mất tài sản mã hoá.",
    related: ["Public Key", "Seed Phrase", "Address"],
    category: "Bảo Mật & Khóa"
  },
  { 
    term: "Public Key (Khóa Công Khai)", 
    definition: "Một chuỗi ký tự được tạo ra từ Khóa Riêng Tư thông qua thuật toán mật mã một chiều. Khóa Công Khai có thể được chia sẻ công khai và dùng để tạo ra Địa Chỉ Ví.",
    related: ["Private Key", "Address"],
    category: "Bảo Mật & Khóa"
  },
  { 
    term: "Seed Phrase (Cụm Từ Khôi Phục / Mnemonic Phrase)", 
    definition: "Một chuỗi các từ (thường là 12 hoặc 24 từ) được tạo ra bởi ví, dùng để sao lưu và khôi phục toàn bộ ví (bao gồm tất cả các Khóa Riêng Tư và Địa Chỉ liên quan đến tài sản mã hoá). Cần được lưu trữ cẩn thận, ngoại tuyến và bí mật.",
    related: ["Private Key", "BIP-39", "HD Wallet"],
    category: "Bảo Mật & Khóa"
  },
  { 
    term: "Blockchain", 
    definition: "Một sổ cái kỹ thuật số phi tập trung, phân tán và bất biến, ghi lại các giao dịch (thường là giao dịch tài sản mã hoá) thành các 'khối' (blocks) được liên kết với nhau bằng mã hóa (chain).",
    category: "Công Nghệ"
  },
  { 
    term: "Transaction (Giao Dịch)", 
    definition: "Một hành động chuyển tài sản mã hoá từ địa chỉ này sang địa chỉ khác trên mạng blockchain. Mỗi giao dịch được ghi lại trên blockchain.",
    category: "Cơ Bản"
  },
  { 
    term: "Hot Wallet (Ví Nóng)", 
    definition: "Ví tài sản mã hoá luôn kết nối với internet (ví dụ: ví trên điện thoại, máy tính, ví web). Tiện lợi cho giao dịch thường xuyên nhưng kém an toàn hơn ví lạnh.",
    related: ["Cold Wallet", "Software Wallet"],
    category: "Phân Loại Ví"
  },
  { 
    term: "Cold Wallet (Ví Lạnh)", 
    definition: "Ví tài sản mã hoá lưu trữ khóa riêng tư ngoại tuyến (offline), không kết nối internet (ví dụ: ví phần cứng, ví giấy). An toàn hơn ví nóng, thích hợp để lưu trữ lượng lớn tài sản mã hoá lâu dài.",
    related: ["Hot Wallet", "Hardware Wallet", "Paper Wallet"],
    category: "Phân Loại Ví"
  },
  { 
    term: "Hardware Wallet (Ví Phần Cứng)", 
    definition: "Một thiết bị vật lý chuyên dụng (giống USB) lưu trữ khóa riêng tư ngoại tuyến. Được coi là một trong những lựa chọn an toàn nhất để bảo vệ tài sản mã hoá.",
    related: ["Cold Wallet"],
    category: "Phân Loại Ví"
  },
  { 
    term: "Software Wallet (Ví Phần Mềm)", 
    definition: "Ứng dụng ví trên máy tính (desktop), điện thoại (mobile) hoặc trình duyệt web (web wallet) để quản lý tài sản mã hoá. Có thể là ví nóng.",
    related: ["Hot Wallet"],
    category: "Phân Loại Ví"
  },
  { 
    term: "Paper Wallet (Ví Giấy)", 
    definition: "Một bản in chứa địa chỉ công khai và khóa riêng tư (thường dưới dạng mã QR) cho tài sản mã hoá. Đây là một dạng ví lạnh cơ bản.",
    related: ["Cold Wallet"],
    category: "Phân Loại Ví"
  },
  { 
    term: "Cryptography (Mật Mã Học)", 
    definition: "Ngành khoa học về mã hóa và giải mã thông tin để bảo vệ tính bí mật, toàn vẹn và xác thực. Là nền tảng của blockchain và ví tài sản mã hoá.",
    category: "Công Nghệ"
  },
  { 
    term: "Hashing (Băm)", 
    definition: "Quá trình chuyển đổi một lượng dữ liệu đầu vào bất kỳ thành một chuỗi ký tự có độ dài cố định (hash value) thông qua một thuật toán băm. Hàm băm là một chiều, nghĩa là không thể suy ngược lại dữ liệu gốc từ hash value.",
    related: ["SHA-256", "Keccak-256"],
    category: "Công Nghệ"
  },
  {
    term: "BIP-39",
    definition: "Bitcoin Improvement Proposal 39. Một tiêu chuẩn phổ biến để tạo ra Cụm Từ Khôi Phục (Mnemonic Phrase) từ entropy (nguồn ngẫu nhiên) và ngược lại, chuyển đổi cụm từ đó thành một 'hạt giống' (seed) để sinh ra các khóa trong ví HD.",
    related: ["Seed Phrase", "HD Wallet"],
    category: "Tiêu Chuẩn"
  },
  {
    term: "HD Wallet (Hierarchical Deterministic Wallet)",
    definition: "Ví Phân Cấp Xác Định. Loại ví có thể tạo ra một cây các cặp khóa (khóa riêng tư/công khai) từ một 'hạt giống' (seed) duy nhất (thường được tạo từ Cụm Từ Khôi Phục). Điều này cho phép người dùng chỉ cần sao lưu một seed duy nhất để khôi phục toàn bộ ví với nhiều địa chỉ tài sản mã hoá.",
    related: ["Seed Phrase", "BIP-39", "BIP-32", "BIP-44"],
    category: "Phân Loại Ví"
  },
  {
    term: "Faucet",
    definition: "Một trang web hoặc dịch vụ cung cấp một lượng nhỏ tài sản mã hoá thử nghiệm (testnet assets) miễn phí cho các nhà phát triển hoặc người dùng muốn thử nghiệm mạng lưới blockchain hoặc ứng dụng mà không cần sử dụng tài sản mã hoá thật.",
    category: "Mạng Lưới"
  },
  {
    term: "Entropy (Nguồn Ngẫu Nhiên)",
    definition: "Trong mật mã, entropy là thước đo tính ngẫu nhiên hoặc tính không thể đoán trước được của một nguồn dữ liệu. Nguồn ngẫu nhiên chất lượng cao rất quan trọng để tạo ra các khóa riêng tư an toàn.",
    related: ["Private Key", "Seed Phrase"],
    category: "Bảo Mật & Khóa"
  },
  {
    term: "CEX (Centralized Exchange)",
    definition: "Sàn Giao Dịch Tập Trung. Một nền tảng trực tuyến được điều hành bởi một công ty hoặc tổ chức, nơi người dùng có thể mua, bán và giao dịch tài sản mã hoá. Sàn CEX thường giữ tài sản của người dùng (custodial).",
    related: ["DEX", "Order Book", "KYC"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "DEX (Decentralized Exchange)",
    definition: "Sàn Giao Dịch Phi Tập Trung. Một nền tảng giao dịch tài sản mã hoá hoạt động dựa trên hợp đồng thông minh trên blockchain, cho phép người dùng giao dịch trực tiếp từ ví cá nhân của họ mà không cần trung gian (non-custodial).",
    related: ["CEX", "AMM", "Liquidity Pool", "Gas Fees"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "AMM (Automated Market Maker)",
    definition: "Cơ Chế Tạo Lập Thị Trường Tự Động. Một loại giao thức sàn giao dịch phi tập trung (DEX) dựa vào các thuật toán và pool thanh khoản để định giá tài sản mã hoá, thay vì sổ lệnh truyền thống.",
    related: ["DEX", "Liquidity Pool", "Impermanent Loss"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "Order Book (Sổ Lệnh)",
    definition: "Một danh sách điện tử các lệnh mua (bid) và lệnh bán (ask) cho một tài sản mã hoá cụ thể trên sàn giao dịch, được sắp xếp theo mức giá. Sổ lệnh thể hiện cung và cầu của thị trường.",
    related: ["CEX", "Limit Order", "Market Order"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "Limit Order (Lệnh Giới Hạn)",
    definition: "Một lệnh để mua hoặc bán tài sản mã hoá ở một mức giá cụ thể hoặc tốt hơn. Lệnh sẽ không được thực hiện cho đến khi giá thị trường đạt đến mức giá giới hạn.",
    related: ["Market Order", "Order Book"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "Market Order (Lệnh Thị Trường)",
    definition: "Một lệnh để mua hoặc bán tài sản mã hoá ngay lập tức với giá thị trường tốt nhất hiện có. Đảm bảo khớp lệnh nhanh chóng nhưng có thể bị trượt giá.",
    related: ["Limit Order", "Slippage"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "KYC (Know Your Customer)",
    definition: "Biết Khách Hàng Của Bạn. Quy trình mà các sàn giao dịch (đặc biệt là CEX) và các tổ chức tài chính sử dụng để xác minh danh tính của khách hàng nhằm tuân thủ các quy định chống rửa tiền (AML) và tài trợ khủng bố.",
    related: ["CEX", "AML"],
    category: "Quy Định & Bảo Mật"
  },
  {
    term: "Impermanent Loss (Tổn Thất Tạm Thời)",
    definition: "Một rủi ro tiềm ẩn khi cung cấp thanh khoản cho các pool trong AMM trên DEX. Xảy ra khi giá của các tài sản mã hoá trong pool thay đổi so với khi bạn nạp chúng vào, khiến giá trị rút ra có thể thấp hơn so với việc chỉ giữ tài sản đó trong ví.",
    related: ["AMM", "DEX", "Liquidity Pool"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "Liquidity Pool (Pool Thanh Khoản)",
    definition: "Một tập hợp các tài sản mã hoá được khóa trong một hợp đồng thông minh, cung cấp thanh khoản cho các giao dịch trên DEX sử dụng cơ chế AMM. Người cung cấp thanh khoản (LPs) nhận được phí giao dịch như một phần thưởng.",
    related: ["AMM", "DEX", "Impermanent Loss"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "Trading Pair (Cặp Giao Dịch)",
    definition: "Hai loại tài sản mã hoá khác nhau được ghép nối để giao dịch. Ví dụ: BTC/USDT, ETH/BTC. Tài sản đầu tiên là cơ sở (base), tài sản thứ hai là định giá (quote).",
    category: "Sàn Giao Dịch"
  },
  {
    term: "Arbitrage (Kinh Doanh Chênh Lệch Giá)",
    definition: "Việc mua một tài sản mã hoá trên một sàn giao dịch với giá thấp và bán nó gần như ngay lập tức trên một sàn khác với giá cao hơn để kiếm lợi nhuận từ sự khác biệt giá.",
    category: "Sàn Giao Dịch"
  },
  {
    term: "Slippage (Trượt Giá)",
    definition: "Sự khác biệt giữa giá dự kiến của một giao dịch và giá thực tế mà giao dịch đó được thực hiện. Thường xảy ra trong các thị trường biến động mạnh hoặc có thanh khoản thấp.",
    related: ["Market Order"],
    category: "Sàn Giao Dịch"
  },
  {
    term: "Gas Fees (Phí Gas)",
    definition: "Phí giao dịch trên một số mạng blockchain (như Ethereum) mà người dùng phải trả để thực hiện các hoạt động như gửi tài sản mã hoá hoặc tương tác với hợp đồng thông minh. Phí này thường được trả cho các thợ đào hoặc người xác thực.",
    related: ["Transaction", "DEX", "Smart Contract"],
    category: "Công Nghệ"
  }
];

// Sort terms alphabetically for easier lookup
terms.sort((a, b) => a.term.localeCompare(b.term));

const categories = Array.from(new Set(terms.map(t => t.category))).sort();


const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? term.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in-down">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-3 flex items-center justify-center">
          <BookOpenIcon className="w-8 h-8 md:w-10 md:h-10 mr-3"/> Thuật Ngữ Blockchain & Tài Sản Mã Hoá
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Tra cứu và tìm hiểu các thuật ngữ quan trọng thường gặp trong không gian blockchain và tài sản mã hoá để nâng cao hiểu biết của bạn.
        </p>
      </section>

      <div className="sticky top-[70px] md:top-[80px] z-30 bg-slate-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg ring-1 ring-slate-700 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input 
              type="text"
              placeholder="Tìm kiếm thuật ngữ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      
      {filteredTerms.length > 0 ? (
        <div className="space-y-6">
          {filteredTerms.map((item, index) => (
            <div key={index} id={item.term.toLowerCase().replace(/\s+/g, '-')} className="bg-slate-700/70 p-5 rounded-lg shadow-lg ring-1 ring-slate-600/50 scroll-mt-24">
              <h3 className="text-xl font-semibold text-sky-400 mb-1">{item.term}</h3>
              <p className="text-sm text-slate-500 mb-2">Danh mục: {item.category}</p>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{item.definition}</p>
              {item.related && item.related.length > 0 && (
                <p className="text-xs text-slate-400 mt-3">
                  <span className="font-semibold">Liên quan:</span> {item.related.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
         <p className="text-slate-400 text-center py-8">Không tìm thấy thuật ngữ nào phù hợp.</p>
      )}
    </div>
  );
};

export default GlossaryView;