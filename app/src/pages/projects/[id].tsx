import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import MilestoneTimeline from '@/components/MilestoneTimeline';
import ProfessionalCard from '@/components/ProfessionalCard';
import PhotoGallery from '@/components/PhotoGallery';
import TransactionTimeline from '@/components/TransactionTimeline';
import WalletConnect from '@/components/WalletConnect';
import FollowButton from '@/components/FollowButton';
import ImpactCards from '@/components/ImpactCards';
import CommunityTab from '@/components/CommunityTab';
import StellarFooter from '@/components/StellarFooter';
import LandingPage from '@/components/LandingPage';
import { useUser } from '@/context/UserContext';
import demoData from '@/data/demo.json';

interface Milestone {
  id: number;
  project_id: number;
  description: string;
  amount: string;
  verifications_required: number;
  verifications_received: number;
  completed: boolean;
  target_date: string;
  proof_url?: string;
}

interface Professional {
  role: string;
  name: string;
  credentials: string;
  walletAddress: string;
  email: string;
  avatar: string;
}

interface GalleryImage {
  url: string;
  caption: string;
  uploadedBy: string;
  date: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  owner: string;
  total_budget: string;
  released_funds: string;
  active: boolean;
  category: string;
  location: string;
  start_date: string;
  team: Professional[];
  gallery: GalleryImage[];
  milestones: Milestone[];
}

type TabType = 'overview' | 'impact' | 'team' | 'photos' | 'milestones' | 'transactions' | 'community';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, logout } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (id) {
      const projectId = parseInt(id as string);
      const foundProject = demoData.projects.find((p) => p.id === projectId);
      if (foundProject) {
        setProject(foundProject as Project);
      }
    }
  }, [id]);

  // Require authentication
  if (!user) {
    return <LandingPage />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const progressPercentage = (completedMilestones / project.milestones.length) * 100;
  const budgetUsed = (parseFloat(project.released_funds) / parseFloat(project.total_budget)) * 100;

  const tabs: { id: TabType; label: string; icon: JSX.Element; count?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'impact',
      label: 'Impact',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 'team',
      label: 'Team',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      count: project.team?.length || 0,
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      count: project.gallery?.length || 0,
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      count: project.milestones.length,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'community',
      label: 'Community',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>{project.name} - Provynce</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stellar-navy-dark via-blue-900 to-stellar-navy">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/"
                className="text-stellar-blue hover:text-blue-300 transition inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Projects
              </Link>
              <div className="flex gap-3 items-center">
                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-stellar-blue/30 rounded-full flex items-center justify-center">
                      <span className="text-stellar-blue font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-semibold">{user.name || 'User'}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                )}

                <WalletConnect />

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {project.location}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="px-3 py-1 bg-stellar-blue/30 text-stellar-blue rounded-full text-sm font-semibold">
                    {project.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      project.active
                        ? 'bg-green-500/30 text-green-400'
                        : 'bg-gray-500/30 text-gray-400'
                    }`}
                  >
                    {project.active ? 'Active' : 'Completed'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FollowButton projectId={project.id} projectName={project.name} />
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="container mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'text-stellar-blue border-b-2 border-stellar-blue bg-white/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? 'bg-stellar-blue text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {/* Project Description */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Project Overview
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Start Date</p>
                        <p className="text-white font-semibold">
                          {new Date(project.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Project Owner</p>
                        <p className="text-white font-mono text-sm">
                          {project.owner.slice(0, 8)}...{project.owner.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">Progress</h2>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300">Milestones</span>
                          <span className="text-white font-semibold">
                            {completedMilestones} / {project.milestones.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-400 to-stellar-blue h-3 rounded-full transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300">Budget Used</span>
                          <span className="text-white font-semibold">
                            ${(parseFloat(project.released_funds) / 1_000_000).toFixed(2)}M / $
                            {(parseFloat(project.total_budget) / 1_000_000).toFixed(2)}M
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-stellar-blue h-3 rounded-full transition-all"
                            style={{ width: `${budgetUsed}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                      <p className="text-gray-300 text-sm mb-2">Team Members</p>
                      <p className="text-4xl font-bold text-white">{project.team?.length || 0}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                      <p className="text-gray-300 text-sm mb-2">Site Photos</p>
                      <p className="text-4xl font-bold text-white">{project.gallery?.length || 0}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Impact Tab */}
              {activeTab === 'impact' && (
                <div>
                  <ImpactCards projectId={project.id} category={project.category} />
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Project Team</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.team?.map((member, index) => (
                      <ProfessionalCard key={index} professional={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* Photos Tab */}
              {activeTab === 'photos' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Site Photos & Documentation
                  </h2>
                  <PhotoGallery images={project.gallery || []} />
                </div>
              )}

              {/* Milestones Tab */}
              {activeTab === 'milestones' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Milestone Timeline
                  </h2>
                  <MilestoneTimeline milestones={project.milestones} />
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div>
                  <TransactionTimeline projectId={project.id} projectName={project.name} />
                </div>
              )}

              {/* Community Tab */}
              {activeTab === 'community' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Community Hub
                  </h2>
                  <CommunityTab projectId={project.id} projectName={project.name} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">
                  Budget Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Budget</span>
                    <span className="text-white font-semibold">
                      ${(parseFloat(project.total_budget) / 1_000_000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Released</span>
                    <span className="text-green-400 font-semibold">
                      ${(parseFloat(project.released_funds) / 1_000_000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Remaining</span>
                    <span className="text-stellar-blue font-semibold">
                      $
                      {(
                        (parseFloat(project.total_budget) -
                          parseFloat(project.released_funds)) /
                        1_000_000
                      ).toFixed(2)}
                      M
                    </span>
                  </div>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">
                  Blockchain Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Network</p>
                    <p className="text-white">Stellar Testnet</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Contract</p>
                    <p className="text-white font-mono text-xs break-all">
                      CCITY...WORKS
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Project ID</p>
                    <p className="text-white">#{project.id}</p>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-stellar-blue text-white rounded-lg hover:bg-blue-500 transition">
                  View on Explorer
                </button>
              </div>

              {/* Actions */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-stellar-blue text-white rounded-lg hover:bg-stellar-blue-dark transition flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Submit Proof
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify Milestone
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Report
                  </button>
                </div>
              </div>

              {/* Status Legend */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Status Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-300">Verified & Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300">In Review / Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-gray-300">Delayed (Past Due)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-stellar-blue"></div>
                    <span className="text-gray-300">Ready for Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <StellarFooter />
      </main>
    </>
  );
}
