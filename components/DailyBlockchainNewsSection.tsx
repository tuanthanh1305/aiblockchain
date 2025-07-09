import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { BlockchainNewsItem, NotificationType, SourceAttribution } from '../types';
import { NewspaperIcon, ExternalLinkIcon, WarningIcon, ArrowPathIcon as RefreshIcon, LinkIcon, CogIcon, TrashIcon } from '../components/Icons';

interface DailyBlockchainNewsSectionProps {
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const LOCAL_STORAGE_USER_GEMINI_API_KEY_NEWS = 'abaii_user_gemini_api_key_news';

const DailyBlockchainNewsSection: React.FC<DailyBlockchainNewsSectionProps> = ({ addNotification }) => {
  const [newsItems, setNewsItems] = useState<BlockchainNewsItem[]>([]);
  const [isLoadingSystemApi, setIsLoadingSystemApi] = useState<boolean>(false);
  const [isLoadingUserApi, setIsLoadingUserApi] = useState<boolean>(false);
  const [systemApiError, setSystemApiError] = useState<string | null>(null);
  const [userApiError, setUserApiError] = useState<string | null>(null);
  
  const [systemAiClient, setSystemAiClient] = useState<GoogleGenAI | null>(null);
  const [userAiClient, setUserAiClient] = useState<GoogleGenAI | null>(null);

  const [isSystemApiRateLimited, setIsSystemApiRateLimited] = useState(false);
  const [isUserApiRateLimited, setIsUserApiRateLimited] = useState(false);
  
  const [hasFetchedOnceSystem, setHasFetchedOnceSystem] = useState(false);
  const [hasFetchedOnceUser, setHasFetchedOnceUser] = useState(false);

  const [systemInitializationMessage, setSystemInitializationMessage] = useState<string>('');
  const [userApiKeyInput, setUserApiKeyInput] = useState<string>('');
  const [userApiKeyStored, setUserApiKeyStored] = useState<string | null>(null);
  const [userApiStatusMessage, setUserApiStatusMessage] = useState<string>('');
  const [showUserApiKeySection, setShowUserApiKeySection] = useState<boolean>(false);


  const initializeSystemAiClient = useCallback(() => {
    const envApiKey = process.env.API_KEY;
    if (envApiKey && envApiKey.trim() !== '') {
      try {
        const client = new GoogleGenAI({ apiKey: envApiKey });
        setSystemAiClient(client);
        setSystemApiError(null);
        setSystemInitializationMessage('API hệ thống sẵn sàng tải tin tức.');
        return client;
      } catch (err: any) {
        console.error("Failed to initialize System GoogleGenAI for News:", err);
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
        console.error("Failed to initialize User GoogleGenAI for News:", err);
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
    const storedUserKey = localStorage.getItem(LOCAL_STORAGE_USER_GEMINI_API_KEY_NEWS);
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
      localStorage.setItem(LOCAL_STORAGE_USER_GEMINI_API_KEY_NEWS, userApiKeyInput);
      setUserApiKeyStored(userApiKeyInput);
      initializeUserAiClient(userApiKeyInput);
    } else {
      addNotification('Vui lòng nhập API Key.', 'error');
      setUserApiStatusMessage('API Key không được để trống.');
    }
  };

  const handleUserApiKeyClear = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_GEMINI_API_KEY_NEWS);
    setUserApiKeyStored(null);
    setUserApiKeyInput('');
    setUserAiClient(null);
    setUserApiStatusMessage('API Key của bạn đã được xóa. Bạn có thể nhập key mới.');
    addNotification('Đã xóa API Key cá nhân.', 'info');
  };
  
  const extractSourceAttributions = (groundingChunks?: GroundingChunk[]): SourceAttribution[] | undefined => {
    if (!groundingChunks || groundingChunks.length === 0) return undefined;
    return groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
      .map(chunk => ({ uri: chunk.web!.uri!, title: chunk.web!.title! }));
  };

  const fetchNewsInternal = useCallback(async (client: GoogleGenAI | null, clientType: 'system' | 'user') => {
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
    if (clientType === 'system') setSystemInitializationMessage('Đang tải tin tức (API hệ thống)...'); 
    else setUserApiStatusMessage('Đang tải tin tức (API của bạn)...');

    const promptText = `Cung cấp 7-10 tin tức mới nhất và nổi bật nhất về công nghệ blockchain và thị trường tài sản mã hoá bằng tiếng Việt, bao gồm các tin trong ngày hôm nay và những tin quan trọng trong tuần này.
Tuyệt đối ưu tiên thông tin từ các nguồn báo chí uy tín, các trang tin tức công nghệ lớn, hoặc các thông báo chính thức từ các dự án/công ty blockchain đã được xác minh và có thể truy cập công khai.
Mỗi tin tức cần bao gồm: tiêu đề (tieuDe), một đoạn tóm tắt ngắn (tomTat), và thời gian xuất bản tin (thoiGian, ví dụ: 'HH:mm DD/MM/YYYY' hoặc 'YYYY-MM-DD HH:mm').
Nếu có URL đến nguồn tin gốc, hãy bao gồm nó trong trường urlNguon.
Định dạng câu trả lời của bạn dưới dạng một mảng JSON của các đối tượng tin tức. Ví dụ: [{"tieuDe": "...", "tomTat": "...", "urlNguon": "...", "thoiGian": "10:30 28/07/2024"}, ...]`;

    let jsonStringToParse = '';
    try {
      const response: GenerateContentResponse = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        config: { tools: [{googleSearch: {}}] }
      });
      
      let rawResponseText = response.text.trim();
      const fenceRegex = /```(?:json)?\s*\n?(.*?)\n?\s*```/s;
      const match = rawResponseText.match(fenceRegex);
      jsonStringToParse = match && match[1] ? match[1].trim() : rawResponseText;
      
      const parsedData = JSON.parse(jsonStringToParse);
      if (!Array.isArray(parsedData)) throw new Error("Dữ liệu tin tức AI trả về không phải mảng JSON.");
      
      const attributions = extractSourceAttributions(response.candidates?.[0]?.groundingMetadata?.groundingChunks);
      setNewsItems(parsedData.map((item: Omit<BlockchainNewsItem, 'id'|'sourceAttributions'>) => ({ ...item, id: crypto.randomUUID(), sourceAttributions: attributions })));
      
      if (clientType === 'system') setHasFetchedOnceSystem(true); else setHasFetchedOnceUser(true);

      if (parsedData.length > 0) {
        addNotification(`Đã tải tin tức mới nhất (API ${clientType === 'system' ? 'hệ thống' : 'của bạn'})!`, "success", 2000);
        if (clientType === 'system') setSystemInitializationMessage('Tin tức đã được cập nhật (API hệ thống).');
        else setUserApiStatusMessage('Tin tức đã được cập nhật (API của bạn).');
      } else {
        addNotification("Không có tin tức mới nào được tìm thấy.", "info", 2000);
        if (clientType === 'system') setSystemInitializationMessage('Không có tin tức mới (API hệ thống).');
        else setUserApiStatusMessage('Không có tin tức mới (API của bạn).');
      }
      if (clientType === 'system') setSystemApiError(null); else setUserApiError(null);

    } catch (e: any) {
      console.error(`Error fetching or parsing tin tức (API ${clientType}):`, e);
      let displayError: string;
      if (e.message && (e.message.includes("quota") || e.message.includes("RESOURCE_EXHAUSTED") || (e.error && e.error.status === "RESOURCE_EXHAUSTED"))) {
          displayError = `Lỗi: Đã vượt quá giới hạn yêu cầu API Key ${clientType === 'system' ? 'hệ thống' : 'của bạn'}. Thử lại sau 1 phút.`;
          if (clientType === 'system') setIsSystemApiRateLimited(true); else setIsUserApiRateLimited(true);
          setTimeout(() => {
            if (clientType === 'system') setIsSystemApiRateLimited(false); else setIsUserApiRateLimited(false);
          }, 60000);
      } else if (e.message && (e.message.toLowerCase().includes("api key not valid") || e.message.toLowerCase().includes("invalid api key"))) {
          displayError = `Lỗi: API Key ${clientType === 'system' ? 'hệ thống' : 'của bạn'} không hợp lệ.`;
      } else if (e instanceof SyntaxError) {
          if (jsonStringToParse) console.error(`Problematic JSON string for tin tức (API ${clientType}, SyntaxError):`, jsonStringToParse);
          displayError = `Lỗi xử lý dữ liệu tin tức từ AI (JSON không hợp lệ, API ${clientType}).`;
      } else {
          displayError = `Lỗi tải dữ liệu tin tức từ AI (API ${clientType}): ${e.message || 'Unknown error'}.`;
      }
      if (clientType === 'system') { setSystemApiError(displayError); setSystemInitializationMessage(displayError); }
      else { setUserApiError(displayError); setUserApiStatusMessage(displayError); }
      addNotification(displayError, "error", 5000);
    } finally {
      if (clientType === 'system') setIsLoadingSystemApi(false); else setIsLoadingUserApi(false);
    }
  }, [addNotification]);

  const getButtonTextSystem = () => {
    if (isLoadingSystemApi) return "Đang tải...";
    if (isSystemApiRateLimited) return "Thử lại sau...";
    return hasFetchedOnceSystem ? "Làm Mới Tin Tức (Hệ Thống)" : "Tải Tin Tức (Hệ Thống)";
  };
  
  const getButtonTextUser = () => {
    if (isLoadingUserApi) return "Đang tải...";
    if (isUserApiRateLimited) return "Thử lại sau...";
    return hasFetchedOnceUser ? "Làm Mới Tin Tức (Key Của Bạn)" : "Tải Bằng Key Của Bạn";
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-sky-400 flex items-center mb-3 sm:mb-0">
          <NewspaperIcon className="w-8 h-8 mr-3" />
          Tin Tức Blockchain Hàng Ngày
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
            <button
                onClick={() => fetchNewsInternal(systemAiClient, 'system')}
                disabled={isLoadingSystemApi || isSystemApiRateLimited || !systemAiClient}
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-sky-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center w-full sm:w-auto justify-center"
            >
                <RefreshIcon className={`w-4 h-4 mr-2 ${isLoadingSystemApi ? 'animate-spin' : ''}`} />
                {getButtonTextSystem()}
            </button>
            <button
              onClick={() => setShowUserApiKeySection(!showUserApiKeySection)}
              className="text-xs py-1 px-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md w-full sm:w-auto justify-center"
            >
              {showUserApiKeySection ? "Ẩn tùy chọn API Key cá nhân" : "Dùng API Key cá nhân?"}
            </button>
        </div>
      </div>
        
      {showUserApiKeySection && (
        <div className="p-4 bg-slate-700/50 rounded-lg space-y-3 ring-1 ring-slate-600">
          <h4 className="text-sm font-semibold text-sky-300">Sử dụng API Key Gemini của bạn:</h4>
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
                onClick={() => fetchNewsInternal(userAiClient, 'user')}
                disabled={isLoadingUserApi || isUserApiRateLimited || !userAiClient || !userApiKeyStored}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-teal-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
                <RefreshIcon className={`w-4 h-4 mr-2 ${isLoadingUserApi ? 'animate-spin' : ''}`} />
                {getButtonTextUser()}
            </button>
            <p className="text-[10px] text-slate-500 mt-1">
                Lưu ý: API Key của bạn chỉ được lưu trong Local Storage của trình duyệt này và không được gửi đi đâu khác ngoài Google Gemini.
            </p>
        </div>
      )}

      {systemInitializationMessage && !showUserApiKeySection && ( // Only show system init message if user section is hidden
          <p className={`text-xs px-2 py-1 rounded-md text-center ${systemApiError ? 'text-yellow-300 bg-yellow-700/30 ring-1 ring-yellow-600/50' : 'text-sky-300 bg-sky-700/30 ring-1 ring-sky-600/50'}`}>
              {systemInitializationMessage}
          </p>
      )}
      
      { (isLoadingSystemApi || isLoadingUserApi) && newsItems.length === 0 && (
          <p className="text-slate-400 text-center py-6 text-md">Đang tải tin tức...</p>
      )}

      { !(isLoadingSystemApi || isLoadingUserApi) && (systemApiError && !userApiError && newsItems.length === 0) && ( 
        <div className="bg-red-700/30 border border-red-500 text-red-300 p-3 rounded-md shadow-md text-sm" role="alert">
          <div className="flex items-center"> <WarningIcon className="h-5 w-5 text-red-400 mr-2" /> <p>{systemApiError}</p> </div>
        </div>
      )}
      { !(isLoadingSystemApi || isLoadingUserApi) && (userApiError && newsItems.length === 0) && ( 
        <div className="bg-red-700/30 border border-red-500 text-red-300 p-3 rounded-md shadow-md text-sm" role="alert">
          <div className="flex items-center"> <WarningIcon className="h-5 w-5 text-red-400 mr-2" /> <p>{userApiError}</p> </div>
        </div>
      )}


      { !(isLoadingSystemApi || isLoadingUserApi) && !systemApiError && !userApiError && newsItems.length === 0 && (hasFetchedOnceSystem || hasFetchedOnceUser) && (
        <p className="text-slate-400 text-center py-6 text-md">Không có tin tức mới nào được tìm thấy.</p>
      )}
      { !(isLoadingSystemApi || isLoadingUserApi) && !systemApiError && newsItems.length === 0 && !hasFetchedOnceSystem && systemAiClient && !showUserApiKeySection && (
         <p className="text-slate-400 text-center py-6 text-md">Nhấn nút "Tải Tin Tức (Hệ Thống)" để xem nội dung.</p>
      )}


      {newsItems.length > 0 && (
        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-slate-700/70 p-4 rounded-lg shadow-lg ring-1 ring-slate-600/50 hover:ring-sky-500/70 transition-all duration-300">
              <h3 className="text-md font-semibold text-sky-300 mb-1">{item.tieuDe}</h3>
              {item.thoiGian && <p className="text-xs text-slate-500 mb-1.5">Thời gian: {item.thoiGian}</p>}
              <p className="text-sm text-slate-200 leading-relaxed mb-2">{item.tomTat}</p>
              {item.urlNguon && (
                <a href={item.urlNguon} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-sky-400 hover:text-sky-200 hover:underline">
                  Đọc thêm tại nguồn <ExternalLinkIcon className="w-3 h-3 ml-1" />
                </a>
              )}
              {item.sourceAttributions && item.sourceAttributions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-600/50">
                  <h4 className="text-xs font-semibold text-slate-400 mb-1">Nguồn tham khảo (Google Search):</h4>
                  <ul className="list-disc list-inside ml-2 space-y-0.5">
                    {item.sourceAttributions.map((attr, idx) => (
                      <li key={idx} className="text-xs">
                        <a href={attr.uri} target="_blank" rel="noopener noreferrer" title={attr.title} className="text-cyan-400 hover:text-cyan-200 hover:underline truncate">
                           <LinkIcon className="w-3 h-3 inline mr-1"/> {attr.title || attr.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DailyBlockchainNewsSection;