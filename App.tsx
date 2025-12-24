import React, { useState } from 'react';
import { UserPlus, Gift, Users } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { LuckyDraw } from './components/LuckyDraw';
import { GroupGenerator } from './components/GroupGenerator';
import { Participant, AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.INPUT);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const navItems = [
    { id: AppMode.INPUT, label: '名單管理', icon: <UserPlus className="w-5 h-5"/> },
    { id: AppMode.DRAW, label: '幸運抽獎', icon: <Gift className="w-5 h-5"/> },
    { id: AppMode.GROUP, label: '自動分組', icon: <Users className="w-5 h-5"/> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">HR</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
                Team Tools
              </span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === item.id 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Mobile Nav Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 overflow-x-auto">
         <div className="flex px-2 space-x-2 py-2">
            {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className={`flex-1 flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                    mode === item.id 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === AppMode.INPUT && (
            <InputSection 
                participants={participants} 
                setParticipants={setParticipants} 
                onNext={() => setMode(AppMode.DRAW)}
            />
        )}
        
        {mode === AppMode.DRAW && (
            <LuckyDraw participants={participants} />
        )}

        {mode === AppMode.GROUP && (
            <GroupGenerator participants={participants} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HR Team Tools. Designed for productivity.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
