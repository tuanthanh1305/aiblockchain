
import React, { useState, useCallback, useMemo } from 'react';
import { generateSimpleKeyFromWords } from '../utils/cryptoSim';
import { DocumentDuplicateIcon, CheckCircleIcon, SparklesIcon, ArrowDownIcon } from './Icons';
import { NotificationType } from '../types';

interface SeedPhraseDemoProps {
  seedWords: string[]; // List of all available demo seed words
  onCopy: (textToCopy: string, itemName: string) => void;
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const MAX_SELECTED_WORDS = 6; // Keep it small for demo UI

const SeedPhraseDemo: React.FC<SeedPhraseDemoProps> = ({ seedWords, onCopy, addNotification }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [generatedMasterKey, setGeneratedMasterKey] = useState<string | null>(null);
  const [generatedDerivedKey, setGeneratedDerivedKey] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const availableWords = useMemo(() => {
    // Show a limited number of available words for UI, e.g., first 18 unique words not yet selected
    return seedWords.filter(word => !selectedWords.includes(word)).slice(0, 18); 
  }, [seedWords, selectedWords]);

  const handleWordSelect = (word: string) => {
    if (selectedWords.length < MAX_SELECTED_WORDS) {
      setSelectedWords(prev => [...prev, word]);
      setGeneratedMasterKey(null); // Reset keys if selection changes
      setGeneratedDerivedKey(null);
    } else {
      addNotification(`Bạn chỉ có thể chọn tối đa ${MAX_SELECTED_WORDS} từ cho demo này.`, 'info', 2500);
    }
  };

  const handleWordDeselect = (wordToRemove: string) => {
    setSelectedWords(prev => prev.filter(word => word !== wordToRemove));
    setGeneratedMasterKey(null); // Reset keys if selection changes
    setGeneratedDerivedKey(null);
  };
  
  const handleGenerateKeys = useCallback(() => {
    if (selectedWords.length === 0) {
      addNotification("Vui lòng chọn ít nhất một từ.", "error", 2000);
      return;
    }
    const masterKey = generateSimpleKeyFromWords(selectedWords);
    setGeneratedMasterKey(masterKey);
    // Simulate a derived key - very simplified, e.g., hash the master key or a part of it with a salt
    const derivedKey = generateSimpleKeyFromWords([masterKey, "derived_salt_for_demo_purpose"]); // Added a salt for variation
    setGeneratedDerivedKey(derivedKey);
    addNotification("Khóa (mô phỏng) đã được tạo từ các từ đã chọn!", "success", 2000);
  }, [selectedWords, addNotification]);

  const handleCopyClick = (textToCopy: string, itemName: string) => {
    onCopy(textToCopy, itemName);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="p-4 bg-slate-800/70 rounded-lg shadow-inner ring-1 ring-slate-700/70 space-y-4">
      <div>
        <h5 className="text-sm font-semibold text-slate-300 mb-2">1. Chọn các từ (Tối đa {MAX_SELECTED_WORDS}):</h5>
        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-slate-700/50 rounded-md min-h-[40px]">
          {availableWords.map(word => (
            <button
              key={word}
              onClick={() => handleWordSelect(word)}
              className="px-2 py-1 text-xs bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow transition-colors"
            >
              {word}
            </button>
          ))}
          {availableWords.length === 0 && selectedWords.length < MAX_SELECTED_WORDS && (
            <p className="text-xs text-slate-500">Đã hết từ gợi ý (hoặc đã chọn đủ từ cho phép).</p>
          )}
           {selectedWords.length >= MAX_SELECTED_WORDS && (
            <p className="text-xs text-slate-500">Đã đạt giới hạn {MAX_SELECTED_WORDS} từ.</p>
          )}
        </div>
      </div>

      {selectedWords.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-slate-300 mb-1">Các từ đã chọn ({selectedWords.length}/{MAX_SELECTED_WORDS}):</h5>
          <div className="flex flex-wrap gap-1 p-2 bg-slate-900 rounded-md">
            {selectedWords.map(word => (
              <span key={word} className="flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded-md shadow">
                {word}
                <button onClick={() => handleWordDeselect(word)} className="ml-1.5 text-green-200 hover:text-white text-sm leading-none" aria-label={`Bỏ chọn từ ${word}`}>&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleGenerateKeys}
        disabled={selectedWords.length === 0}
        className="w-full flex items-center justify-center py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-60"
      >
        <SparklesIcon className="w-4 h-4 mr-2" />
        Tạo Khóa (Mô Phỏng) Từ Các Từ Đã Chọn
      </button>

      {generatedMasterKey && (
        <div className="mt-3 space-y-2 pt-3 border-t border-slate-600">
          <ArrowDownIcon className="w-6 h-6 text-slate-500 mx-auto" />
          <div>
            <label className="block text-xs font-medium text-slate-400">Khóa Gốc (Master Seed/Key - Mô Phỏng):</label>
            <div className="flex items-center p-2 bg-slate-700 rounded-md">
              <pre className="text-xs text-yellow-300 break-all flex-grow font-mono" title={generatedMasterKey}>{generatedMasterKey}</pre>
              <button 
                onClick={() => handleCopyClick(generatedMasterKey, "Khóa Gốc")}
                title="Sao chép Khóa Gốc"
                aria-label="Sao chép Khóa Gốc"
                className="ml-2 p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-600"
              >
                {copiedItem === "Khóa Gốc" ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <DocumentDuplicateIcon className="w-4 h-4"/>}
              </button>
            </div>
          </div>
          {generatedDerivedKey && (
            <div>
              <label className="block text-xs font-medium text-slate-400">Khóa Riêng Tư Con (Derived Private Key - Mô Phỏng):</label>
               <div className="flex items-center p-2 bg-slate-700 rounded-md">
                <pre className="text-xs text-red-400 break-all flex-grow font-mono" title={generatedDerivedKey}>{generatedDerivedKey}</pre>
                <button 
                  onClick={() => handleCopyClick(generatedDerivedKey, "Khóa Riêng Tư Con")}
                  title="Sao chép Khóa Riêng Tư Con"
                  aria-label="Sao chép Khóa Riêng Tư Con"
                  className="ml-2 p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-600"
                >
                  {copiedItem === "Khóa Riêng Tư Con" ? <CheckCircleIcon className="w-4 h-4 text-green-400"/> : <DocumentDuplicateIcon className="w-4 h-4"/>}
                </button>
              </div>
               <p className="text-[10px] text-slate-500 mt-1">Trong ví HD thực tế, nhiều khóa con có thể được tạo ra từ khóa gốc này.</p>
            </div>
          )}
        </div>
      )}
       <p className="text-xs text-yellow-400/80 bg-yellow-800/30 p-2 rounded-md ring-1 ring-yellow-600/50 mt-3">
        <strong>Lưu ý:</strong> Đây là mô phỏng đơn giản hóa. Khóa được tạo <strong className="uppercase">KHÔNG</strong> an toàn và chỉ cho mục đích giáo dục. Quy trình thực tế sử dụng các thuật toán mật mã phức tạp hơn (ví dụ: PBKDF2, HMAC-SHA512) để tạo khóa gốc từ cụm từ khôi phục.
      </p>
    </div>
  );
};

export default SeedPhraseDemo;
