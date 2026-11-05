import React, { useState, useEffect } from 'react';
import { 
  InstagramAccount, 
  AnalysedPost, 
  SavedInsight, 
  DiscoveredAccount 
} from '../../types';
import { 
  INITIAL_INSTAGRAM_ACCOUNTS, 
  INITIAL_ANALYSED_POSTS, 
  INITIAL_KNOWLEDGE_LIBRARY,
  INITIAL_DISCOVERED_ACCOUNTS
} from '../../data/instagramInitialData';

import { AccountDirectoryView } from './AccountDirectoryView';
import { PostAnalysisView } from './PostAnalysisView';
import { KnowledgeLibraryView } from './KnowledgeLibraryView';
import { AccountComparisonArena } from './AccountComparisonArena';
import { AddAccountModal } from './AddAccountModal';
import { AccountDetailModal } from './AccountDetailModal';
import { DiscoverExpertsModal } from './DiscoverExpertsModal';

import { 
  Instagram, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Users, 
  FileText, 
  ArrowLeft,
  ShieldCheck,
  BookmarkCheck,
  RefreshCw,
  Plus
} from 'lucide-react';

interface InstagramIntelligenceDashboardProps {
  onBackToCalculator: () => void;
  onOpenLoanAdvisor: () => void;
  savedInsights: SavedInsight[];
  onUpdateInsights: (insights: SavedInsight[]) => void;
}

