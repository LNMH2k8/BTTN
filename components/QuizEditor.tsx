
import React, { useState } from 'react';
import { Quiz, QuizCategory, QuizType } from '../types';

interface QuizEditorProps {
  categories: QuizCategory[];
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ categories, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [quizType, setQuizType] = useState<QuizType>('18_questions');
  const [timeLimit, setTimeLimit] = useState(45);

  const mcCount = quizType === '18_questions' ? 18 : 12;
  const tfCount = 4;
  const shortCount = 6;

  const [mcAnswers, setMcAnswers] = useState<string[]>(Array(mcCount).fill('A'));
  const [tfAnswers, setTfAnswers] = useState<boolean[][]>(Array(tfCount).fill(0).map(() => Array(4).fill(true)));
  const [shortAnswers, setShortAnswers] = useState<string[]>(Array(shortCount).fill(''));

  const handleSave = () => {
    if (!title) return alert('Vui lòng nhập tiêu đề bài thi');
    
    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      title,
      categoryId,
      type: quizType,
      timeLimit,
      createdAt: Date.now(),
      multipleChoiceAnswers: mcAnswers.slice(0, mcCount),
      trueFalseAnswers: tfAnswers,
      shortAnswers: shortAnswers
    };
    onSave(newQuiz);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-slideUp">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Tạo đề thi mới</h1>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-6 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all">Hủy</button>
          <button 
            onClick={handleSave} 
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl text-white font-bold shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            Lưu và công bố
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Settings */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tiêu đề bài tập</label>
              <input 
                type="text" 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Ví dụ: Kiểm tra cuối kỳ - Toán 12"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Danh mục</label>
              <select 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4">Loại hình (Cấu trúc đề)</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setQuizType('18_questions')}
                  className={`flex-1 p-4 rounded-2xl border transition-all text-left ${quizType === '18_questions' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                >
                  <p className="font-bold">18 Câu Trắc Nghiệm</p>
                  <p className="text-[10px] mt-1 opacity-60">MC: 0.25đ | TF: Tùy ý | Short: 0.25đ</p>
                </button>
                <button 
                  onClick={() => setQuizType('12_questions')}
                  className={`flex-1 p-4 rounded-2xl border transition-all text-left ${quizType === '12_questions' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                >
                  <p className="font-bold">12 Câu Trắc Nghiệm</p>
                  <p className="text-[10px] mt-1 opacity-60">MC: 0.25đ | TF: Tùy ý | Short: 0.5đ</p>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Thời gian làm bài (Phút)</label>
              <input 
                type="number" 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Part 1: Multiple Choice */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Phần I: Câu hỏi trắc nghiệm ({mcCount} câu)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {Array(mcCount).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 mb-2">CÂU {idx + 1}</p>
                <div className="flex flex-wrap gap-1">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => {
                        const newAns = [...mcAnswers];
                        newAns[idx] = opt;
                        setMcAnswers(newAns);
                      }}
                      className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${mcAnswers[idx] === opt ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: True/False */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
            Phần II: Câu hỏi đúng/sai (4 câu)
          </h3>
          <div className="space-y-4">
            {Array(tfCount).fill(0).map((_, qIdx) => (
              <div key={qIdx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-400 w-16">Câu {qIdx + 1}</span>
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(subIdx => (
                      <div key={subIdx} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] text-slate-500">Ý {subIdx}</span>
                        <div className="flex bg-slate-900 rounded-lg p-1 overflow-hidden border border-white/5">
                          <button 
                            onClick={() => {
                              const newTf = [...tfAnswers];
                              newTf[qIdx][subIdx-1] = true;
                              setTfAnswers(newTf);
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded ${tfAnswers[qIdx][subIdx-1] === true ? 'bg-green-500 text-white' : 'text-slate-500'}`}
                          >
                            Đúng
                          </button>
                          <button 
                            onClick={() => {
                              const newTf = [...tfAnswers];
                              newTf[qIdx][subIdx-1] = false;
                              setTfAnswers(newTf);
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded ${tfAnswers[qIdx][subIdx-1] === false ? 'bg-red-500 text-white' : 'text-slate-500'}`}
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

        {/* Part 3: Short Answer */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
            Phần III: Câu hỏi trả lời ngắn ({shortCount} câu)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(shortCount).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Đáp án câu {idx + 1}</p>
                <input 
                  type="text" 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Nhập đáp án chuẩn..."
                  value={shortAnswers[idx]}
                  onChange={(e) => {
                    const newShort = [...shortAnswers];
                    newShort[idx] = e.target.value;
                    setShortAnswers(newShort);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
