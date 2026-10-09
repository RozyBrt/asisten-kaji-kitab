'use client';

import React, { useState, useCallback } from 'react';
import { mockHafalanQuestions } from '@/lib/mock-data';
import { HafalanQuestion } from '@/lib/types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HafalanUI() {
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState<HafalanQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startSession = useCallback(() => {
    const shuffled = shuffleArray(mockHafalanQuestions).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTotalAnswered(0);
    setShowResult(false);
    setIsActive(true);
  }, []);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setTotalAnswered(prev => prev + 1);
    if (answer === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setShowResult(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const currentQ = questions[currentIndex];

  // --- Result Screen ---
  if (showResult) {
    const percentage = Math.round((score / totalAnswered) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="flex items-center justify-center h-full p-6 animate-fade-in">
        <div className="max-w-md w-full text-center">
          <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-xl
            ${isExcellent ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200' : isGood ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-200' : 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-200'}
          `}>
            <span className="text-5xl">{isExcellent ? '🏆' : isGood ? '👏' : '💪'}</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {isExcellent ? 'Masya Allah, Luar Biasa!' : isGood ? 'Bagus, Pertahankan!' : 'Tetap Semangat!'}
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            {isExcellent
              ? 'Hafalan Anda sangat baik. Teruskan muraja\'ah agar semakin kuat!'
              : isGood
              ? 'Sudah cukup baik, terus tingkatkan dengan muraja\'ah rutin.'
              : 'Jangan menyerah! Ulangi sesi ini dan perbanyak muraja\'ah.'}
          </p>

          {/* Score circle */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="60" fill="none"
                stroke={isExcellent ? '#059669' : isGood ? '#d97706' : '#e11d48'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 377} 377`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
              <span className="text-xs text-slate-500">{score}/{totalAnswered} benar</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={startSession}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl
                         font-semibold text-sm hover:from-emerald-700 hover:to-emerald-800
                         shadow-lg shadow-emerald-200 transition-all btn-press"
            >
              Ulangi Sesi
            </button>
            <button
              onClick={() => { setIsActive(false); setShowResult(false); }}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm
                         hover:bg-slate-200 transition-all btn-press"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Welcome / Start Screen ---
  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-full p-6 animate-fade-in">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center mb-6 shadow-xl shadow-emerald-200 animate-float">
            <span className="text-4xl">🕌</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold gradient-text mb-2">
            Simulasi Hafalan Al-Qur&apos;an
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            Uji dan perkuat hafalan Al-Qur&apos;an Anda dengan kuis interaktif sambung ayat, tebak surah, 
            dan isi lanjutan. Setiap sesi berisi 5 soal acak dari bank demo 8 soal pilihan surah-surah Juz 30, bukan kurikulum Juz 30 lengkap.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: '📝', title: 'Sambung Ayat', desc: 'Lanjutkan ayat yang terputus' },
              { icon: '🔍', title: 'Tebak Surah', desc: 'Identifikasi asal surah' },
              { icon: '✍️', title: 'Isi Lanjutan', desc: 'Lengkapi kata yang hilang' },
            ].map((feature, idx) => (
              <div key={idx} className="p-4 bg-white border border-emerald-100 rounded-xl card-hover">
                <span className="text-2xl mb-2 block">{feature.icon}</span>
                <p className="text-xs font-bold text-slate-700">{feature.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>

          <button
            id="btn-start-hafalan"
            onClick={startSession}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl
                       font-semibold text-sm hover:from-emerald-700 hover:to-emerald-800
                       shadow-lg shadow-emerald-200 transition-all btn-press
                       flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
            Mulai Sesi Hafalan
          </button>
        </div>
      </div>
    );
  }

  // --- Quiz Question Screen ---
  return (
    <div className="flex flex-col h-full p-4 lg:p-6">
      {/* Progress Bar */}
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500">
            Soal {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600">✓ {score}</span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs font-semibold text-rose-500">✗ {totalAnswered - score}</span>
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div className="w-full animate-slide-up" key={currentQ.id}>
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
              {currentQ.type === 'sambung-ayat' ? '📝 Sambung Ayat' : currentQ.type === 'tebak-surah' ? '🔍 Tebak Surah' : '✍️ Isi Lanjutan'}
            </span>
            <span className="text-xs text-slate-400">
              {currentQ.surahName} • {currentQ.ayahRange}
            </span>
          </div>

          {/* Question */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 mb-6 shadow-sm">
            <p className="text-sm text-slate-600 mb-4">{currentQ.questionId}</p>
            <div className="verse-highlight">
              <p className="arabic-text text-xl lg:text-2xl text-slate-800 font-bold">
                {currentQ.questionAr}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQ.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.correctAnswer;
              let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50';

              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-200';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  id={`option-${idx}`}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`
                    p-4 rounded-xl border-2 text-right font-arabic transition-all duration-300 btn-press
                    ${optionStyle}
                    ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="arabic-text text-lg">{option}</span>
                  </div>
                  {isAnswered && isCorrect && (
                    <div className="mt-1 text-left">
                      <span className="text-[10px] font-sans font-bold text-emerald-600">✓ Benar</span>
                    </div>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <div className="mt-1 text-left">
                      <span className="text-[10px] font-sans font-bold text-rose-500">✗ Salah</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {isAnswered && (
            <div className="animate-slide-up">
              {/* Full correct answer */}
              {currentQ.correctAnswerAr && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Ayat Lengkap</p>
                  <p className="arabic-text text-emerald-800">{currentQ.correctAnswerAr}</p>
                </div>
              )}

              {/* Explanation */}
              {currentQ.explanation && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Penjelasan</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              <button
                id="btn-next-question"
                onClick={nextQuestion}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl
                           font-semibold text-sm hover:from-emerald-700 hover:to-emerald-800
                           shadow-lg shadow-emerald-200 transition-all btn-press
                           flex items-center justify-center gap-2"
              >
                {currentIndex + 1 >= questions.length ? 'Lihat Hasil' : 'Soal Berikutnya'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
