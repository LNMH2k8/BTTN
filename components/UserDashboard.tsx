
import React, { useState } from 'react';
import { AppState } from '../types';

interface UserDashboardProps {
  state: AppState;
  onStartQuiz: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ state, onStartQuiz }) => {
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');

  const mySubmissions = state.submissions.filter(s => s.userId === state.currentUser?.id);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const quiz = state.quizzes.find(q => q.id === searchId);
    if (quiz) {
      onStartQuiz(quiz.id);
      setError('');
    } else {
      setError('Không tìm thấy phòng bài tập với mã này.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Search Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Vào phòng thi
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="Nhập mã phòng ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {error && <p className="text-red-400 text-xs px-2">{error}</p>}
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                Bắt đầu làm bài
              </button>
            </form>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Thống kê cá nhân</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-bold text-white">{mySubmissions.length}</p>
                <p className="text-xs text-slate-500">Bài đã hoàn thành</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-bold text-indigo-400">
                  {mySubmissions.length > 0 
                    ? (mySubmissions.reduce((acc, curr) => acc + curr.score, 0) / mySubmissions.length).toFixed(1)
                    : '0.0'}
                </p>
                <p className="text-xs text-slate-500">Điểm trung bình</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-2">
          <div className="glass p-8 rounded-3xl min-h-[500px]">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
              Lịch sử làm bài
            </h2>

            {mySubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2(0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Bạn chưa thực hiện bài thi nào.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mySubmissions.map((sub) => {
                  const quiz = state.quizzes.find(q => q.id === sub.quizId);
                  return (
                    <div key={sub.id} className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${sub.score >= 8 ? 'bg-green-500/20 text-green-400' : sub.score >= 5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                          {sub.score}
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {quiz?.title || 'Bài thi đã bị xóa'}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {new Date(sub.timestamp).toLocaleDateString('vi-VN')} • ID: {sub.quizId}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onStartQuiz(sub.quizId)}
                        className="opacity-0 group-hover:opacity-100 px-4 py-2 rounded-lg bg-indigo-600 text-xs font-bold transition-all hover:bg-indigo-500"
                      >
                        Làm lại
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
