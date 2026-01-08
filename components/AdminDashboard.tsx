
import React, { useState } from 'react';
import { AppState, QuizCategory, Quiz } from '../types';

interface AdminDashboardProps {
  state: AppState;
  onCreateQuiz: () => void;
  onAddCategory: (name: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, onCreateQuiz, onAddCategory }) => {
  const [newCatName, setNewCatName] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredQuizzes = activeTab === 'all' 
    ? state.quizzes 
    : state.quizzes.filter(q => q.categoryId === activeTab);

  const getSubCount = (quizId: string) => state.submissions.filter(s => s.quizId === quizId).length;

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý hệ thống</h1>
          <p className="text-slate-400">Tạo mới, quản lý bài tập và theo dõi thí sinh</p>
        </div>
        <button 
          onClick={onCreateQuiz}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo bài thi mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4 text-white">Danh mục</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('all')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-white/5'}`}
              >
                Tất cả bài tập
              </button>
              {state.categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === cat.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Thêm danh mục</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Tên mục..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <button 
                  onClick={() => { if(newCatName) { onAddCategory(newCatName); setNewCatName(''); }}}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz List */}
        <div className="lg:col-span-3">
          <div className="glass p-8 rounded-3xl min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                {activeTab === 'all' ? 'Tất cả bài tập' : state.categories.find(c => c.id === activeTab)?.name}
              </h2>
              <span className="text-sm text-slate-500">{filteredQuizzes.length} bài thi</span>
            </div>

            {filteredQuizzes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-slate-500">
                <p>Không có bài tập nào trong mục này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuizzes.map(quiz => (
                  <div key={quiz.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                          {quiz.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {quiz.id}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{quiz.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {quiz.timeLimit} phút
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {getSubCount(quiz.id)} thí sinh
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
