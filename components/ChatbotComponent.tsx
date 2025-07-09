import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Part, GroundingChunk } from "@google/genai";
import { ChatMessage, NotificationType, SourceAttribution } from '../types';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon, SparklesIcon as AiIcon, WarningIcon, AcademicCapIcon, WalletIcon, BuildingStorefrontIcon, CloudArrowUpIcon, DocumentTextIcon } from './Icons';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const LEARNING_PATHS = [
  { label: "Blockchain là gì?", prompt: "Giải thích cơ bản về Blockchain là gì?", icon: <AcademicCapIcon className="w-4 h-4 mr-1.5" /> },
  { label: "Ví hoạt động thế nào?", prompt: "Ví tài sản mã hoá hoạt động như thế nào?", icon: <WalletIcon className="w-4 h-4 mr-1.5" /> },
  { label: "Sàn giao dịch là gì?", prompt: "Sàn giao dịch tài sản mã hoá là gì và có mấy loại chính?", icon: <BuildingStorefrontIcon className="w-4 h-4 mr-1.5" /> },
];

const AUTHOR_ATTRIBUTION = "\n\n© 2025 Bộ phận Đào tạo - Viện Công nghệ Blockchain và Trí tuệ nhân tạo (ABAII) (abaii.vn)";
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain'];
const MAX_FILE_SIZE_MB = 10;

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    // This is a simplified markdown parser. It may not handle all edge cases perfectly.
    const renderLine = (line: string) => {
        // Links: [text](url)
        line = line.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:underline">$1</a>');
        // Bold: **text**
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italics: *text*
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        return line;
    };

    const blocks = text.split(/\n\n+/); // Split by one or more blank lines to create paragraphs/blocks

    return (
        <div className="prose prose-sm prose-invert max-w-none chatbot-content">
            {blocks.map((block, i) => {
                // Headings
                if (block.startsWith('### ')) return <h4 key={i} className="text-md font-semibold mt-2 mb-1" dangerouslySetInnerHTML={{ __html: renderLine(block.substring(4)) }} />;
                if (block.startsWith('## ')) return <h3 key={i} className="text-lg font-semibold mt-3 mb-1" dangerouslySetInnerHTML={{ __html: renderLine(block.substring(3)) }} />;
                if (block.startsWith('# ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: renderLine(block.substring(2)) }} />;

                // Unordered List
                if (block.split('\n').every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
                    const items = block.split('\n').map((item, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: renderLine(item.replace(/^[-*]\s/, '')) }} />
                    ));
                    return <ul key={i} className="list-disc list-outside my-2 pl-5 space-y-1">{items}</ul>;
                }
                
                // Ordered List
                if (block.split('\n').every(line => /^\d+\.\s/.test(line.trim()))) {
                    const items = block.split('\n').map((item, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: renderLine(item.replace(/^\d+\.\s/, '')) }} />
                    ));
                    return <ol key={i} className="list-decimal list-outside my-2 pl-5 space-y-1">{items}</ol>;
                }

                // Paragraph
                return <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: renderLine(block) }} />;
            })}
        </div>
    );
};


