'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatUI from '@/components/ChatUI';
import HafalanUI from '@/components/HafalanUI';
import UploadUI from '@/components/UploadUI';
import PanduanDisclaimerUI from '@/components/PanduanDisclaimerUI';
import ResearchModal from '@/components/ResearchModal';
import { ActiveModule } from '@/lib/types';
import type { AiProviderStatus } from '@/lib/ai-provider';

const moduleLabels: Record<ActiveModule, string> = {
  'kaji-kitab': 'Kaji Kitab & Turats (Rujukan Sanad & Matan)',
  'hafalan': "Muraja'ah Hafalan Al-Qur'an",
  'upload': 'Korpus Literatur Kitab (Knowledge Base RAG)',
  'panduan': 'Panduan Sistem, Knowledge Base & Disclaimer',
};

export default function HomePage() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('kaji-kitab');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [researchModalOpen, setResearchModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiProviderStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/ai-status', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((status: AiProviderStatus | null) => {
        if (!cancelled) setAiStatus(status);
      })
      .catch(() => {
        if (!cancelled) setAiStatus(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 h-full h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-row islamic-pattern-bg">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Header
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          activeModuleLabel={moduleLabels[activeModule]}
          onOpenResearchModal={() => setResearchModalOpen(true)}
          aiStatus={aiStatus}
        />

        {/* Module Content with robust scroll containers */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <div className={`h-full w-full flex-1 flex flex-col min-h-0 ${activeModule === 'kaji-kitab' ? '' : 'hidden'}`}>
            <ChatUI onAiStatusChange={setAiStatus} />
          </div>
          {activeModule === 'hafalan' && (
            <div className="h-full w-full flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <HafalanUI />
            </div>
          )}
          {activeModule === 'upload' && (
            <div className="h-full w-full flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <UploadUI />
            </div>
          )}
          {activeModule === 'panduan' && (
            <div className="h-full w-full flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <PanduanDisclaimerUI />
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Research & Architecture Modal */}
      <ResearchModal
        isOpen={researchModalOpen}
        onClose={() => setResearchModalOpen(false)}
      />
    </div>
  );
}
