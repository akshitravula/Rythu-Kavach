'use client';

import React, { useState, useEffect } from 'react';
import { FarmerClaim, Language } from '@/types/claim';
import { INITIAL_CLAIMS } from '@/data/mockClaims';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { ClaimsList } from '@/components/ClaimsList';
import { ClaimDetail } from '@/components/ClaimDetail';
import { OfficerDecisionModal } from '@/components/OfficerDecisionModal';
import { SanctionOrderModal } from '@/components/SanctionOrderModal';
import { NewClaimModal } from '@/components/NewClaimModal';
import { OfficerLogin } from '@/components/OfficerLogin';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [officerEmail, setOfficerEmail] = useState<string>('tahsildar.maheshwaram@telangana.gov.in');
  const [claims, setClaims] = useState<FarmerClaim[]>(INITIAL_CLAIMS);
  const [selectedClaimId, setSelectedClaimId] = useState<string>(INITIAL_CLAIMS[0].id);
  const [lang, setLang] = useState<Language>('te'); // Default to Telugu (Local Language)
  const [officerRole, setOfficerRole] = useState<'MAO' | 'MRO' | 'COLLECTOR'>('MRO');

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [villageFilter, setVillageFilter] = useState('');
  const [sortBy, setSortBy] = useState('SLA');

  // Modals
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionActionType, setDecisionActionType] = useState<'APPROVE' | 'RETURN' | 'REJECT'>('APPROVE');
  const [isSanctionOrderModalOpen, setIsSanctionOrderModalOpen] = useState(false);
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedClaims = localStorage.getItem('rythu_kavach_claims');
      if (savedClaims) {
        const parsed = JSON.parse(savedClaims);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((c: FarmerClaim) => {
            if (c.damagePhotoUrl?.includes('unsplash')) {
              const initial = INITIAL_CLAIMS.find((ic) => ic.id === c.id);
              return {
                ...c,
                damagePhotoUrl: initial ? initial.damagePhotoUrl : '/images/crops/cotton_damage.jpg'
              };
            }
            return c;
          });
          setClaims(sanitized);
          setSelectedClaimId(sanitized[0].id);
        }
      }
      const savedLang = localStorage.getItem('rythu_kavach_lang');
      if (savedLang === 'te' || savedLang === 'en' || savedLang === 'hi') {
        setLang(savedLang);
      }

      const savedAuth = localStorage.getItem('rythu_kavach_auth');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        if (authData?.isAuth) {
          setIsAuthenticated(true);
          if (authData.role) setOfficerRole(authData.role);
          if (authData.email) setOfficerEmail(authData.email);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = (role: 'MAO' | 'MRO' | 'COLLECTOR', email: string) => {
    setOfficerRole(role);
    setOfficerEmail(email);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('rythu_kavach_auth', JSON.stringify({ isAuth: true, role, email }));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('rythu_kavach_auth');
    } catch {
      // ignore
    }
  };

  // Save changes to localStorage
  const saveClaims = (updated: FarmerClaim[]) => {
    setClaims(updated);
    try {
      localStorage.setItem('rythu_kavach_claims', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('rythu_kavach_lang', newLang);
    } catch {
      // ignore
    }
  };

  const handleResetData = () => {
    if (window.confirm(lang === 'te' ? 'అన్ని డెమో డేటాను పునరుద్ధరించాలా?' : 'Reset all claims to original demo data?')) {
      setClaims(INITIAL_CLAIMS);
      setSelectedClaimId(INITIAL_CLAIMS[0].id);
      try {
        localStorage.removeItem('rythu_kavach_claims');
      } catch {
        // ignore
      }
    }
  };

  const handleOpenDecisionModal = (type: 'APPROVE' | 'RETURN' | 'REJECT') => {
    setDecisionActionType(type);
    setIsDecisionModalOpen(true);
  };

  const handleConfirmDecision = (decisionData: {
    action: 'APPROVE' | 'RETURN' | 'REJECT';
    approvedAmount?: number;
    remarks: string;
    returnReasons?: string[];
    rejectionCode?: string;
  }) => {
    const updatedClaims = claims.map((c) => {
      if (c.id === selectedClaimId) {
        let newStatus = c.status;
        if (decisionData.action === 'APPROVE') newStatus = 'APPROVED_SANCTIONED';
        else if (decisionData.action === 'RETURN') newStatus = 'RETURNED_TO_FARMER';
        else if (decisionData.action === 'REJECT') newStatus = 'REJECTED';

        const roleName = officerRole === 'MAO' ? 'Mandal Agriculture Officer' : officerRole === 'MRO' ? 'Tahsildar / MRO' : 'District Collector';
        const timestamp = new Date().toISOString();

        const auditAction = decisionData.action === 'APPROVE'
          ? `Sanctioned relief of ₹${decisionData.approvedAmount?.toLocaleString('en-IN')} by ${roleName}`
          : decisionData.action === 'RETURN'
          ? `Returned to applicant for rectification: ${decisionData.returnReasons?.join(', ')}`
          : `Application rejected under code ${decisionData.rejectionCode}`;

        const auditActionTe = decisionData.action === 'APPROVE'
          ? `${roleName} ద్వారా ₹${decisionData.approvedAmount?.toLocaleString('en-IN')} పరిహారం మంజూరు చేయబడింది`
          : decisionData.action === 'RETURN'
          ? `సవరణల కోసం రైతుకు తిప్పి పంపబడింది`
          : `దరఖాస్తు తిరస్కరించబడింది`;

        return {
          ...c,
          status: newStatus,
          officerDecision: {
            action: decisionData.action,
            decidedBy: `${roleName} (${c.cadastral.mandal})`,
            officerRole,
            timestamp,
            approvedAmount: decisionData.approvedAmount,
            remarks: decisionData.remarks,
            returnReasons: decisionData.returnReasons,
            rejectionCode: decisionData.rejectionCode,
            sanctionOrderNumber: `TS/SDRF/2026/${c.id.replace('RK-2026-', '')}`,
            digitalSignatureHash: `SHA256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
          },
          auditTrail: [
            ...c.auditTrail,
            {
              id: `aud-${Date.now()}`,
              timestamp,
              actor: `${roleName}`,
              role: officerRole,
              action: auditAction,
              actionTe: auditActionTe,
              notes: decisionData.remarks
            }
          ]
        };
      }
      return c;
    });

    saveClaims(updatedClaims);

    if (decisionData.action === 'APPROVE') {
      setIsSanctionOrderModalOpen(true);
    }
  };

  const handleAddNewClaim = (newClaim: FarmerClaim) => {
    const updated = [newClaim, ...claims];
    saveClaims(updated);
    setSelectedClaimId(newClaim.id);
  };

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  // If not logged in, render the official Government Officer Login Portal
  if (!isAuthenticated) {
    return (
      <OfficerLogin
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onLoginSuccess={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* 1. Official Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        officerRole={officerRole}
        onRoleChange={setOfficerRole}
        onOpenNewClaimModal={() => setIsNewClaimModalOpen(true)}
        onResetData={handleResetData}
        onLogout={handleLogout}
        officerEmail={officerEmail}
      />

      {/* 2. Main Content Dashboard (Clean, Open, Breathing) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Metrics */}
        <StatsOverview
          claims={claims}
          lang={lang}
          onFilterUrgent={() => setStatusFilter('URGENT')}
          onFilterAnomalies={() => setStatusFilter('ANOMALIES')}
        />

        {/* Two-Column Clean Synchronized Cockpit (Equal Heights, Zero Empty Space) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Prioritized Claims Queue */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <ClaimsList
              claims={claims}
              selectedClaimId={selectedClaimId}
              onSelectClaim={setSelectedClaimId}
              lang={lang}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              villageFilter={villageFilter}
              onVillageFilterChange={setVillageFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>

          {/* Right Column: Claim Inspection Studio */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            {selectedClaim ? (
              <ClaimDetail
                claim={selectedClaim}
                lang={lang}
                officerRole={officerRole}
                onOpenDecisionModal={handleOpenDecisionModal}
                onOpenSanctionOrder={() => setIsSanctionOrderModalOpen(true)}
              />
            ) : (
              <div className="bg-white rounded-xl p-16 text-center text-slate-400 border border-slate-200">
                <p>Select a claim from the queue to inspect</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Decision Action Modal */}
      {isDecisionModalOpen && selectedClaim && (
        <OfficerDecisionModal
          claim={selectedClaim}
          actionType={decisionActionType}
          officerRole={officerRole}
          lang={lang}
          onClose={() => setIsDecisionModalOpen(false)}
          onConfirmDecision={handleConfirmDecision}
        />
      )}

      {/* 4. Formal Sanction Order Proceeding Modal */}
      {isSanctionOrderModalOpen && selectedClaim && (
        <SanctionOrderModal
          claim={selectedClaim}
          lang={lang}
          onClose={() => setIsSanctionOrderModalOpen(false)}
        />
      )}

      {/* 5. Simulation Modal */}
      {isNewClaimModalOpen && (
        <NewClaimModal
          lang={lang}
          onClose={() => setIsNewClaimModalOpen(false)}
          onAddClaim={handleAddNewClaim}
        />
      )}
    </div>
  );
}
