'use client';

import React, { useState } from 'react';
import { Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  RotateCw, 
  ArrowRight, 
  Languages, 
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  FileText
} from 'lucide-react';

interface OfficerLoginProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (role: 'MAO' | 'MRO' | 'COLLECTOR', email: string) => void;
}

export const OfficerLogin: React.FC<OfficerLoginProps> = ({
  lang,
  onLanguageChange,
  onLoginSuccess
}) => {
  const t = translations[lang];

  const [selectedRole, setSelectedRole] = useState<'MAO' | 'MRO' | 'COLLECTOR'>('MRO');
  const [officerEmail, setOfficerEmail] = useState('tahsildar.maheshwaram@telangana.gov.in');
  const [password, setPassword] = useState('Officer@2026');
  const [showPassword, setShowPassword] = useState(false);
  
  // NIC Style Math Captcha
  const [captchaNum1, setCaptchaNum1] = useState(8);
  const [captchaNum2, setCaptchaNum2] = useState(5);
  const [captchaInput, setCaptchaInput] = useState('13');
  const [captchaError, setCaptchaError] = useState('');
  const [declared, setDeclared] = useState(true);

  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaInput('');
    setCaptchaError('');
  };

  const handleRoleChange = (role: 'MAO' | 'MRO' | 'COLLECTOR') => {
    setSelectedRole(role);
    if (role === 'MRO') {
      setOfficerEmail('tahsildar.maheshwaram@telangana.gov.in');
      setPassword('Officer@2026');
    } else if (role === 'MAO') {
      setOfficerEmail('mao.maheshwaram@telangana.gov.in');
      setPassword('Officer@2026');
    } else {
      setOfficerEmail('collector.rangareddy@telangana.gov.in');
      setPassword('Collector@2026');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaInput, 10) !== captchaNum1 + captchaNum2) {
      setCaptchaError(lang === 'te' ? 'క్యాప్చా సరిపోలలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Captcha answer incorrect. Please try again.');
      return;
    }
    onLoginSuccess(selectedRole, officerEmail);
  };

  const handleQuickLogin = (role: 'MAO' | 'MRO' | 'COLLECTOR') => {
    handleRoleChange(role);
    const email = role === 'MRO' 
      ? 'tahsildar.maheshwaram@telangana.gov.in' 
      : role === 'MAO' 
      ? 'mao.maheshwaram@telangana.gov.in' 
      : 'collector.rangareddy@telangana.gov.in';
    onLoginSuccess(role, email);
  };

  return (
    <div className="h-screen max-h-screen bg-[#f1f5f9] flex flex-col font-sans overflow-hidden select-none">
      {/* 1. Official State Banner Strip (Compact shrink-0) */}
      <header className="bg-[#071326] px-4 py-1 text-[11px] border-b border-[#152a4a] text-slate-300 shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 font-medium truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
            <span className="tracking-wide truncate">{t.govtLabel}</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <span className="hidden md:inline text-slate-400 font-mono text-[10px]">
              SDRF / NDRF PORTAL
            </span>
            {/* Language Switcher */}
            <div className="flex items-center bg-[#13284a] rounded p-0.5 border border-[#203f70] text-xs">
              <Languages className="w-3 h-3 text-slate-400 ml-1 mr-1" />
              <button
                onClick={() => onLanguageChange('te')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${lang === 'te' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${lang === 'en' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${lang === 'hi' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Portal Brand Bar (Compact shrink-0) */}
      <div className="bg-[#0b1c36] text-white border-b border-[#1c355e] py-2 px-4 shadow-xs shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{t.portalTitle}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#162f59] text-blue-200 border border-[#2b4e85] uppercase">
                  {lang === 'te' ? 'అధికారిక వేదిక' : 'Official Portal'}
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-300 font-normal">
              {t.portalSubtitle}
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200 text-[11px] font-medium">e-Office / NIC SSO</span>
          </div>
        </div>
      </div>

      {/* 3. Main 2-Column Centered Authentication Card (Fits 100% in 1 Viewport) */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Official Sign-In Form (60% width on desktop) */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-700" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                    {t.loginTitle}
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  G.O. Ms No. 17
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-2.5 text-xs">
                {/* Role Switcher Pills */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                    {t.loginRole}
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleRoleChange('MRO')}
                      className={`py-1.5 px-1 text-center rounded border text-[11px] font-semibold transition-all ${
                        selectedRole === 'MRO'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lang === 'te' ? 'తహసీల్దార్' : 'Tahsildar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange('MAO')}
                      className={`py-1.5 px-1 text-center rounded border text-[11px] font-semibold transition-all ${
                        selectedRole === 'MAO'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lang === 'te' ? 'వ్యవసాయ అధికారి' : 'MAO (Agri)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange('COLLECTOR')}
                      className={`py-1.5 px-1 text-center rounded border text-[11px] font-semibold transition-all ${
                        selectedRole === 'COLLECTOR'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lang === 'te' ? 'కలెక్టర్' : 'Collector'}
                    </button>
                  </div>
                </div>

                {/* Officer ID / Email */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                    {t.loginOfficerId}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="email"
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-700 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                    {t.loginPassword}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-blue-700 focus:bg-white focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Security Captcha (Horizontal row) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                    {t.loginCaptcha}
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-200 border border-slate-300 px-2.5 py-1 rounded font-mono font-bold text-slate-800 text-xs tracking-wider">
                      {captchaNum1} + {captchaNum2} = ?
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-1 text-slate-500 hover:text-slate-800"
                      title="Refresh Captcha"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      required
                      placeholder="Ans"
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs font-mono text-center focus:ring-1 focus:ring-blue-700 focus:bg-white focus:outline-none"
                    />
                  </div>
                  {captchaError && (
                    <p className="text-rose-700 text-[10px] font-semibold mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {captchaError}
                    </p>
                  )}
                </div>

                {/* Declaration Checkbox */}
                <div className="pt-0.5">
                  <label className="flex items-start space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={declared}
                      onChange={(e) => setDeclared(e.target.checked)}
                      required
                      className="mt-0.5 rounded text-blue-900"
                    />
                    <span className="text-[10px] text-slate-600 leading-tight">
                      {t.loginDeclaration}
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={!declared}
                  className="w-full py-2 px-3 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{t.loginSubmit}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Reviewer Quick Demo Fast-Track (40% width, side-by-side) */}
          <div className="w-full md:w-80 bg-slate-50/90 border-t md:border-t-0 md:border-l border-slate-200 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-200 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {t.loginQuickDemo}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('MRO')}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-blue-900">
                      Tahsildar / MRO
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5 truncate">
                    tahsildar.maheshwaram@telangana.gov.in
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                    ✓ Final Sanction Authority
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('MAO')}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-blue-900">
                      Mandal Agriculture Officer
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5 truncate">
                    mao.maheshwaram@telangana.gov.in
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
                    ✓ Field & e-Panta Verifier
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('COLLECTOR')}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-blue-900">
                      District Collector
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5 truncate">
                    collector.rangareddy@telangana.gov.in
                  </span>
                  <span className="text-[10px] text-slate-700 font-semibold mt-1 block">
                    ✓ District Oversight
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Regulatory Seal */}
            <div className="pt-3 border-t border-slate-200 mt-2">
              <p className="text-[10px] text-slate-500 leading-tight">
                {t.loginDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Official Footer Strip (Compact shrink-0) */}
      <footer className="bg-slate-200/80 px-4 py-1 text-[10px] text-slate-600 text-center border-t border-slate-300 shrink-0">
        Telangana State Disaster Management Authority (TSDMA) • G.O. Ms No. 17 SDRF Regulations • Section 43/66 IT Act 2000
      </footer>
    </div>
  );
};
