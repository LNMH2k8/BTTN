
import React, { useState, useEffect } from 'react';
import { User, Quiz, Submission, QuizCategory, AppState } from './types';
import { LOCAL_STORAGE_KEY, INITIAL_DATA } from './constants';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import QuizTaker from './components/QuizTaker';
import QuizEditor from './components/QuizEditor';
import Navbar from './components/Navbar';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lbfwcacpkrsjdugamafx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZndjYWNwa3JzamR1Z2FtYWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NjE5NjIsImV4cCI6MjA4MzQzNzk2Mn0.2rT0VmBLNc50pH23v91neMlNVuuuiQVM1rrZk7z9i3w'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      currentUser: null,
      quizzes: [],
      categories: INITIAL_DATA.CATEGORIES,
      submissions: [],
      users: [INITIAL_DATA.ADMIN as User]
    };
  });

  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Thử kết nối và lấy dữ liệu
      const { data: quizzesData, error: qErr } = await supabase.from('quizzes').select('*');
      const { data: subsData, error: sErr } = await supabase.from('submissions').select('*');
      const { data: usersData, error: uErr } = await supabase.from('users').select('*');
      const { data: catsData, error: cErr } = await supabase.from('categories').select('*');

      if (qErr || sErr || uErr || cErr) {
        const msg = qErr?.message || sErr?.message || uErr?.message || cErr?.message;
        if (msg?.includes('relation') || msg?.includes('does not exist')) {
          throw new Error("DATABASE_NOT_READY");
        }
        console.warn("Lỗi nhẹ khi tải DB:", msg);
      }

      setState(prev => ({
        ...prev,
        quizzes: (quizzesData as any[])?.map(q => ({
          id: q.id,
          title: q.title,
          categoryId: q.category_id,
          type: q.type,
          timeLimit: q.time_limit,
          createdAt: Number(q.created_at),
          multipleChoiceAnswers: q.mc_answers,
          trueFalseAnswers: q.tf_answers,
          shortAnswers: q.short_answers
        })) || [],
        submissions: (subsData as any[])?.map(s => ({
          id: s.id,
          quizId: s.quiz_id,
          userId: s.user_id,
          username: s.username,
          score: s.score,
          timestamp: Number(s.timestamp),
          answers: s.answers
        })) || [],
        users: [INITIAL_DATA.ADMIN as User, ...((usersData as User[]) || []).filter(u => u.username !== 'admin')],
        categories: (catsData && catsData.length > 0) ? catsData as QuizCategory[] : prev.categories
      }));
      setDbError(null);
    } catch (error: any) {
      console.error("Lỗi khởi tạo:", error);
      setDbError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleLogin = (user: User) => setState(prev => ({ ...prev, currentUser: user }));
  const handleLogout = () => { setActiveQuizId(null); setIsEditing(false); setState(prev => ({ ...prev, currentUser: null })); };

  const addQuiz = async (quiz: Quiz) => {
    const { error } = await supabase.from('quizzes').insert([{
      id: quiz.id,
      title: quiz.title,
      category_id: quiz.categoryId,
      type: quiz.type,
      time_limit: quiz.timeLimit,
      created_at: quiz.createdAt,
      mc_answers: quiz.multipleChoiceAnswers,
      tf_answers: quiz.trueFalseAnswers,
      short_answers: quiz.shortAnswers
    }]);
    if (error) return alert("Lỗi: " + error.message);
    alert("Lưu thành công! Mã phòng của bạn là: " + quiz.id);
    setState(prev => ({ ...prev, quizzes: [...prev.quizzes, quiz] }));
    setIsEditing(false);
  };

  const addCategory = async (name: string) => {
    const newCat = { id: Math.random().toString(36).substr(2, 9), name: name.toUpperCase() };
    const { error } = await supabase.from('categories').insert([newCat]);
    if (error) return alert("Lỗi: " + error.message);
    setState(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
  };

  const handleRegister = async (user: User) => {
    const { error } = await supabase.from('users').insert([user]);
    if (error) return alert("Lỗi: " + error.message);
    setState(prev => ({ ...prev, users: [...prev.users, user] }));
  };

  const handleSubmission = async (sub: Submission) => {
    const { error } = await supabase.from('submissions').insert([{
      id: sub.id,
      quiz_id: sub.quizId,
      user_id: sub.userId,
      username: sub.username,
      score: sub.score,
      timestamp: sub.timestamp,
      answers: sub.answers
    }]);
    if (error) return alert("Lỗi: " + error.message);
    setState(prev => ({ ...prev, submissions: [...prev.submissions, sub] }));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-bold gap-6 bg-[#020617]">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(79,70,229,0.3)]"></div>
      <div className="text-center">
        <h2 className="text-xl mb-2 tracking-widest uppercase">QUIZ MODERN</h2>
        <p className="text-slate-500 font-normal animate-pulse">Đang thiết lập hệ thống...</p>
      </div>
    </div>
  );

  if (dbError === "DATABASE_NOT_READY") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617]">
        <div className="max-w-2xl w-full glass p-10 rounded-[2.5rem] border-red-500/20 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Database Chưa Sẵn Sàng</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Hệ thống phát hiện các bảng dữ liệu chưa tồn tại trên Supabase. Vui lòng chạy đoạn mã SQL trong file README.md vào SQL Editor của Supabase.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            Tôi đã chạy SQL, Thử lại ngay!
          </button>
        </div>
      </div>
    );
  }

  if (!state.currentUser) {
    return <Auth onLogin={handleLogin} users={state.users} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen pb-12 animate-fadeIn">
      <Navbar user={state.currentUser} onLogout={handleLogout} onHome={() => { setActiveQuizId(null); setIsEditing(false); }} />
      <main className="container mx-auto px-4 mt-8">
        {activeQuizId ? (
          <QuizTaker 
            quiz={state.quizzes.find(q => q.id === activeQuizId)!} 
            user={state.currentUser} 
            submissions={state.submissions} 
            onSubmit={handleSubmission} 
            onCancel={() => setActiveQuizId(null)} 
          />
        ) : isEditing ? (
          <QuizEditor categories={state.categories} onSave={addQuiz} onCancel={() => setIsEditing(false)} />
        ) : state.currentUser.role === 'admin' ? (
          <AdminDashboard state={state} onCreateQuiz={() => setIsEditing(true)} onAddCategory={addCategory} />
        ) : (
          <UserDashboard state={state} onStartQuiz={(id) => setActiveQuizId(id)} />
        )}
      </main>
    </div>
  );
};

export default App;
