import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { ProjectTestData, NotificationType, SourceAttribution, ProjectStage } from '../types';
import { MagnifyingGlassIcon as PageIcon, WarningIcon, ArrowPathIcon as RefreshIcon, LinkIcon, CogIcon, TrashIcon, ArrowPathIcon } from '../components/Icons';

interface ProjectTestAutomationViewProps {
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const LOCAL_STORAGE_USER_GEMINI_API_KEY_PROJECT_TEST = 'abaii_user_gemini_api_key_project_test';

const ProjectTestAutomationView: React.FC<ProjectTestAutomationViewProps> = ({ addNotification }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectStage, setProjectStage] = useState<ProjectStage>(ProjectStage.NEW_LAUNCH);
  
  const [testResult, setTestResult] = useState<ProjectTestData | null>(null);
  const [isLoadingSystemApi, setIsLoadingSystemApi] = useState<boolean>(false);
  const [isLoadingUserApi, setIsLoadingUserApi] = useState<boolean>(false);
  const [systemApiError, setSystemApiError] = useState<string | null>(null);
  const [userApiError, setUserApiError] = useState<string | null>(null);
  
  const [systemAiClient, setSystemAiClient] = useState<GoogleGenAI | null>(null);
  const [userAiClient, setUserAiClient] = useState<GoogleGenAI | null>(null);

  const [isSystemApiRateLimited, setIsSystemApiRateLimited] = useState(false);
  const [isUserApiRateLimited, setIsUserApiRateLimited] = useState(false);
  
  const [systemInitializationMessage, setSystemInitializationMessage] = useState<string>('');
  const [userApiKeyInput, setUserApiKeyInput] = useState<string>('');
  const [userApiKeyStored, setUserApiKeyStored] = useState<string | null>(null);
  const [userApiStatusMessage, setUserApiStatusMessage] = useState<string>('');
  const [showUserApiKeySection, setShowUserApiKeySection] = useState<boolean>(false);
  const [lastApiUsed, setLastApiUsed] = useState<'system' | 'user' | null>(null);


  const initializeSystemAiClient = useCallback(() => {
    const envApiKey = process.env.API_KEY;
    if (envApiKey && envApiKey.trim() !== '') {
      try {
        const client = new GoogleGenAI({ apiKey: envApiKey });
        setSystemAiClient(client);
        setSystemApiError(null);
        setSystemInitializationMessage('API hệ thống sẵn sàng phân tích dự án.');
        return client;
      } catch (err: any) {
        console.error("Failed to initialize System GoogleGenAI for Project Test:", err);
        setSystemAiClient(null);
        const errorMessage = `Lỗi khởi tạo API hệ thống: ${err.message}.`;
        setSystemApiError(errorMessage);
        setSystemInitializationMessage(errorMessage);
        addNotification(errorMessage, "error");
        return null;
      }
    } else {
      setSystemAiClient(null);
      const errorMessage = "API Key hệ thống (process.env.API_KEY) chưa được cấu hình.";
      setSystemApiError(errorMessage);
      setSystemInitializationMessage(errorMessage);
      addNotification(errorMessage, "error", 7000);
      return null;
    }
  }, [addNotification]);

  const initializeUserAiClient = useCallback((apiKey: string): GoogleGenAI | null => {
    if (apiKey && apiKey.trim() !== '') {
      try {
        const client = new GoogleGenAI({ apiKey });
        setUserAiClient(client);
        setUserApiError(null);
        setUserApiStatusMessage('API Key của bạn hợp lệ và đã sẵn sàng.');
        addNotification('API Key của bạn đã được xác thực thành công!', 'success');
        return client;
      } catch (err: any) {
        console.error("Failed to initialize User GoogleGenAI for Project Test:", err);
        setUserAiClient(null);
        const errorMessage = `Lỗi khởi tạo API Key của bạn: ${err.message}. Key có thể không hợp lệ.`;
        setUserApiError(errorMessage);
        setUserApiStatusMessage(errorMessage);
        addNotification(errorMessage, "error");
        return null;
      }
    }
    setUserApiStatusMessage('Vui lòng nhập API Key của bạn.');
    return null;
  }, [addNotification]);
  
