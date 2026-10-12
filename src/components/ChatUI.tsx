'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, KitabSource } from '@/lib/types';
import { quickPrompts } from '@/lib/mock-data';
import type { AiProviderStatus } from '@/lib/ai-provider';

interface ChatUIProps {
  onAiStatusChange: (status: AiProviderStatus) => void;
}

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Source citation card (Rujukan Kitab)
function SourceCard({ source }: { source: KitabSource }) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 sm:p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all">
      <div className="p-1.5 bg-emerald-800 text-amber-200 rounded-lg flex-shrink-0 mt-0.5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-emerald-950 truncate">{source.kitabName}</p>
        <p className="text-[11px] text-emerald-800 leading-snug">{source.bab}</p>
        {source.halaman && source.halaman !== '-' && source.halaman !== 'Estimasi' && (
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Halaman: {source.halaman}</p>
        )}
      </div>
    </div>
  );
}

// Typing indicator
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3 animate-fade-in">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-800 text-amber-200 flex items-center justify-center flex-shrink-0 shadow-xs">
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse delay-100"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse delay-200"></span>
          <span className="ml-2 text-xs text-slate-500 font-medium">
            Menelusuri naskah &amp; referensi...
          </span>
        </div>
      </div>
    </div>
  );
}

// Chat bubble
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${message.content}\n\n${message.arabicText ? `[Matan Arab]: ${message.arabicText}\n` : ''}${
      message.sources ? `[Rujukan]: ` + message.sources.map(s => `${s.kitabName} (${s.bab}${s.halaman && s.halaman !== '-' ? `, Hal. ${s.halaman}` : ''})`).join(', ') : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (typeof window === 'undefined') return;
    
    const formattedContent = message.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
      
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; line-height: 1.6;">
        <h2 style="color: #065f46; border-bottom: 2px solid #065f46; padding-bottom: 8px; font-size: 18px; margin-bottom: 16px;">
          Rujukan Telaah Kitab &amp; Turats
        </h2>
        <div style="font-size: 14px; margin-bottom: 20px;">
          ${formattedContent}
        </div>
        ${message.arabicText ? `
          <div style="margin-top: 16px; padding: 14px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
            <strong style="color: #065f46; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Matan Arab / Dalil:</strong><br/><br/>
            <div style="font-size: 20px; font-family: 'Amiri', serif; direction: rtl; text-align: right; line-height: 2; color: #0f172a;">${message.arabicText}</div>
          </div>
        ` : ''}
        ${message.sources && message.sources.length > 0 ? `
          <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
            <strong style="color: #065f46; font-size: 11px; text-transform: uppercase;">Sumber Korpus Kitab:</strong>
            <ul style="margin-top: 8px; font-size: 13px; padding-left: 20px;">
              ${message.sources.map(s => `<li style="margin-bottom: 4px;"><strong>${s.kitabName}</strong> &mdash; ${s.bab}${s.halaman && s.halaman !== '-' ? `, Halaman ${s.halaman}` : ''}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <div style="margin-top: 36px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 10px;">
          Asisten Kaji Kitab &amp; Turats &bull; Dicetak pada ${new Date().toLocaleString('id-ID')}
        </div>
      </div>
    `;

    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 0.4,
        filename: 'Kajian-Turats-' + message.id.substring(0, 6) + '.pdf',
        image: { type: 'jpeg' as const, quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in' as const, format: 'a4', orientation: 'portrait' as const }
      };
      html2pdf.default().set(opt).from(htmlContent).save();
    }).catch(err => console.error('Error loading html2pdf:', err));
  };

  return (
    <div id={`chat-bubble-${message.id}`} className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-up`}>
      {/* Avatar */}
      <div className={`
        w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs
        ${isUser
          ? 'bg-slate-800 text-slate-100'
          : 'bg-emerald-800 text-amber-200'
        }
      `}>
        {isUser ? (
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7 0 3.75 3.75 0 0 1 7 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[92%] sm:max-w-[80%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* User uploaded image */}
        {isUser && message.image && (
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white p-1">
            <img
              src={message.image}
              alt="Halaman naskah terlampir"
              className="max-w-[260px] sm:max-w-[320px] max-h-[180px] sm:max-h-[220px] rounded-lg object-contain bg-slate-50"
            />
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium px-2 py-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Lampiran Foto Naskah
            </p>
          </div>
        )}

        {/* Text bubble */}
        <div className={`
          px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-xs relative
          ${isUser
            ? 'bg-emerald-800 text-white rounded-tr-xs'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
          }
        `}>
          <div className="text-xs sm:text-sm leading-relaxed prose-chat"
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br/>')
                .replace(/^(\d+)\.\s/gm, '<span class="font-semibold text-emerald-800">$1.</span> ')
            }}
          />

          {/* Action buttons (Bot response) */}
          {!isUser && (
            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="text-[10px] sm:text-[11px] text-slate-500 hover:text-emerald-800 transition-colors flex items-center gap-1 font-medium"
                title="Salin isi jawaban"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                {copied ? 'Tersalin' : 'Salin Kutipan'}
              </button>

              <button
                onClick={handleDownloadPdf}
                className="text-[10px] sm:text-[11px] text-slate-500 hover:text-emerald-800 transition-colors flex items-center gap-1 font-medium"
                title="Unduh format PDF"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.5V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Unduh PDF
              </button>
            </div>
          )}
        </div>

        {!isUser && message.isOcr && (
          <span className="inline-flex text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
            Hasil OCR Naskah
          </span>
        )}

        {/* Arabic text block */}
        {!isUser && message.arabicText && (
          <div className="verse-highlight bg-amber-50/40 border border-amber-200/80 rounded-xl p-3 sm:p-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-emerald-800" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
              </svg>
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                Matan Arab / Teks Nash
              </span>
            </div>
            <p className="arabic-text text-slate-900 leading-loose text-right text-base sm:text-xl font-serif">
              {message.arabicText}
            </p>
          </div>
        )}

        {/* Source citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-800" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                Kartu Rujukan Korpus Kitab
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((source, idx) => (
                <SourceCard key={idx} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] ${isUser ? 'text-right text-slate-400' : 'text-slate-400'} mt-1 font-medium`}>
          {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default function ChatUI({ onAiStatusChange }: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = async (text?: string, customImage?: string) => {
    const activeImage = customImage || imageBase64;
    const messageText = text || inputText.trim();
    if (!messageText && !activeImage) return;
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: messageText || 'Tolong transkripsi dan berikan syarah untuk lembar naskah kitab ini.',
      timestamp: new Date(),
      image: activeImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    removeImage();
    setIsLoading(true);
    const requestId = ++requestIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          message: userMessage.content,
          image: activeImage || undefined,
          conversationHistory: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (requestId !== requestIdRef.current) return;
      if (data.aiStatus) onAiStatusChange(data.aiStatus as AiProviderStatus);

      const aiMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.reply || 'Maaf, tidak dapat memproses telaah teks ini.',
        timestamp: new Date(),
        arabicText: data.arabicText,
        sources: data.sources,
        isOcr: data.isOcr === true,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      if (requestId === requestIdRef.current) {
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: 'Terjadi kendala saat menghubungi modul telaah naskah. Silakan periksa koneksi atau coba pertanyaan lain.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setMessages([]);
    setInputText('');
    removeImage();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top action bar when in conversation */}
      {messages.length > 0 && (
        <div className="px-3 py-1.5 sm:px-4 sm:py-2 border-b border-slate-200 bg-white flex items-center justify-between">
          <span className="text-[11px] sm:text-xs text-slate-600 font-medium">
            Kajian Aktif ({messages.length} pesan)
          </span>
          <button
            type="button"
            onClick={clearChat}
            aria-label="Bersihkan ruang telaah"
            className="text-[11px] sm:text-xs text-slate-500 hover:text-rose-600 transition-colors px-2 py-1 rounded hover:bg-slate-50"
          >
            Bersihkan
          </button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scroll p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5">
        {messages.length === 0 ? (
          /* Workstation Empty State (Anti-Slop Modern Islamic Scholar Desk) */
          <div className="flex flex-col items-center justify-center min-h-full text-center px-3 py-4 sm:px-4 sm:py-6 animate-fade-in max-w-2xl mx-auto">
            {/* Header Icon */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-800 text-amber-200 border border-emerald-900/30 flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2 tracking-tight">
              Meja Telaah Turats &amp; Penelusuran Sanad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mb-4 sm:mb-6 leading-relaxed">
              Eksplorasi matan, syarah, dan dalil dari korpus kitab klasik (Al-Kawakib Ad-Durriyyah, Fathul Qarib, Safinatun Najah, dan Minhajuth Thalibin).
            </p>

            {/* OCR Vision Card */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-xs max-w-lg w-full text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  Modul Multimodal Vision OCR
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Aktif & Siap Pakai
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mb-2.5 sm:mb-3 leading-relaxed">
                Foto langsung lembar naskah atau kitab kuning fisik Anda. Asisten AI akan mentranskripsi teks Arab matan dan menguraikan syarah penjelasannya.
              </p>
              <button
                id="btn-demo-multimodal"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>📷 Ambil Foto / Unggah Naskah</span>
              </button>
            </div>

            {/* Quick Inquiry Categories */}
            <div className="w-full max-w-lg">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Topik Penelusuran Populer
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    id={`quick-prompt-${idx}`}
                    onClick={() => sendMessage(prompt.label)}
                    className="flex flex-col items-start p-2 sm:p-2.5 bg-white border border-slate-200 rounded-xl text-left 
                              hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-xs
                              transition-all duration-150 group"
                  >
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide mb-1">
                      {prompt.category}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:text-emerald-900 leading-snug">
                      {prompt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}

        {isLoading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-2.5 sm:p-3 lg:p-4">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-2.5 flex items-start gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl animate-slide-up">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Pratinjau naskah"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 bg-white"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-xs transition-colors shadow-xs"
                title="Hapus foto"
              >
                &times;
              </button>
            </div>
            <div className="py-0.5">
              <p className="text-xs font-bold text-slate-800">Foto Naskah Terlampir</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                Sistem akan membaca matan naskah dan mencocokkan dengan basis data syarah.
              </p>
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end gap-1.5 sm:gap-2 max-w-4xl mx-auto w-full">
          {/* Attachment Button */}
          <button
            id="btn-attach-image"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 rounded-lg text-slate-500 hover:text-emerald-800 hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Unggah atau ambil foto lembar kitab untuk OCR & Syarah"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan materi fikih, nahwu, atau ketik masalah kajian..."
              rows={1}
              className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl
                         text-xs sm:text-sm text-slate-800 placeholder-slate-400
                         focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700
                         resize-none transition-colors"
            />
          </div>

          {/* Send Button */}
          <button
            id="btn-send-message"
            onClick={() => sendMessage()}
            disabled={isLoading || (!inputText.trim() && !imageBase64)}
            className="p-2 sm:p-2.5 rounded-xl bg-emerald-800 text-white
                       hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors shadow-xs flex-shrink-0"
            title="Kirim telaah"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>

        {/* Quick Prompts Chip (when in conversation) */}
        {messages.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 max-w-4xl mx-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex-shrink-0">
              Pintas:
            </span>
            {quickPrompts.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt.label)}
                disabled={isLoading}
                className="flex-shrink-0 px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded text-[10px] sm:text-[11px] 
                           text-slate-700 hover:text-emerald-900 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                [{prompt.category}] {prompt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
