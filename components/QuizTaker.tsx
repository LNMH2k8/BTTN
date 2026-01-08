
import React, { useState, useEffect } from 'react';
import { Quiz, User, Submission, Submission as SubmissionType } from '../types';
import { calculateScore } from '../constants';
import Leaderboard from './Leaderboard';

interface QuizTakerProps {
  quiz: Quiz;
  user: User;
  submissions: SubmissionType[];
  onSubmit: (submission: Submission) => void;
  onCancel: () => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, user, submissions, onSubmit, onCancel }) => {
  const [mcAnswers, setMcAnswers] = useState<string[]>(Array(quiz.multipleChoiceAnswers.length).fill(''));
  // Thay đổi: Khởi tạo là null thay vì true để mặc định chưa chọn
  const [tfAnswers, setTfAnswers] = useState<(boolean | null)[][]>(
    Array(quiz.trueFalseAnswers.length).fill(null).map(() => Array(4).fill(null))
  );
  const [shortAnswers, setShortAnswers] = useState<string[]>(Array(quiz.shortAnswers.length).fill(''));
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [showResult, setShowResult] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Kiểm tra xem có câu trả lời ngắn nào chứa dấu chấm không
  const hasDecimalDotError = shortAnswers.some(ans => ans.includes('.'));

  const handleAutoSubmit = () => {
    if (hasDecimalDotError) {
      alert('Vui lòng sửa các lỗi nhập liệu (thay dấu "." bằng dấu ",") trước khi nộp bài!');
      return;
    }

    // Chuyển đổi các giá trị null trong tfAnswers thành false để tính điểm (coi như trả lời sai)
    const normalizedTf = tfAnswers.map(qSet => qSet.map(ans => ans === true));

    const finalScore = calculateScore(
      quiz.type, 
      { mc: mcAnswers, tf: normalizedTf, short: shortAnswers }, 
      { mc: quiz.multipleChoiceAnswers, tf: quiz.trueFalseAnswers, short: quiz.shortAnswers }
    );

    const submission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: quiz.id,
      userId: user.id,
      username: user.username,
      score: finalScore,
      timestamp: Date.now(),
      answers: { 
        multipleChoice: mcAnswers, 
        trueFalse: normalizedTf, 
        short: shortAnswers 
      }
    };
    setShowResult(finalScore);
    onSubmit(submission);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (showResult !== null) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="glass p-12 rounded-[3rem] text-center mb-10">
          <div className="w-32 h-32 rounded-full bg-indigo-600/20 border-4 border-indigo-600 flex items-center justify-center text-5xl font-bold mx-auto mb-6 shadow-2xl shadow-indigo-600/40 text-white">
            {showResult}
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Hoàn thành bài thi!</h2>
          <p className="text-slate-400 mb-8">Số điểm của bạn là: {showResult}/10</p>
          <button 
            onClick={onCancel}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-10 rounded-2xl transition-all"
          >
            Quay về trang chủ
          </button>
        </div>
        
        <Leaderboard quizId={quiz.id} submissions={submissions} currentUserId={user.id} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-slideUp">
      {/* Sticky Header */}
      <div className="glass sticky top-24 z-40 p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-500/30">
        <div>
          <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          <p className="text-sm text-slate-400">Đang làm bài • ID: {quiz.id}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Thời gian còn lại</p>
            <p className={`text-3xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
          <button 
            onClick={handleAutoSubmit}
            disabled={hasDecimalDotError}
            className={`font-bold py-3 px-8 rounded-2xl transition-all shadow-lg ${hasDecimalDotError ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/20'}`}
          >
            Nộp bài
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Part 1 */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            Phần I: Câu hỏi trắc nghiệm
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mcAnswers.map((ans, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-slate-500 mb-3">CÂU {idx + 1}</p>
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => {
                        const newAns = [...mcAnswers];
                        newAns[idx] = opt;
                        setMcAnswers(newAns);
                      }}
                      className={`flex-1 h-10 rounded-xl flex items-center justify-center font-bold transition-all border ${ans === opt ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2 */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <span className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
            Phần II: Câu hỏi đúng/sai
          </h3>
          <div className="space-y-6">
            {tfAnswers.map((qSet, qIdx) => (
              <div key={qIdx} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-20 font-bold text-slate-400">Câu {qIdx + 1}</div>
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map(subIdx => (
                      <div key={subIdx} className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold mb-2">Ý {subIdx + 1}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              const newTf = [...tfAnswers];
                              newTf[qIdx][subIdx] = true;
                              setTfAnswers(newTf);
                            }}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tfAnswers[qIdx][subIdx] === true ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 'text-slate-500 bg-white/5 hover:text-slate-400'}`}
                          >
                            Đúng
                          </button>
                          <button 
                            onClick={() => {
                              const newTf = [...tfAnswers];
                              newTf[qIdx][subIdx] = false;
                              setTfAnswers(newTf);
                            }}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tfAnswers[qIdx][subIdx] === false ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-slate-500 bg-white/5 hover:text-slate-400'}`}
                          >
                            Sai
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 3 */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <span className="w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
            Phần III: Trả lời ngắn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortAnswers.map((ans, idx) => (
              <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Câu {idx + 1}</p>
                <input 
                  type="text" 
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all ${ans.includes('.') ? 'border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:ring-pink-500/50'}`}
                  placeholder="Nhập câu trả lời..."
                  value={ans}
                  onChange={(e) => {
                    const newShort = [...shortAnswers];
                    newShort[idx] = e.target.value;
                    setShortAnswers(newShort);
                  }}
                />
                {ans.includes('.') && (
                  <p className="mt-2 text-[10px] text-red-400 font-medium">
                    ⚠️ Sử dụng dấu phẩy (,) thay vì dấu chấm (.) cho số thập phân.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;