export const InstagramIntelligenceDashboard: React.FC<InstagramIntelligenceDashboardProps> = ({
  onBackToCalculator,
  onOpenLoanAdvisor,
  savedInsights,
  onUpdateInsights,
}) => {
  // Navigation tab within Instagram Intelligence
  const [activeTab, setActiveTab] = useState<'directory' | 'feed' | 'library' | 'comparison'>('directory');

  // Accounts state (persisted in localStorage)
  const [accounts, setAccounts] = useState<InstagramAccount[]>(() => {
    try {
      const saved = localStorage.getItem('loanguru_ig_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('[Dashboard] Could not parse saved accounts:', e);
    }
    return INITIAL_INSTAGRAM_ACCOUNTS;
  });

  // Posts state (persisted in localStorage)
  const [posts, setPosts] = useState<AnalysedPost[]>(() => {
    try {
      const saved = localStorage.getItem('loanguru_ig_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('[Dashboard] Could not parse saved posts:', e);
    }
    return INITIAL_ANALYSED_POSTS;
  });

  // Discovered experts state
  const [discoveredExperts, setDiscoveredExperts] = useState<DiscoveredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('loanguru_ig_discovered');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('[Dashboard] Could not parse discovered experts:', e);
    }
    return INITIAL_DISCOVERED_ACCOUNTS;
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<InstagramAccount | null>(null);

  const [selectedDetailAccount, setSelectedDetailAccount] = useState<InstagramAccount | null>(null);
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('loanguru_ig_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.warn('[Dashboard] Error persisting accounts:', e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('loanguru_ig_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn('[Dashboard] Error persisting posts:', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('loanguru_ig_discovered', JSON.stringify(discoveredExperts));
    } catch (e) {
      console.warn('[Dashboard] Error persisting discovered:', e);
    }
  }, [discoveredExperts]);

  // Handlers
  const handleSaveAccount = (newAccount: InstagramAccount) => {
    setAccounts((prev) => {
      const exists = prev.findIndex((a) => a.id === newAccount.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = newAccount;
        return copy;
      }
      return [newAccount, ...prev];
    });
    setAccountToEdit(null);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to remove this account from your monitoring directory?')) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      if (selectedDetailAccount?.id === id) {
        setSelectedDetailAccount(null);
      }
    }
  };

  const handleToggleMonitoring = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isMonitoring: !a.isMonitoring } : a))
    );
  };

  const handleAddPost = (newPost: AnalysedPost) => {
    setPosts((prev) => [newPost, ...prev]);

    // Increment post count on the attributed account
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === newPost.accountId
          ? { ...acc, postsAnalysedCount: acc.postsAnalysedCount + 1 }
          : acc
      )
    );
  };

  const handleTransferToKnowledge = (newInsight: SavedInsight) => {
    onUpdateInsights([newInsight, ...savedInsights]);
  };

  const handleToggleInsightApproval = (id: string) => {
    onUpdateInsights(
      savedInsights.map((ins) =>
        ins.id === id
          ? {
              ...ins,
              approvedForLoanAdvisor: !ins.approvedForLoanAdvisor,
              status: !ins.approvedForLoanAdvisor ? 'approved' : 'pending',
            }
          : ins
      )
    );
  };

  const handleDeleteInsight = (id: string) => {
    if (confirm('Are you sure you want to remove this verified insight from your library?')) {
      onUpdateInsights(savedInsights.filter((ins) => ins.id !== id));
    }
  };

  const handleEditInsight = (updated: SavedInsight) => {
    onUpdateInsights(
      savedInsights.map((ins) => (ins.id === updated.id ? updated : ins))
    );
  };

  const handleAddDiscoveredAccount = (discovered: DiscoveredAccount) => {
    const isCA = discovered.category === 'chartered_accountants';
    const isOfficial = discovered.username.toLowerCase().includes('rbi');

    const newAcc: InstagramAccount = {
      id: `acc-${Date.now()}`,
      username: discovered.username,
      profileUrl: discovered.profileUrl,
      accountName: discovered.accountName,
      category: discovered.category,
      personalNotes: `Discovered via AI recommendation: ${discovered.whyRelevant}`,
      description: `${discovered.mainAreaOfExpertise}. Evidence: ${discovered.evidenceOfCredibility}`,
      verificationStatus: discovered.isVerifiable ? (isOfficial ? 'verified_official' : 'independently_verified') : 'unverified',
      lastAnalysedDate: 'Today',
      postsAnalysedCount: 2,
      usefulnessScore: {
        overall: discovered.recommendation === 'add' ? 88 : 55,
        accuracySources: discovered.isVerifiable ? 90 : 50,
        relevanceToBorrowers: 88,
        practicalUsefulness: 85,
        regulatoryAwareness: 82,
        transparencyCredibility: discovered.isVerifiable ? 85 : 45,
        reasons: [
          `Main expertise: ${discovered.mainAreaOfExpertise}`,
          `Credibility basis: ${discovered.evidenceOfCredibility}`,
        ],
      },
      credibility: {
        operatorIdentity: discovered.accountName,
        isIdentifiable: discovered.isVerifiable,
        verifiableQualifications: discovered.evidenceOfCredibility,
        citesOfficialSources: discovered.isVerifiable,
        contentNature: 'educational',
        exaggeratedClaims: !discovered.isVerifiable,
        potentialConflicts: discovered.potentialLimitations,
      },
      expertOpinion: {
        usefulKnowledge: discovered.whyRelevant,
        bestTopics: [discovered.mainAreaOfExpertise, 'Loan due diligence', 'Regulatory rights'],
        loanInformationToExtract: 'Actionable borrowing strategies and bank compliance checks.',
        financialOpportunities: 'Sanction fee waivers and rate spread optimization.',
        missingCriticalInfo: discovered.potentialLimitations,
        suitabilityForIndians: 'High for Indian borrowers.',
        claimsNeedingVerification: [],
        keepInLibrary: discovered.recommendation === 'add',
        decisionImprovementTip: 'Cross-check recommendations with current RBI regulations.',
        relatedCategoriesToResearch: ['rbi_banking_info', 'consumer_rights_legal'],
      },
      label: discovered.recommendation === 'add' ? 'trusted' : 'needs_verification',
      isMonitoring: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    handleSaveAccount(newAcc);
    setDiscoveredExperts((prev) =>
      prev.map((d) => (d.id === discovered.id ? { ...d, addedToDirectory: true } : d))
    );
  };

  const approvedInsightsCount = savedInsights.filter((i) => i.approvedForLoanAdvisor).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCalculator}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Loan Calculator & Amortization</span>
        </button>

        <button
          onClick={onOpenLoanAdvisor}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask LoanGuru AI (With {approvedInsightsCount} Verified Insights)</span>
        </button>
      </div>

      {/* Main Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              INSTAGRAM ACCOUNT INTELLIGENCE
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-4xl leading-relaxed">
              Discover, monitor and analyse financial experts, banking professionals and Instagram accounts to identify valuable loan insights, financial opportunities and hidden banking conditions.
            </p>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('directory')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'directory'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Account Directory ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'feed'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Post Analysis & Feed ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'library'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Library ({savedInsights.length})</span>
            {approvedInsightsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'comparison'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Compare Accounts</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'directory' && (
        <AccountDirectoryView
          accounts={accounts}
          onOpenAddModal={() => {
            setAccountToEdit(null);
            setIsAddModalOpen(true);
          }}
          onOpenDiscoverModal={() => setIsDiscoverModalOpen(true)}
          onSelectAccount={(acc) => setSelectedDetailAccount(acc)}
          onEditAccount={(acc) => {
            setAccountToEdit(acc);
            setIsAddModalOpen(true);
          }}
          onDeleteAccount={handleDeleteAccount}
          onToggleMonitoring={handleToggleMonitoring}
          onOpenAnalyzePost={(acc) => {
            setActiveTab('feed');
          }}
          onNavigateToComparison={() => setActiveTab('comparison')}
        />
      )}

      {activeTab === 'feed' && (
        <PostAnalysisView
          posts={posts}
          accounts={accounts}
          onAddPost={handleAddPost}
          onTransferToKnowledge={handleTransferToKnowledge}
        />
      )}

      {activeTab === 'library' && (
        <KnowledgeLibraryView
          insights={savedInsights}
          onToggleApproval={handleToggleInsightApproval}
          onDeleteInsight={handleDeleteInsight}
          onEditInsight={handleEditInsight}
        />
      )}

      {activeTab === 'comparison' && (
        <AccountComparisonArena accounts={accounts} />
      )}

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAccountToEdit(null);
        }}
        onSaveAccount={handleSaveAccount}
        accountToEdit={accountToEdit}
      />

      <AccountDetailModal
        isOpen={Boolean(selectedDetailAccount)}
        onClose={() => setSelectedDetailAccount(null)}
        account={selectedDetailAccount}
        onUpdateAccount={(updated) => {
          handleSaveAccount(updated);
          setSelectedDetailAccount(updated);
        }}
        onOpenAddPostForAccount={(acc) => {
          setActiveTab('feed');
        }}
      />

      <DiscoverExpertsModal
        isOpen={isDiscoverModalOpen}
        onClose={() => setIsDiscoverModalOpen(false)}
        discoveredAccounts={discoveredExperts}
        existingAccounts={accounts}
        onAddDiscoveredAccount={handleAddDiscoveredAccount}
      />
    </div>
  );
};
