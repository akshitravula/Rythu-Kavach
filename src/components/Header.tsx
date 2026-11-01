'use client';

import React from 'react';
import { Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { UserCheck, Languages, Plus, RotateCcw, LogOut } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  officerRole: 'MAO' | 'MRO' | 'COLLECTOR';
  onRoleChange: (role: 'MAO' | 'MRO' | 'COLLECTOR') => void;
  onOpenNewClaimModal: () => void;
  onResetData: () => void;
  onLogout?: () => void;
  officerEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  officerRole,
  onRoleChange,
  onOpenNewClaimModal,
  onResetData,
  onLogout,
  officerEmail
}) => {
  const t = translations[lang];

  return (
    <header className="bg-[#0b1c36] text-white border-b border-[#1c355e] sticky top-0 z-40 shadow-sm">
      {/* Top institutional strip */}
      <div className="bg-[#071326] px-4 py-1 text-[11px] border-b border-[#152a4a] text-slate-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="tracking-wide">{t.govtLabel}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-slate-400 font-mono text-[10px]">
              SDRF / NDRF DISASTER ASSISTANCE PORTAL
            </span>
            <button
              onClick={onResetData}
              title={t.resetDemo}
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span className="text-[11px]">{t.resetDemo}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Portal Identity */}
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{t.portalTitle}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#162f59] text-blue-200 border border-[#2b4e85]">
                  {lang === 'te' ? 'అధికారిక వేదిక' : 'Official Portal'}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              {t.portalSubtitle}
            </p>
          </div>

          {/* Controls: Role selector, Language toggle, New Claim simulation */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Officer Role Switcher */}
            <div className="flex items-center bg-[#13284a] rounded-md px-2 py-1 border border-[#203f70] text-xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-300 mr-1.5" />
              <select
                value={officerRole}
                onChange={(e) => onRoleChange(e.target.value as 'MAO' | 'MRO' | 'COLLECTOR')}
                className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer pr-1 text-xs"
                aria-label={t.roleSelectorLabel}
              >
                <option value="MAO" className="bg-[#0b1c36] text-white">{t.roleMao}</option>
                <option value="MRO" className="bg-[#0b1c36] text-white">{t.roleMro}</option>
                <option value="COLLECTOR" className="bg-[#0b1c36] text-white">{t.roleCollector}</option>
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#13284a] rounded-md p-0.5 border border-[#203f70] text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <div className="flex space-x-0.5">
                <button
                  onClick={() => onLanguageChange('te')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    lang === 'te'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  తెలుగు
                </button>
                <button
                  onClick={() => onLanguageChange('en')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    lang === 'en'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => onLanguageChange('hi')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    lang === 'hi'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Ingest / Test Claim Action */}
            <button
              onClick={onOpenNewClaimModal}
              className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-600 text-white font-medium text-xs px-3 py-1.5 rounded-md border border-blue-500/50 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.demoNewClaim}</span>
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title={t.logoutBtn}
                className="flex items-center space-x-1 bg-white/10 hover:bg-rose-900/60 text-slate-200 hover:text-white font-medium text-xs px-2.5 py-1.5 rounded-md border border-white/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logoutBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
