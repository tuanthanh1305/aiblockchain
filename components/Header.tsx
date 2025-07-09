import React from 'react';
import { ViewName, NavItem } from '../types';
import { CogIcon, UserGroupIcon } from './Icons'; // Added UserGroupIcon, removed sound icons

interface HeaderProps {
  navItems: NavItem[];
  currentView: ViewName;
  onNavClick: (view: ViewName) => void;
  // Removed sound-related props:
  // isSoundEnabled: boolean;
  // onToggleSound: () => void;
  // soundIcon: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ navItems, currentView, onNavClick }) => {
  return (
    <header className="w-full max-w-5xl sticky top-0 z-40 bg-slate-800/80 backdrop-blur-lg shadow-lg rounded-t-lg md:rounded-lg mb-0 md:mb-2 ring-1 ring-slate-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16"> {/* Changed h-16 to min-h-16 */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex flex-col items-start mr-2">
              <span className="text-2xl font-extrabold text-green-500 leading-tight">ABAII</span>
              <span className="block text-[7px] text-slate-400 leading-tight -mt-1 whitespace-normal">Phát triển bởi<br />Bộ phận Đào tạo Viện<br />Công nghệ Blockchain và AI</span>
            </div>
          </div>
          <div className="hidden md:flex md:items-center flex-wrap justify-center"> {/* Added flex-wrap and justify-center for better alignment when wrapped */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out m-1 {/* Replaced space-x with margin */}
                  ${currentView === item.id 
                    ? 'bg-sky-500 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <item.icon className={`w-5 h-5 mr-2 ${currentView === item.id ? 'text-white' : 'text-sky-400'}`} />
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center">
             {/* Changed sound toggle to Facebook group link */}
             <a
                href="https://www.facebook.com/groups/163425249920158"
                target="_blank"
                rel="noopener noreferrer"
                title="Truy cập Diễn đàn AI & Blockchain Việt Nam"
                className="p-2 rounded-full hover:bg-sky-700/50 transition-colors text-sky-400"
                aria-label="Truy cập Diễn đàn AI & Blockchain Việt Nam"
              >
                <UserGroupIcon className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            <div className="md:hidden ml-2">
              <select 
                onChange={(e) => onNavClick(e.target.value as ViewName)} 
                value={currentView}
                className="bg-slate-700 text-white p-2 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                aria-label="Điều hướng chính"
              >
                {navItems.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;