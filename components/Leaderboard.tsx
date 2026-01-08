
import React from 'react';
import { Submission } from '../types';

interface LeaderboardProps {
  quizId: string;
  submissions: Submission[];
  currentUserId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ quizId, submissions, currentUserId }) => {
  const quizSubmissions = submissions
    .filter(s => s.quizId === quizId)
    .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);

  return (
    <div className="glass p-8 rounded-[2.5rem]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Bảng xếp hạng
        </h2>
        <span className="text-sm text-slate-500">{quizSubmissions.length} người tham gia</span>
      </div>

      <div className="space-y-3">
        {quizSubmissions.map((sub, index) => {
          const isMe = sub.userId === currentUserId;
          const isTop3 = index < 3;
          
          return (
            <div 
              key={sub.id} 
              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isMe ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-white/5 border border-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-slate-900' : 
                  index === 1 ? 'bg-slate-300 text-slate-900' : 
                  index === 2 ? 'bg-amber-700 text-white' : 
                  'bg-white/10 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className={`font-bold ${isMe ? 'text-indigo-400' : 'text-white'}`}>
                    {sub.username} {isMe && '(Bạn)'}
                  </h4>
                  <p className="text-[10px] text-slate-500">{new Date(sub.timestamp).toLocaleTimeString('vi-VN')}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xl font-bold ${isTop3 ? 'text-white' : 'text-slate-400'}`}>
                  {sub.score}
                </span>
                <span className="text-[10px] text-slate-600 ml-1">/ 10</span>
              </div>
            </div>
          );
        })}

        {quizSubmissions.length === 0 && (
          <p className="text-center text-slate-600 py-10 italic">Chưa có bảng xếp hạng cho bài tập này.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
