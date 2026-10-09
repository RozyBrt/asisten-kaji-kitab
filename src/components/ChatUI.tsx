'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, KitabSource } from '@/lib/types';
import { quickPrompts } from '@/lib/mock-data';
import { SAMPLE_KITAB_IMAGE } from '@/lib/sample-kitab';
import type { AiProviderStatus } from '@/lib/ai-provider';

interface ChatUIProps {
  onAiStatusChange: (status: AiProviderStatus) => void;
}

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Source citation card
function SourceCard({ source }: { source: KitabSource }) {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl hover:shadow-md transition-all duration-200 card-hover">
      <div className="p-1.5 bg-emerald-600 rounded-lg flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-emerald-800 truncate">{source.kitabName}</p>
        <p className="text-[11px] text-emerald-600">{source.bab}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Hal. {source.halaman}</p>
      </div>
    </div>
  );
}

// Typing indicator
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-sm">🤖</span>
      </div>
      <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="ml-2 text-xs text-slate-400">Sedang mengkaji matan & referensi...</span>
        </div>
      </div>
    </div>
  );
}

// Chat bubble
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${message.content}\n\n${message.arabicText ? `[Matan Arab]: ${message.arabicText}\n` : ''}${
      message.sources ? `[Rujukan]: ` + message.sources.map(s => `${s.kitabName} (${s.bab}, hal. ${s.halaman})`).join(', ') : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (typeof window === 'undefined') return;
    
    let formattedContent = message.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
      
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">Hasil Kajian AI</h2>
        <div style="margin-top: 20px; line-height: 1.6; font-size: 14px;">
          ${formattedContent}
        </div>
        ${message.arabicText ? `
          <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;">
            <strong style="color: #047857; font-size: 12px;">MATAN ARAB / HASIL OCR:</strong><br/><br/>
            <div style="font-size: 22px; font-family: 'Amiri', serif; direction: rtl; text-align: right; line-height: 2;">${message.arabicText}</div>
          </div>
        ` : ''}
        ${message.sources && message.sources.length > 0 ? `
          <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            <strong style="color: #047857; font-size: 12px;">SUMBER RUJUKAN KITAB:</strong>
            <ul style="margin-top: 10px; font-size: 13px;">
              ${message.sources.map(s => `<li style="margin-bottom: 5px;"><strong>${s.kitabName}</strong> &mdash; ${s.bab}, Halaman ${s.halaman}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <div style="margin-top: 40px; font-size: 10px; color: #94a3b8; text-align: center;">
          Diunduh dari Asisten AI Kaji Kitab & Turats &bull; ${new Date().toLocaleString('id-ID')}
        </div>
      </div>
    `;

    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 0.4,
        filename: 'Hasil-Kajian-' + message.id.substring(0, 6) + '.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf.default().set(opt).from(htmlContent).save();
    }).catch(err => console.error('Error loading html2pdf:', err));
  };

  const handleSpeakArabic = () => {
    if (!message.arabicText || typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id={`chat-bubble-${message.id}`} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-up bg-white p-2 rounded-2xl`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
        ${isUser
          ? 'bg-gradient-to-br from-slate-600 to-slate-800'
          : 'bg-gradient-to-br from-emerald-500 to-emerald-700'
        }
      `}>
        <span className="text-sm">{isUser ? '👤' : '🤖'}</span>
      </div>

      {/* Content */}
      <div className={`max-w-[88%] lg:max-w-[78%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* User uploaded image */}
        {isUser && message.image && (
          <div className="rounded-2xl overflow-hidden border border-emerald-200/60 shadow-md bg-white p-1">
            <img
              src={message.image}
              alt="Halaman kitab terlampir"
              className="max-w-[320px] max-h-[220px] rounded-xl object-contain bg-amber-50/40"
            />
            <p className="text-[10px] text-emerald-700 font-semibold px-2 py-1 flex items-center gap-1">
              <span>📷</span> Lampiran Foto Halaman Kitab
            </p>
          </div>
        )}

        {/* Text bubble */}
        <div className={`
          px-4 py-3 rounded-2xl shadow-sm relative group
          ${isUser
            ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-sm'
            : 'bg-white border border-emerald-100 text-slate-700 rounded-tl-sm'
          }
        `}>
          <div className="text-sm leading-relaxed prose-chat"
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br/>')
                .replace(/^(\d+)\.\s/gm, '<span class="font-semibold text-emerald-700">$1.</span> ')
            }}
          />

          {/* Action buttons (Bot response) */}
          {!isUser && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-[11px] text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-1"
                title="Salin penjelasan"
              >
                {copied ? '✓ Tersalin' : '📋 Salin Rangkuman'}
              </button>
              <button
                onClick={handleDownloadPdf}
                className="text-[11px] text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-1"
                title="Unduh PDF Kajian"
              >
                ?? Unduh PDF
              </button>
            </div>
          )}
        </div>

        {!isUser && message.isOcr && (
          <span className="inline-flex text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            Hasil OCR
          </span>
        )}

        {/* Arabic text block */}
        {!isUser && message.arabicText && (
          <div className="verse-highlight">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                </svg>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Hasil Transkripsi OCR / Matan Arab
                </span>
              </div>
              <button
                onClick={handleSpeakArabic}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1"
                title="Dengarkan lafal teks Arab"
              >
                {isSpeaking ? '⏹ Hentikan' : '🔊 Baca Lafal'}
              </button>
            </div>
            <p className="arabic-text text-slate-800">{message.arabicText}</p>
          </div>
        )}

        {/* Source citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Kartu Sumber Rujukan / Sitasi Kitab
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
        <p className={`text-[10px] ${isUser ? 'text-right text-slate-400' : 'text-slate-400'} mt-1`}>
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

  const loadSampleImage = () => {
    setImagePreview(SAMPLE_KITAB_IMAGE);
    setImageBase64(SAMPLE_KITAB_IMAGE);
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
      content: messageText || 'Tolong transkripsi dan berikan syarah untuk lembar kitab ini.',
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
        content: data.reply || 'Maaf, tidak dapat memproses permintaan.',
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
          content: 'Maaf, terjadi kesalahan saat menghubungi server. Silakan periksa koneksi Anda.',
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
    <div className="flex flex-col h-full">
      {/* Top action bar when in conversation */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-b border-emerald-100/70 bg-white/60 backdrop-blur flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Kajian Aktif ({messages.length} pesan)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearChat}
              aria-label="Reset seluruh percakapan"
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 rounded"
            >
              Reset Chat
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scroll p-4 lg:p-6 space-y-5">
        {messages.length === 0 ? (
          /* Welcome / Empty State */
          <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-4 shadow-xl shadow-emerald-200 animate-float">
              <span className="text-3xl">📖</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold gradient-text mb-2">
              Assalamu&apos;alaikum! Ahlan wa Sahlan
            </h2>
            <p className="text-xs lg:text-sm text-slate-600 max-w-lg mb-6 leading-relaxed">
              Bot AI Pembantu Kaji Kitab Turats & Penelusuran Sanad Referensi. Anda dapat mengajukan pertanyaan teks, mengunggah foto halaman kitab untuk OCR & Syarah, atau mencoba simulasi contoh di bawah.
            </p>

            {/* Showcase 1-Click OCR Demo Button */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-emerald-50 border border-emerald-200 shadow-sm max-w-lg w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span>✨</span> Fitur Unggulan Multimodal OCR
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-full">
                  Demo 1-Klik
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 text-left leading-normal">
                Uji langsung kemampuan AI membaca foto fisik naskah kitab kuning (Matan Furu&apos;dhul Wudhu&apos;) dan menghasilkan syarah terstruktur beserta sitasi.
              </p>
              <button
                id="btn-demo-multimodal"
                onClick={() => sendMessage('Tolong transkripsi dan jelaskan isi halaman kitab ini.', SAMPLE_KITAB_IMAGE)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 btn-press"
              >
                <span>📷</span> Uji Analisis Foto Kitab (Demo Multimodal)
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="w-full max-w-lg">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Contoh Pertanyaan Cepat (Fikih & Akhlaq)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    id={`quick-prompt-${idx}`}
                    onClick={() => sendMessage(prompt.label)}
                    className="flex items-center gap-2 px-3 py-2.5 bg-white border border-emerald-100 rounded-xl text-left 
                              hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md
                              transition-all duration-200 group btn-press"
                  >
                    <span className="text-lg">{prompt.icon}</span>
                    <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700 leading-tight">
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
      <div className="border-t border-emerald-100 bg-white/80 backdrop-blur-lg p-3 lg:p-4">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 flex items-start gap-3 animate-slide-up p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-emerald-300 shadow-sm bg-white"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center
                           text-xs hover:bg-rose-600 transition-colors shadow-md"
                title="Hapus foto"
              >
                ×
              </button>
            </div>
            <div className="py-1">
              <p className="text-xs font-bold text-emerald-800">Foto Halaman Kitab Siap Dikirim</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                AI akan melakukan ekstraksi teks Arab (OCR) dan menyusun syarah penjelasannya.
              </p>
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <button
            id="btn-attach-image"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 btn-press flex-shrink-0"
            title="Unggah foto lembar kitab"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </button>

          {/* Quick Load Sample Kitab Button */}
          <button
            onClick={loadSampleImage}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors btn-press flex-shrink-0"
            title="Gunakan sampel naskah untuk demonstrasi"
          >
            <span>📜</span> Sampel Naskah
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
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
              placeholder="Tanyakan materi fikih, hadits, atau kirim foto kitab..."
              rows={1}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl
                         text-sm text-slate-700 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                         resize-none transition-all duration-200"
            />
          </div>

          {/* Send Button */}
          <button
            id="btn-send-message"
            onClick={() => sendMessage()}
            disabled={isLoading || (!inputText.trim() && !imageBase64)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white
                       hover:from-emerald-700 hover:to-emerald-800
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-md shadow-emerald-200 btn-press flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>

        {/* Quick Prompts (when in conversation) */}
        {messages.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
            <span className="text-[10px] text-slate-400 flex-shrink-0">Cepat:</span>
            {quickPrompts.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt.label)}
                disabled={isLoading}
                className="flex-shrink-0 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] 
                           text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 btn-press"
              >
                {prompt.icon} {prompt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


