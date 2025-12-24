import React, { useState, useRef, useMemo } from 'react';
import { Upload, UserPlus, Trash2, FileText, Play, AlertCircle, CopyX } from 'lucide-react';
import { Participant } from '../types';
import { Button } from './Button';

interface InputSectionProps {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
  onNext: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ participants, setParticipants, onNext }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze duplicates
  const { nameCounts, hasDuplicates } = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    const hasDupes = Object.values(counts).some(c => c > 1);
    return { nameCounts: counts, hasDuplicates: hasDupes };
  }, [participants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processText(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const processText = (text: string) => {
    const lines = text.split(/[\n,;]+/).map(line => line.trim()).filter(line => line.length > 0);
    const newParticipants: Participant[] = lines.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    
    setParticipants([...participants, ...newParticipants]);
  };

  const handleManualAdd = () => {
    if (!inputText.trim()) return;
    processText(inputText);
    setInputText('');
  };

  const loadDemoData = () => {
    const demoNames = [
      "陳小明", "林怡君", "張偉傑", "王雅婷", "李志豪", 
      "陳小明", // Duplicate
      "黃雅慧", "林俊宏", "陳建志", "張心怡", 
      "林怡君", // Duplicate
      "吳宗憲", "楊佳穎", "劉家豪", "蔡佩珊"
    ];
    processText(demoNames.join('\n'));
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueParticipants: Participant[] = [];
    
    participants.forEach(p => {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        uniqueParticipants.push(p);
      }
    });
    
    setParticipants(uniqueParticipants);
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center text-slate-800">
              <UserPlus className="w-5 h-5 mr-2 text-brand-600" />
              新增名單
            </h2>
            <button 
              onClick={loadDemoData}
              className="text-xs flex items-center text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <Play className="w-3 h-3 mr-1" /> 載入範例
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">批次貼上姓名 (一行一個)</label>
              <textarea
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                placeholder="王小明&#10;李大同&#10;張三"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <Button onClick={handleManualAdd} disabled={!inputText.trim()} variant="secondary" className="w-full sm:w-auto">
                  加入名單
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">或是</span>
              </div>
            </div>

            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-500 mb-2 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-brand-700">上傳 CSV / TXT 檔案</span>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv,.txt"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>

        {/* List Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center text-slate-800">
                <FileText className="w-5 h-5 mr-2 text-brand-600" />
                目前名單
                <span className="ml-2 bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full">
                  {participants.length} 人
                </span>
              </h2>
              {participants.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-slate-400 hover:text-red-500 text-sm flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> 清空
                </button>
              )}
            </div>
            
            {hasDuplicates && (
              <div className="flex items-center justify-between bg-amber-50 text-amber-800 text-sm px-3 py-2 rounded-lg border border-amber-200">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>發現重複的姓名</span>
                </div>
                <button 
                  onClick={removeDuplicates}
                  className="flex items-center font-medium hover:underline text-amber-900"
                >
                  <CopyX className="w-4 h-4 mr-1" />
                  移除重複
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 rounded-lg border border-slate-200 p-2 max-h-[400px]">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <UserPlus className="w-12 h-12 mb-2 opacity-20" />
                <p>尚未加入任何名單</p>
                <p className="text-xs mt-2">可使用左側的「載入範例」快速試用</p>
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-2">
                {participants.map((p, idx) => {
                  const isDuplicate = nameCounts[p.name] > 1;
                  return (
                    <li key={p.id} className={`flex items-center p-2 rounded shadow-sm border transition-colors ${isDuplicate ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 ${isDuplicate ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center">
                            <span className={`truncate font-medium ${isDuplicate ? 'text-amber-900' : 'text-slate-800'}`}>
                              {p.name}
                            </span>
                            {isDuplicate && (
                              <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1 rounded border border-amber-200 flex-shrink-0">
                                重複
                              </span>
                            )}
                         </div>
                      </div>
                      <button 
                        onClick={() => setParticipants(participants.filter(x => x.id !== p.id))}
                        className="ml-2 text-slate-300 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 z-10">
        <div className="max-w-4xl mx-auto flex justify-center">
            {participants.length > 0 && (
                <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-slate-200 animate-bounce-small">
                     <Button onClick={onNext} className="w-64 shadow-xl text-lg py-3">
                        開始使用功能
                     </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};