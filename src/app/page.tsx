'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatUI from '@/components/ChatUI';
import HafalanUI from '@/components/HafalanUI';
import UploadUI from '@/components/UploadUI';
import ResearchModal from '@/components/ResearchModal';
import { ActiveModule } from '@/lib/types';
import type { AiProviderStatus } from '@/lib/ai-provider';

const moduleLabels: Record<ActiveModule, string> = {
  'kaji-kitab': 'Kaji Kitab — RAG & Multimodal Bot',
  'hafalan': "Simulasi Hafalan Al-Qur'an",
  'upload': 'Panel Unggah Dokumen Kitab (Knowledge Base RAG)',
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
    <div className="flex h-screen overflow-hidden islamic-pattern-bg">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          activeModuleLabel={moduleLabels[activeModule]}
          onOpenResearchModal={() => setResearchModalOpen(true)}
          aiStatus={aiStatus}
        />

        {/* Module Content */}
        <main className="flex-1 overflow-hidden">
          <div className={`h-full ${activeModule === 'kaji-kitab' ? '' : 'hidden'}`}>
            <ChatUI onAiStatusChange={setAiStatus} />
          </div>
          {activeModule === 'hafalan' && <HafalanUI />}
          {activeModule === 'upload' && <UploadUI />}
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