export const ChatbotComponent: React.FC<ChatbotProps> = ({ isOpen, onClose, addNotification }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiClient, setAiClient] = useState<GoogleGenAI | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ file: File; preview: string } | null>(null);

  const welcomeMessage: ChatMessage = {
    id: crypto.randomUUID(),
    text: `Chào bạn! Tôi là Trợ lý AI Blockchain, được phát triển bởi Bộ phận Đào tạo - Viện Công nghệ Blockchain và Trí tuệ nhân tạo (ABAII). Tôi sẵn sàng giải đáp các thắc mắc của bạn về ví, sàn giao dịch tài sản mã hoá, và công nghệ blockchain. Hãy đặt câu hỏi cho tôi, hoặc chọn một chủ đề gợi ý bên dưới!${AUTHOR_ATTRIBUTION}`,
    sender: 'ai',
    timestamp: new Date()
  };

  const apiKeyMissingMessage: ChatMessage = {
    id: crypto.randomUUID(),
    text: `Rất tiếc, Chatbot AI không thể hoạt động do thiếu API Key của Gemini. Vui lòng kiểm tra cấu hình môi trường.${AUTHOR_ATTRIBUTION}`,
    sender: 'ai',
    timestamp: new Date(),
    error: "API Key missing"
  };

  useEffect(() => {
    if (typeof process.env.API_KEY === 'string' && process.env.API_KEY.trim() !== '') {
      try {
        const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
        setAiClient(client);
        setApiKeyMissing(false);
      } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
        addNotification("Không thể khởi tạo AI Chatbot. Lỗi cấu hình.", "error");
        setApiKeyMissing(true);
      }
    } else {
      console.warn("API_KEY for Gemini is not set or is empty. Chatbot will not function.");
      setApiKeyMissing(true);
    }
  }, [addNotification]);
  
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        if (apiKeyMissing) {
          setMessages([apiKeyMissingMessage]);
        } else {
          setMessages([welcomeMessage]);
        }
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, apiKeyMissing, welcomeMessage, apiKeyMissingMessage, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const systemInstructionText = `Bạn là một trợ lý AI chuyên gia về công nghệ blockchain, ví tài sản mã hoá và sàn giao dịch tài sản mã hoá, được phát triển bởi Bộ phận Đào tạo - Viện Công nghệ Blockchain và Trí tuệ nhân tạo (ABAII). Nhiệm vụ của bạn là cung cấp các câu trả lời chính xác, rõ ràng và có cấu trúc tốt cho mục đích giáo dục.

HƯỚNG DẪN TRẢ LỜI:
- Sử dụng ngôn ngữ Tiếng Việt.
- **Định dạng câu trả lời bằng Markdown.** Sử dụng các tiêu đề (ví dụ: '## Tiêu đề chính', '### Tiêu đề phụ'), danh sách có dấu đầu dòng ('- '), danh sách có số thứ tự ('1. '), chữ **in đậm** ('**text**'), và chữ *in nghiêng* ('*text*') để làm cho câu trả lời dễ đọc và khoa học hơn.
- Nếu người dùng tải lên một tệp (hình ảnh, PDF, văn bản), hãy phân tích nội dung của nó và trả lời câu hỏi liên quan đến tệp đó trong bối cảnh blockchain (ví dụ: "Phân tích Sách trắng trong tệp PDF này", "Đây là loại lừa đảo gì qua ảnh chụp màn hình?", "Giao diện ví này có an toàn không?").
- Nếu câu hỏi nằm ngoài phạm vi kiến thức về blockchain, ví hoặc sàn giao dịch tài sản mã hoá, hãy lịch sự thông báo rằng bạn không thể trả lời.
- **Không tự thêm bất kỳ thông tin nào về tác giả hay bản quyền vào cuối câu trả lời,** vì điều đó sẽ được thực hiện tự động.`;

   const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve((reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
    const base64EncodedData = await base64EncodedDataPromise;
    return {
      inlineData: {
        mimeType: file.type,
        data: base64EncodedData,
      },
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            addNotification("Loại tệp không được hỗ trợ. Chỉ cho phép ảnh, PDF, text.", "error");
            return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            addNotification(`Kích thước tệp không được vượt quá ${MAX_FILE_SIZE_MB}MB.`, "error");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachedFile({ file, preview: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
    // Clear the input value to allow selecting the same file again
    if (event.target) event.target.value = '';
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const extractSourceAttributionsFromBot = (groundingChunks?: GroundingChunk[]): SourceAttribution[] | undefined => {
    if (!groundingChunks || groundingChunks.length === 0) return undefined;
    return groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
      .map(chunk => ({ uri: chunk.web!.uri!, title: chunk.web!.title! }));
  };

  const processAndSendPrompt = useCallback(async (promptText: string) => {
    const trimmedInput = promptText.trim();
    if ((!trimmedInput && !attachedFile) || isLoading) return;

    if (!aiClient || apiKeyMissing) {
      addNotification("Chatbot AI chưa sẵn sàng (thiếu API Key hoặc lỗi khởi tạo).", "error");
      if (messages.length === 0 || messages[messages.length-1].id !== apiKeyMissingMessage.id ) {
        setMessages(prev => [...prev, apiKeyMissingMessage]);
      }
      return;
    }

    const currentFile = attachedFile; // Capture the file at the time of sending
    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: `${currentFile ? `[Tệp đã được đính kèm: ${currentFile.file.name}]\n` : ''}${trimmedInput}`,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    handleRemoveFile(); 
    setIsLoading(true);

    const loadingAiMessageId = crypto.randomUUID();
    const loadingAiMessage: ChatMessage = {
      id: loadingAiMessageId,
      text: "Đang suy nghĩ...",
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingAiMessage]);

    try {
      const contents: Part[] = [];
      if (currentFile) {
          const filePart = await fileToGenerativePart(currentFile.file);
          contents.push(filePart);
      }
      if (trimmedInput) {
          contents.push({ text: trimmedInput });
      }
      
      const useGoogleSearch = !currentFile; 

      const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: contents }],
        config: {
          systemInstruction: systemInstructionText,
          ...(useGoogleSearch && { tools: [{ googleSearch: {} }] })
        }
      });
      
      const attributions = useGoogleSearch ? extractSourceAttributionsFromBot(response.candidates?.[0]?.groundingMetadata?.groundingChunks) : undefined;
      let aiResponseText = response.text ? response.text : `Xin lỗi, tôi không thể tạo phản hồi lúc này.`;
      
      if (attributions && attributions.length > 0) {
        const sourcesText = attributions.map(attr => `- [${attr.title}](${attr.uri})`).join('\n');
        aiResponseText += `\n\n**Nguồn tham khảo:**\n${sourcesText}`;
      }

      aiResponseText += AUTHOR_ATTRIBUTION;

      const newAiMessage: ChatMessage = {
        id: loadingAiMessageId, 
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => prev.map(msg => msg.id === loadingAiMessageId ? newAiMessage : msg));

    } catch (error: any) {
      console.error("Gemini API error:", error);
      const errorMessage = `Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.\nChi tiết lỗi: ${error.message || 'Unknown error'}${AUTHOR_ATTRIBUTION}`;
      addNotification(errorMessage, "error");
      const errorAiMessage: ChatMessage = {
         id: loadingAiMessageId,
         text: errorMessage,
         sender: 'ai',
         timestamp: new Date(),
         error: String(error.message || error)
      };
      setMessages(prev => prev.map(msg => msg.id === loadingAiMessageId ? errorAiMessage : msg));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isLoading, aiClient, apiKeyMissing, addNotification, systemInstructionText, attachedFile, apiKeyMissingMessage, messages.length]);

  const handleSendMessage = () => {
    processAndSendPrompt(userInput);
  };

  const handleLearningPathClick = (prompt: string) => {
    processAndSendPrompt(prompt);
  };

  if (!isOpen) return null;

  const isChatDisabled = isLoading || apiKeyMissing || !aiClient;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-down" role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
      <div className="bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl flex flex-col ring-1 ring-slate-700 max-h-[80vh] md:max-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center">
            <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7 text-sky-400 mr-2" />
            <h2 id="chatbot-title" className="text-lg font-semibold text-sky-400">AI Blockchain Helper</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-sky-300 rounded-full hover:bg-slate-700" aria-label="Đóng chatbot">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow p-4 space-y-3 overflow-y-auto custom-scrollbar" aria-live="polite">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-2.5 rounded-lg shadow ${
                  msg.sender === 'user' 
                    ? 'bg-sky-600 text-white rounded-br-none' 
                    : `bg-slate-700 text-slate-200 rounded-bl-none ${msg.isLoading ? 'italic' : ''} ${msg.error ? 'border border-red-500 bg-red-900/30' : ''}`
                }`}
              >
                {msg.sender === 'ai' && !msg.isLoading && !msg.error && <AiIcon className="w-4 h-4 inline mr-1.5 text-yellow-400 align-text-bottom" />}
                {msg.sender === 'ai' && msg.error && <WarningIcon className="w-4 h-4 inline mr-1.5 text-red-400 align-text-bottom" />}
                {msg.isLoading ? <span className="animate-pulse">Đang suy nghĩ...</span> : <MarkdownRenderer text={msg.text} />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!apiKeyMissing && aiClient && (
          <div className="px-4 pt-2 pb-1 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-1.5 text-center">Hoặc chọn một chủ đề gợi ý:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {LEARNING_PATHS.map(path => (
                <button
                  key={path.label}
                  onClick={() => handleLearningPathClick(path.prompt)}
                  disabled={isChatDisabled}
                  className="flex items-center text-xs bg-slate-600 hover:bg-slate-500 text-slate-200 px-2.5 py-1 rounded-full shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {path.icon}
                  {path.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-700">
          {apiKeyMissing && (
            <p className="text-xs text-yellow-400 text-center mb-2 px-2 py-1.5 bg-yellow-700/30 rounded-md ring-1 ring-yellow-600/50">
              <WarningIcon className="w-4 h-4 inline mr-1" />
              Chatbot AI không hoạt động. Cần cấu hình API Key trong môi trường.
            </p>
          )}

          {attachedFile && (
            <div className="mb-2 p-2 bg-slate-700 rounded-md flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                    {attachedFile.file.type.startsWith('image/') ? (
                      <img src={attachedFile.preview} alt="File preview" className="w-10 h-10 rounded object-cover mr-2 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <DocumentTextIcon className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <span className="text-xs text-slate-300 truncate">{attachedFile.file.name}</span>
                </div>
                <button onClick={handleRemoveFile} className="p-1 text-slate-400 hover:text-red-400 rounded-full" aria-label="Gỡ bỏ tệp">
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={ALLOWED_MIME_TYPES.join(',')}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isChatDisabled || !!attachedFile}
                className="p-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                aria-label="Đính kèm tệp"
                title={`Đính kèm tệp (Ảnh, PDF, TXT... Tối đa ${MAX_FILE_SIZE_MB}MB)`}
            >
                <CloudArrowUpIcon className="w-5 h-5" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isChatDisabled && handleSendMessage()}
              placeholder={isChatDisabled ? (apiKeyMissing ? "Chatbot không sẵn sàng..." : "Đang tải...") : "Hỏi hoặc dán link/đính kèm tệp..."}
              className="flex-grow p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isChatDisabled}
              aria-label="Nhập câu hỏi cho chatbot"
            />
            <button
              onClick={handleSendMessage}
              disabled={isChatDisabled || (!userInput.trim() && !attachedFile)}
              className="p-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              aria-label="Gửi tin nhắn"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
