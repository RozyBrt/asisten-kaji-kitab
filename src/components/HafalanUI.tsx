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
      <div className="flex items-center justify-center min-h-full p-4 sm:p-6 animate-fade-in pb-16">
        <div className="max-w-md w-full text-center">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-xs border
            ${isExcellent ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : isGood ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-rose-50 border-rose-200 text-rose-800'}
          `}>
            {isExcellent ? (
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004 0V9.75m-5.004 0V9.75m5.004 0a3 3 0 0 0-3-3m-2.004 3a3 3 0 0 1 3-3m0 0a3 3 0 0 1 3 3v3.75m-6-3.75a3 3 0 0 0-3 3v3.75" />
              </svg>
            ) : isGood ? (
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.707-1.5 1.5 1.5m0-6-1.5 1.5" />
              </svg>
            ) : (
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
            {isExcellent ? 'Masya Allah, Sangat Baik!' : isGood ? 'Alhamdulillah, Terus Tingkatkan!' : 'Tetap Istiqamah & Muraja`ah!'}
          </h2>
          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            {isExcellent
              ? 'Hafalan Anda terjaga dengan baik. Lanjutkan muraja`ah berkala agar mutqin.'
              : isGood
              ? 'Hasil latihan cukup baik. Tingkatkan muraja`ah pada ayat-ayat mutasyabihat.'
              : 'Jangan berkecil hati. Ulangi sesi latihan dan perbanyak membaca mushaf.'}
          </p>

          {/* Score circle */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-5">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="60" fill="none"
                stroke={isExcellent ? '#047857' : isGood ? '#b45309' : '#e11d48'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 377} 377`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">{percentage}%</span>
              <span className="text-[11px] text-slate-500 font-medium">{score}/{totalAnswered} benar</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={startSession}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl
                         font-semibold text-xs shadow-xs transition-colors"
            >
              Ulangi Sesi
            </button>
            <button
              onClick={() => { setIsActive(false); setShowResult(false); }}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl
                         font-semibold text-xs transition-colors border border-slate-200"
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
      <div className="flex items-center justify-center min-h-full p-4 sm:p-6 animate-fade-in pb-16">
        <div className="max-w-lg w-full text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-emerald-800 text-amber-200 border border-emerald-900/30 flex items-center justify-center mb-4 sm:mb-5 shadow-xs">
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2 tracking-tight">
            Muraja&apos;ah &amp; Simulasi Hafalan Al-Qur&apos;an
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 sm:mb-7 leading-relaxed">
            Perkuat ingatan hafalan ayat dengan evaluasi interaktif sambung ayat, tebak nama surah, 
            dan pelengkap lafal matan ayat Al-Qur&apos;an.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-6 sm:mb-8 text-left">
            {[
              { title: 'Sambung Ayat', desc: 'Melanjutkan ayat yang terpotong' },
              { title: 'Tebak Surah', desc: 'Identifikasi asal surah dari potongan ayat' },
              { title: 'Isi Lanjutan', desc: 'Melengkapi kata yang terlewatkan' },
            ].map((feature, idx) => (
              <div key={idx} className="p-3 sm:p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block mb-0.5">
                  Modul 0{idx + 1}
                </span>
                <p className="text-xs font-bold text-slate-900 mb-0.5">{feature.title}</p>
                <p className="text-[11px] text-slate-500 leading-snug">{feature.desc}</p>
              </div>
            ))}
          </div>

          <button
            id="btn-start-hafalan"
            onClick={startSession}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Mulai Sesi Muraja&apos;ah (5 Soal)
          </button>
        </div>
      </div>
    );
  }

  // --- Quiz Question Screen ---
  return (
    <div className="min-h-full w-full flex flex-col p-3 sm:p-4 lg:p-6 pb-20">
      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6 animate-fade-in max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-600">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-700">Benar: {score}</span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-500">Salah: {totalAnswered - score}</span>
          </div>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-700 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div className="w-full animate-slide-up" key={currentQ.id}>
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-slate-200">
              {currentQ.type === 'sambung-ayat' ? 'Sambung Ayat' : currentQ.type === 'tebak-surah' ? 'Tebak Surah' : 'Isi Lanjutan'}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500">
              Surah {currentQ.surahName} &bull; {currentQ.ayahRange}
            </span>
          </div>

          {/* Question */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 mb-3 sm:mb-4 shadow-xs">
            <p className="text-xs text-slate-600 mb-2 sm:mb-3">{currentQ.questionId}</p>
            <div className="verse-highlight bg-amber-50/40 border border-amber-200/80 rounded-xl p-3 sm:p-4">
              <p className="arabic-text text-lg sm:text-2xl text-slate-900 font-bold leading-loose text-right font-serif">
                {currentQ.questionAr}
              </p>
            </div>
          </div>

          {/* Options (Kompak di HP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mb-3 sm:mb-4">
            {currentQ.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.correctAnswer;
              let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40';

              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-50 border-rose-500 text-rose-900';
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
                    p-2.5 sm:p-3.5 rounded-xl border text-right transition-all
                    ${optionStyle}
                    ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="arabic-text text-base sm:text-lg font-serif">{option}</span>
                  </div>
                  {isAnswered && isCorrect && (
                    <div className="mt-1 text-left flex items-center gap-1 text-[10px] font-sans font-bold text-emerald-700">
                      <svg className="w-3 h-3 text-emerald-700" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Jawaban Benar
                    </div>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <div className="mt-1 text-left flex items-center gap-1 text-[10px] font-sans font-bold text-rose-600">
                      <svg className="w-3 h-3 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Jawaban Kurang Tepat
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {isAnswered && (
            <div className="animate-slide-up space-y-2.5 sm:space-y-3">
              {/* Full correct answer */}
              {currentQ.correctAnswerAr && (
                <div className="p-3 sm:p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Kutipan Lengkap Ayat</p>
                  <p className="arabic-text text-slate-900 font-serif text-base sm:text-lg leading-loose text-right">{currentQ.correctAnswerAr}</p>
                </div>
              )}

              {/* Explanation */}
              {currentQ.explanation && (
                <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tafsir &amp; Penjelasan</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              <button
                id="btn-next-question"
                onClick={nextQuestion}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl
                           font-semibold text-xs shadow-xs transition-colors
                           flex items-center justify-center gap-2"
              >
                {currentIndex + 1 >= questions.length ? 'Lihat Hasil Akhir' : 'Lanjut ke Soal Berikutnya'}
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
