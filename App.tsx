import React, { useState, useCallback, useEffect } from 'react';
import { AppNotification, NotificationType, ViewName, NavItem } from './types';
import { 
  HomeIcon, KeyNavIcon, WalletIcon, BeakerIcon, GlossaryIcon, 
  ChatBubbleOvalLeftEllipsisIcon, AcademicCapIcon, BuildingStorefrontIcon, BlockchainIcon, RocketLaunchIcon, MagnifyingGlassIcon, ExclamationTriangleIcon
} from './components/Icons'; 
import NotificationArea from './components/NotificationArea';
import Header from './components/Header';
import HomeView from './views/HomeView';
import KeyGenerationView from './views/KeyGenerationView';
import WalletTypesView from './views/WalletTypesView';
import SimulatorView from './views/SimulatorView';
import GlossaryView from './views/GlossaryView';
import TransactionsExplainedView from './views/TransactionsExplainedView';
import ExchangesExplainedView from './views/ExchangesExplainedView';
import BlockchainDemoView from './views/BlockchainDemoView';
import TokenLifecycleView from './views/TokenLifecycleView';
import { ChatbotComponent } from './components/ChatbotComponent';
import ProjectTestAutomationView from './views/ProjectTestAutomationView'; // Added import

const navItems: NavItem[] = [
  { id: 'home', label: 'Trang Chủ', icon: HomeIcon },
  { id: 'keyGeneration', label: 'Sinh Khóa', icon: KeyNavIcon },
  { id: 'walletTypes', label: 'Các Loại Ví', icon: WalletIcon },
  { id: 'blockchainDemo', label: 'Tìm Hiểu Blockchain', icon: BlockchainIcon },
  { id: 'transactionsExplained', label: 'Giao Dịch Blockchain', icon: AcademicCapIcon},
  { id: 'exchangesExplained', label: 'Tìm Hiểu Sàn G.D', icon: BuildingStorefrontIcon },
  { id: 'tokenLifecycle', label: 'Vòng Đời Token', icon: RocketLaunchIcon },
  { id: 'projectTestAutomation', label: '🔍 Test Dự Án', icon: MagnifyingGlassIcon }, // Added new nav item
  { id: 'simulator', label: 'Mô Phỏng Ví', icon: BeakerIcon },
  { id: 'glossary', label: 'Thuật Ngữ', icon: GlossaryIcon },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const addNotification = useCallback((message: string, type: NotificationType, duration: number = 3000) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  }, []); 

  const removeNotification = useCallback((id: string) => {
    setNotifications(currentNotifications => currentNotifications.filter(n => n.id !== id));
  }, []);
  
  const handleNavClick = (view: ViewName) => {
    setCurrentView(view);
  }

  const handleCopy = useCallback((textToCopy: string,itemName: string) => {
    navigator.clipboard.writeText(textToCopy);
    addNotification(`${itemName} đã được sao chép!`, 'success', 1500);
  },[addNotification]);

  const toggleChatbot = () => {
    setIsChatbotOpen(prev => !prev);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavClick} addNotification={addNotification} />;
      case 'keyGeneration':
        return <KeyGenerationView onCopy={handleCopy} addNotification={addNotification} />;
      case 'walletTypes':
        return <WalletTypesView />;
      case 'blockchainDemo': 
        return <BlockchainDemoView />;
      case 'transactionsExplained':
        return <TransactionsExplainedView />;
      case 'exchangesExplained':
        return <ExchangesExplainedView />;
      case 'tokenLifecycle':
        return <TokenLifecycleView addNotification={addNotification} />;
      case 'projectTestAutomation': // Added case for new view
        return <ProjectTestAutomationView addNotification={addNotification} />;
      case 'simulator':
        return <SimulatorView 
                  onCopy={handleCopy} 
                  addNotification={addNotification} 
                />;
      case 'glossary':
        return <GlossaryView />;
      default:
        return <HomeView onNavigate={handleNavClick} addNotification={addNotification} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 font-sans flex flex-col items-center p-0 md:p-4">
      <div className="w-full max-w-5xl flex flex-col flex-grow">
        <Header 
          navItems={navItems}
          currentView={currentView}
          onNavClick={handleNavClick}
        />
        
        <main className="flex-grow p-4 md:p-6 bg-slate-800/50 shadow-lg rounded-b-lg">
          {renderView()}
        </main>
        
        {/* Important Notice Banner */}
        <div className="w-full max-w-5xl px-4 md:px-0 my-2">
          <div className="p-3 rounded-lg shadow-xl" style={{ backgroundColor: '#4a3f30', border: '2px solid #e5b53b' }}>
            <h3 className="text-center text-lg font-bold uppercase tracking-wider mb-2 text-[#e5b53b]">
              Lưu Ý Quan Trọng
            </h3>
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-10 h-10 mr-4 flex-shrink-0 text-[#e5b53b]"/>
              <p className="text-sm text-[#e5b53b]">
                Đây là một nền tảng học tập và mô phỏng. Mọi địa chỉ ví, khóa riêng tư, cụm từ khôi phục và giao dịch đều là <strong className="font-bold">GIẢ</strong> và chỉ dành cho mục đích học tập. <strong className="font-bold uppercase">TUYỆT ĐỐI KHÔNG SỬ DỤNG THÔNG TIN TỪ ỨNG DỤNG NÀY VỚI TÀI SẢN MÃ HÓA THẬT.</strong>
              </p>
            </div>
          </div>
        </div>
        
        <footer className="text-center p-4 text-xs text-slate-400">
            <p>
                <a href="https://abaii.vn/about-us/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                    © 2025 Bộ phận Đào tạo - Viện Công nghệ Blockchain và Trí tuệ nhân tạo (ABAII)
                </a>
            </p>
        </footer>
      </div>

      <NotificationArea notifications={notifications} onRemoveNotification={removeNotification} />
      
      <button
        onClick={toggleChatbot}
        className="fixed bottom-5 right-5 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-500 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sky-400/50 z-40"
        aria-label="Mở Trợ lý AI"
        title="Mở Trợ lý AI"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
      </button>

      <ChatbotComponent 
        isOpen={isChatbotOpen}
        onClose={toggleChatbot}
        addNotification={addNotification}
      />
    </div>
  );
};

export default App;