import React, { useState } from 'react';
import { Users, Wand2, RefreshCcw, Download } from 'lucide-react';
import { Participant, Group } from '../types';
import { Button } from './Button';
import { generateCreativeGroupNames } from '../services/geminiService';

interface GroupGeneratorProps {
  participants: Participant[];
}

export const GroupGenerator: React.FC<GroupGeneratorProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNaming, setIsNaming] = useState(false);

  const generateGroups = () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    // Shuffle
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    const numGroups = Math.ceil(shuffled.length / groupSize);

    for (let i = 0; i < numGroups; i++) {
        const chunk = shuffled.slice(i * groupSize, (i + 1) * groupSize);
        newGroups.push({
            id: crypto.randomUUID(),
            name: `第 ${i + 1} 組`,
            members: chunk
        });
    }
    
    // Slight artificial delay for UX feeling
    setTimeout(() => {
        setGroups(newGroups);
        setIsGenerating(false);
    }, 500);
  };

  const applyAINames = async () => {
    if (groups.length === 0) return;
    setIsNaming(true);
    
    const groupMemberNames = groups.map(g => g.members.map(m => m.name));
    const newNames = await generateCreativeGroupNames(groupMemberNames);
    
    setGroups(prev => prev.map((g, idx) => ({
        ...g,
        name: newNames[idx] || g.name
    })));
    
    setIsNaming(false);
  };

  const exportGroups = () => {
    let csvContent = "組別名稱,姓名\n";
    groups.forEach(group => {
        group.members.forEach(member => {
            csvContent += `"${group.name}","${member.name}"\n`;
        });
    });

    // Add Byte Order Mark (BOM) for UTF-8 to make it open correctly in Excel
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <h2 className="text-xl font-bold flex items-center text-slate-800">
                <Users className="w-6 h-6 mr-2 text-brand-600" />
                自動分組
            </h2>
            
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap ml-2">每組人數:</label>
                <input 
                    type="number" 
                    min="2"
                    max={participants.length}
                    value={groupSize}
                    onChange={(e) => setGroupSize(Math.max(2, parseInt(e.target.value) || 2))}
                    className="w-20 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <Button onClick={generateGroups} isLoading={isGenerating} icon={<RefreshCcw className="w-4 h-4"/>}>
                    隨機分組
                </Button>
            </div>
        </div>
      </div>

      {groups.length > 0 && (
          <div className="flex justify-between items-center px-2">
             <p className="text-slate-500 text-sm">
                共 {groups.length} 組，{participants.length} 人
             </p>
             <div className="flex gap-2">
                 <Button onClick={applyAINames} variant="secondary" isLoading={isNaming} icon={<Wand2 className="w-4 h-4 text-purple-600"/>}>
                    AI 創意命名
                 </Button>
                 <Button onClick={exportGroups} variant="ghost" icon={<Download className="w-4 h-4"/>}>
                    匯出 CSV
                 </Button>
             </div>
          </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-brand-800 truncate" title={group.name}>{group.name}</h3>
                    <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                        {group.members.length} 人
                    </span>
                </div>
                <div className="p-4">
                    <ul className="space-y-2">
                        {group.members.map(member => (
                            <li key={member.id} className="text-sm text-slate-700 flex items-center">
                                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full mr-2"></span>
                                {member.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        ))}
        
        {groups.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>點擊上方按鈕開始分組</p>
            </div>
        )}
      </div>
    </div>
  );
};