  useEffect(() => {
    initializeSystemAiClient();
    const storedUserKey = localStorage.getItem(LOCAL_STORAGE_USER_GEMINI_API_KEY_PROJECT_TEST);
    if (storedUserKey) {
      setUserApiKeyStored(storedUserKey);
      setUserApiKeyInput(storedUserKey);
      initializeUserAiClient(storedUserKey);
    } else {
      setUserApiStatusMessage('Bạn có thể nhập API Key Gemini cá nhân để sử dụng.');
    }
  }, [initializeSystemAiClient, initializeUserAiClient]);

  const handleUserApiKeySave = () => {
    if (userApiKeyInput.trim()) {
      localStorage.setItem(LOCAL_STORAGE_USER_GEMINI_API_KEY_PROJECT_TEST, userApiKeyInput);
      setUserApiKeyStored(userApiKeyInput);
      initializeUserAiClient(userApiKeyInput);
    } else {
      addNotification('Vui lòng nhập API Key.', 'error');
      setUserApiStatusMessage('API Key không được để trống.');
    }
  };

  const handleUserApiKeyClear = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_GEMINI_API_KEY_PROJECT_TEST);
    setUserApiKeyStored(null);
    setUserApiKeyInput('');
    setUserAiClient(null);
    setTestResult(null); // Clear results if user key is removed
    setUserApiStatusMessage('API Key của bạn đã được xóa. Bạn có thể nhập key mới.');
    addNotification('Đã xóa API Key cá nhân.', 'info');
  };
  
  const extractSourceAttributions = (groundingChunks?: GroundingChunk[]): SourceAttribution[] | undefined => {
    if (!groundingChunks || groundingChunks.length === 0) return undefined;
    return groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
      .map(chunk => ({ uri: chunk.web!.uri!, title: chunk.web!.title! }));
  };

  const getPromptForStage = (pName: string, stage: ProjectStage): string => {
    let criteriaDescription = "";
    let stageName = "";
    switch (stage) {
      case ProjectStage.NEW_LAUNCH:
        stageName = "Token/Dự án mới phát hành";
        criteriaDescription = `
        **T – Token:** Kiểm tra địa chỉ Smart Contract, nằm trên blockchain nào? Thông tin về thanh khoản ban đầu, Marketcap ước tính (nếu có), Volume giao dịch ban đầu (nếu có).
        **E – Exchange:** Token được giao dịch trên sàn nào? (ví dụ: OTC, DEX cụ thể như Uniswap, PancakeSwap, hay dự kiến niêm yết CEX nào không?).
        **S – Security:** Token có được audit bởi đơn vị nào không? Kết quả audit (nếu có)? Kiểm tra nhanh bằng các công cụ quét lỗ hổng cơ bản (ví dụ: trên các trang check contract) có phát hiện vấn đề gì không?
        **T – Team:** Đội ngũ đứng sau là ai (tên, vai trò, kinh nghiệm nếu có)? Có phải team ẩn danh hay không? Thông tin liên hệ, trang cá nhân (LinkedIn, Twitter/X) của các thành viên chủ chốt (nếu công khai).
        **S – Social:** Các trang mạng xã hội chính thức của dự án (Twitter/X, Telegram, Discord, Facebook, Medium, etc.)? Mức độ tương tác (số lượng theo dõi, bình luận, chia sẻ) có tốt không? Có KOLs (người có ảnh hưởng) nào hỗ trợ hoặc nói về dự án không? Website chính thức của dự án.`;
        break;
      case ProjectStage.ACTIVE:
        stageName = "Token/Dự án đã hoạt động một thời gian";
        criteriaDescription = `
        **T – Team:** Đội ngũ đứng sau dự án là ai? Có sự thay đổi nào trong đội ngũ không? Có quỹ đầu tư nào nổi tiếng hỗ trợ không? Tiến độ dự án so với roadmap đã công bố như thế nào?
        **E – Exchange:** Token được giao dịch trên những sàn nào (OTC, DEX, CEX)? Khối lượng giao dịch hàng ngày trên các sàn đó? Tính thanh khoản hiện tại của token.
        **S – Service:** Token/Dự án cung cấp dịch vụ/sản phẩm gì cốt lõi? Sản phẩm/dịch vụ đó có được sử dụng thực tế không, có bao nhiêu người dùng (nếu có số liệu)? Khách hàng mục tiêu của dự án là ai?
        **T – Tokenomics:** Cách dự án phân phối token như thế nào (tỷ lệ cho team, marketing, cộng đồng, staking, etc.)? Lịch trình vesting của team và các nhà đầu tư lớn? Cơ chế lạm phát/giảm phát của token (nếu có)? Tiện ích thực tế của token trong hệ sinh thái dự án (dùng để làm gì)? Cách dự án kiếm tiền/tạo doanh thu (nếu có).
        **S – Social:** Các trang mạng xã hội của dự án có hoạt động tích cực không? Chất lượng tương tác từ cộng đồng? Tin tức và các cập nhật quan trọng gần đây của dự án. Website và các kênh truyền thông chính thức. Có KOLs nào tiếp tục hỗ trợ dự án không?`;
        break;
      case ProjectStage.PRE_LAUNCH:
        stageName = "Token/Dự án chưa phát hành token";
        criteriaDescription = `
        **T – Technical Paper (Sách Trắng/Whitepaper):** Dự án giải quyết vấn đề gì? Phân tích ý tưởng cốt lõi và công nghệ đề xuất. Kế hoạch phân phối token (tokenomics dự kiến) như thế nào? Lộ trình phát triển (roadmap) dự kiến.
        **E – Early Backers/Investors:** Dự án được ai đầu tư ở các vòng sớm (nếu có thông tin)? Là các quỹ đầu tư mạo hiểm nổi tiếng, nhà đầu tư cá nhân, hay gọi vốn cộng đồng?
        **S – Security:** Kế hoạch bảo mật của dự án như thế nào? Có kế hoạch audit hợp đồng thông minh trước khi ra mắt không, bởi đơn vị nào? Các biện pháp an ninh dự kiến để bảo vệ dự án và người dùng.
        **T – Team:** Đội ngũ sáng lập dự án là ai? Kinh nghiệm của họ trong lĩnh vực blockchain hoặc các lĩnh vực liên quan? Có phải team ẩn danh không? Thông tin về cố vấn dự án (nếu có).
        **S – Social:** Chiến lược xây dựng cộng đồng ban đầu của dự án? Các kênh thông tin chính thức đã công bố (website, Twitter/X, Telegram, etc.)? Mức độ tương tác ban đầu và sự quan tâm từ cộng đồng tiềm năng. Có KOLs nào nói về dự án ở giai đoạn này không?`;
        break;
    }
    return `Phân tích dự án blockchain có tên hoặc định danh là "${pName}" (đang ở giai đoạn: ${stageName}) dựa trên quy trình T.E.S.T.S sau:
${criteriaDescription}

Hướng dẫn phân tích:
1.  Đối với mỗi mục (T, E, S, T, S), hãy tìm kiếm thông tin chi tiết và cụ thể.
2.  Ưu tiên thông tin từ các nguồn chính thức của dự án (website, whitepaper, kênh social đã xác minh), các trang tin tức blockchain uy tín, các nền tảng phân tích dữ liệu on-chain (ví dụ: Etherscan, BscScan, CoinMarketCap, CoinGecko), và các báo cáo audit (nếu có).
3.  Cung cấp phân tích khách quan và dựa trên thông tin có thể kiểm chứng.
4.  Trả về kết quả dưới dạng văn bản có cấu trúc rõ ràng, sử dụng Markdown cho tiêu đề của mỗi mục T.E.S.T.S (ví dụ: '## T – Token', '### Địa chỉ Smart Contract:', '### Thanh khoản:').
5.  Cuối mỗi tiểu mục, nếu có thông tin không tìm thấy hoặc không rõ ràng, hãy ghi chú lại (ví dụ: "Thông tin về Marketcap chưa được công bố công khai.").
6.  Nếu không tìm thấy thông tin đáng tin cậy về dự án, hãy thông báo rõ ràng.
7.  Sử dụng Google Search để tìm thông tin cập nhật và công khai.
8.  Giữ ngôn ngữ chuyên nghiệp và tập trung vào việc cung cấp thông tin hữu ích cho mục đích đánh giá/học tập.`;
  };


  const fetchProjectTestDataInternal = useCallback(async (client: GoogleGenAI | null, clientType: 'system' | 'user') => {
    if (!projectName.trim()) {
        addNotification("Vui lòng nhập tên hoặc định danh dự án.", "error");
        return;
    }
    if (!client) {
      const errorMsg = clientType === 'system' 
        ? "API hệ thống chưa sẵn sàng. Kiểm tra process.env.API_KEY."
        : "API Key của bạn chưa sẵn sàng hoặc không hợp lệ.";
      if (clientType === 'system') setSystemApiError(errorMsg); else setUserApiError(errorMsg);
      addNotification(errorMsg, "error");
      if (clientType === 'system') setIsLoadingSystemApi(false); else setIsLoadingUserApi(false);
      return;
    }

    if (clientType === 'system') setIsLoadingSystemApi(true); else setIsLoadingUserApi(true);
    if (clientType === 'system') setSystemApiError(null); else setUserApiError(null);
    if (clientType === 'system') setSystemInitializationMessage(`Đang phân tích dự án (API hệ thống)...`); 
    else setUserApiStatusMessage(`Đang phân tích dự án (API của bạn)...`);
    setLastApiUsed(clientType);

    const promptText = getPromptForStage(projectName, projectStage);

    try {
      const response: GenerateContentResponse = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        config: { tools: [{googleSearch: {}}] }
      });
      
      const analysisText = response.text;
      const attributions = extractSourceAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
      
      setTestResult({ analysis: analysisText, sourceAttributions: attributions });
      
      if (analysisText) {
        addNotification(`Đã hoàn thành phân tích dự án (API ${clientType === 'system' ? 'hệ thống' : 'của bạn'})!`, "success", 2000);
        if (clientType === 'system') setSystemInitializationMessage('Phân tích dự án hoàn tất (API hệ thống).');
        else setUserApiStatusMessage('Phân tích dự án hoàn tất (API của bạn).');
      } else {
        addNotification("Không nhận được kết quả phân tích.", "info", 2000);
         if (clientType === 'system') setSystemInitializationMessage('Không có kết quả phân tích (API hệ thống).');
        else setUserApiStatusMessage('Không có kết quả phân tích (API của bạn).');
      }
      if (clientType === 'system') setSystemApiError(null); else setUserApiError(null);

    } catch (e: any) {
      console.error(`Error fetching project test data (API ${clientType}):`, e);
      let displayError: string;
      if (e.message && (e.message.includes("quota") || e.message.includes("RESOURCE_EXHAUSTED") || (e.error && e.error.status === "RESOURCE_EXHAUSTED"))) {
          displayError = `Lỗi: Đã vượt quá giới hạn yêu cầu API Key ${clientType === 'system' ? 'hệ thống' : 'của bạn'}. Thử lại sau 1 phút.`;
          if (clientType === 'system') setIsSystemApiRateLimited(true); else setIsUserApiRateLimited(true);
          setTimeout(() => {
            if (clientType === 'system') setIsSystemApiRateLimited(false); else setIsUserApiRateLimited(false);
          }, 60000);
      } else if (e.message && (e.message.toLowerCase().includes("api key not valid") || e.message.toLowerCase().includes("invalid api key"))) {
          displayError = `Lỗi: API Key ${clientType === 'system' ? 'hệ thống' : 'của bạn'} không hợp lệ.`;
      } else {
          displayError = `Lỗi khi phân tích dự án (API ${clientType}): ${e.message || 'Unknown error'}.`;
      }
      setTestResult(null); // Clear previous results on error
      if (clientType === 'system') { setSystemApiError(displayError); setSystemInitializationMessage(displayError); }
      else { setUserApiError(displayError); setUserApiStatusMessage(displayError); }
      addNotification(displayError, "error", 5000);
    } finally {
      if (clientType === 'system') setIsLoadingSystemApi(false); else setIsLoadingUserApi(false);
    }
  }, [addNotification, projectName, projectStage]);
  
  const stageOptions = [
    { value: ProjectStage.NEW_LAUNCH, label: "Mới phát hành (T.E.S.T.S 1)" },
    { value: ProjectStage.ACTIVE, label: "Đã hoạt động (T.E.S.T.S 2)" },
    { value: ProjectStage.PRE_LAUNCH, label: "Chưa phát hành (T.E.S.T.S 3)" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-down">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-3 flex items-center justify-center">
          <PageIcon className="w-8 h-8 md:w-10 md:h-10 mr-3" />
          Kiểm Tra Dự Án Blockchain (T.E.S.T.S)
        </h1>
        <p className="text-slate-300 max-w-3xl mx-auto">
          Nhập thông tin dự án và chọn giai đoạn để AI phân tích theo quy trình T.E.S.T.S chi tiết.
        </p>
      </section>

      <section className="p-4 md:p-6 bg-slate-800/40 rounded-xl shadow-xl ring-1 ring-slate-700/50 space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-1">
            Tên dự án, website, hoặc địa chỉ contract:
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ví dụ: MyCoolToken, https://mycooltoken.com, 0x123..."
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Giai đoạn dự án:</label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {stageOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 p-2 bg-slate-700/50 rounded-md hover:bg-slate-600/50 cursor-pointer">
                <input
                  type="radio"
                  name="projectStage"
                  value={option.value}
                  checked={projectStage === option.value}
                  onChange={(e) => setProjectStage(e.target.value as ProjectStage)}
                  className="form-radio h-4 w-4 text-sky-500 bg-slate-600 border-slate-500 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-200">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
                onClick={() => fetchProjectTestDataInternal(systemAiClient, 'system')}
                disabled={isLoadingSystemApi || isSystemApiRateLimited || !systemAiClient || !projectName.trim()}
                className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-sky-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <RefreshIcon className={`w-5 h-5 mr-2 ${isLoadingSystemApi ? 'animate-spin' : ''}`} />
                Test bằng API Hệ Thống
            </button>
            <button
              onClick={() => setShowUserApiKeySection(!showUserApiKeySection)}
              className="text-sm py-2 px-3 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg sm:w-auto justify-center"
            >
              <CogIcon className="w-5 h-5 inline mr-1.5"/>
              {showUserApiKeySection ? "Ẩn tùy chọn API Key" : "Dùng API Key cá nhân"}
            </button>
        </div>
        {systemInitializationMessage && !showUserApiKeySection && (
            <p className={`text-xs px-2 py-1 mt-2 rounded-md text-center ${systemApiError ? 'text-yellow-300 bg-yellow-700/30 ring-1 ring-yellow-600/50' : 'text-sky-300 bg-sky-700/30 ring-1 ring-sky-600/50'}`}>
                {systemInitializationMessage}
            </p>
        )}
      </section>
      
      {showUserApiKeySection && (
        <section className="p-4 md:p-6 bg-slate-700/50 rounded-xl shadow-xl ring-1 ring-slate-600 space-y-3">
          <h4 className="text-md font-semibold text-sky-300">Sử dụng API Key Gemini của bạn:</h4>
          <input 
            type="password" 
            value={userApiKeyInput}
            onChange={(e) => setUserApiKeyInput(e.target.value)}
            placeholder="Nhập API Key Gemini của bạn tại đây"
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 placeholder-slate-500"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleUserApiKeySave}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-1.5 px-3 rounded-md shadow-sm text-sm"
            >
              Lưu & Xác thực Key
            </button>
            {userApiKeyStored && (
              <button
                onClick={handleUserApiKeyClear}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-1.5 px-3 rounded-md shadow-sm text-sm"
              >
                <TrashIcon className="w-4 h-4 inline mr-1" /> Xóa Key đã lưu
              </button>
            )}
          </div>
          {userApiStatusMessage && (
            <p className={`text-xs px-2 py-1 rounded-md text-center ${userApiError ? 'text-yellow-300 bg-yellow-700/30 ring-1 ring-yellow-600/50' : 'text-green-300 bg-green-700/30 ring-1 ring-green-600/50'}`}>
              {userApiStatusMessage}
            </p>
          )}
           <button
                onClick={() => fetchProjectTestDataInternal(userAiClient, 'user')}
                disabled={isLoadingUserApi || isUserApiRateLimited || !userAiClient || !userApiKeyStored || !projectName.trim()}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-teal-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
                <RefreshIcon className={`w-5 h-5 mr-2 ${isLoadingUserApi ? 'animate-spin' : ''}`} />
                Test bằng API Key Của Bạn
            </button>
            <p className="text-[10px] text-slate-500 mt-1">
                Lưu ý: API Key của bạn chỉ được lưu trong Local Storage của trình duyệt này và không được gửi đi đâu khác ngoài Google Gemini.
            </p>
        </section>
      )}

      {(isLoadingSystemApi || isLoadingUserApi) && (
        <div className="text-center py-8">
          <ArrowPathIcon className="w-10 h-10 text-sky-500 animate-spin mx-auto" />
          <p className="text-slate-400 mt-2">Đang phân tích dự án, vui lòng chờ...</p>
        </div>
      )}

      {testResult && !(isLoadingSystemApi || isLoadingUserApi) && (
        <section className="p-4 md:p-6 bg-slate-800/40 rounded-xl shadow-xl ring-1 ring-slate-700/50 space-y-4">
          <h3 className="text-xl font-semibold text-sky-300">
            Kết quả Phân Tích Dự Án (API {lastApiUsed === 'system' ? 'Hệ Thống' : 'Của Bạn'})
          </h3>
          <div 
            className="prose prose-sm prose-invert max-w-none text-slate-200 whitespace-pre-wrap bg-slate-700/30 p-4 rounded-md custom-scrollbar overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: testResult.analysis.replace(/## (.*?)\n/g, '<h2 class="text-lg font-semibold text-sky-400 mt-3 mb-1">$1</h2>').replace(/### (.*?)\n/g, '<h3 class="text-md font-medium text-yellow-400 mt-2 mb-0.5">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-400">$1</strong>') }}
          />
          {testResult.sourceAttributions && testResult.sourceAttributions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-600/50">
              <h4 className="text-sm font-semibold text-slate-400 mb-1.5">Nguồn tham khảo (Google Search):</h4>
              <ul className="list-disc list-inside ml-2 space-y-1">
                {testResult.sourceAttributions.map((attr, idx) => (
                  <li key={idx} className="text-xs">
                    <a href={attr.uri} target="_blank" rel="noopener noreferrer" title={attr.title} className="text-cyan-400 hover:text-cyan-200 hover:underline truncate block">
                       <LinkIcon className="w-3.5 h-3.5 inline mr-1.5 align-middle"/> {attr.title || attr.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
      {((lastApiUsed === 'system' && systemApiError) || (lastApiUsed === 'user' && userApiError)) && !(isLoadingSystemApi || isLoadingUserApi) && !testResult &&(
        <div className="bg-red-700/30 border border-red-500 text-red-300 p-4 rounded-md shadow-md text-sm" role="alert">
          <div className="flex items-center">
            <WarningIcon className="h-5 w-5 text-red-400 mr-2" />
            <p>{lastApiUsed === 'system' ? systemApiError : userApiError}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectTestAutomationView;