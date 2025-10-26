import { useState, useEffect } from 'react';
import Head from 'next/head';
import EnhancedProjectCard from '@/components/EnhancedProjectCard';
import GlobalImpact from '@/components/GlobalImpact';
import FilterNavbar from '@/components/FilterNavbar';
import WalletConnect from '@/components/WalletConnect';
import PublicTimeline from '@/components/PublicTimeline';
import CitizenEngagementPanel from '@/components/CitizenEngagementPanel';
import ServiceNotices from '@/components/ServiceNotices';
import StellarFooter from '@/components/StellarFooter';
import LandingPage from '@/components/LandingPage';
import { useUser } from '@/context/UserContext';
import demoData from '@/data/demo.json';

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
  milestones: any[];
  team: {
    role: string;
    name: string;
    avatar: string;
    walletAddress: string;
  }[];
}

export default function Home() {
  const { user, logout } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    // Load demo data
    setProjects(demoData.projects as Project[]);
  }, []);

  // Show landing page if user is not authenticated
  if (!user) {
    return <LandingPage />;
  }

  const filteredProjects = projects
    .filter((project) => {
      // Apply category filter
      let matchesFilter = true;
      if (filter !== 'all') {
        if (filter === 'active') matchesFilter = project.active;
        else if (filter === 'completed') matchesFilter = !project.active;
        else matchesFilter = project.category === filter;
      }

      // Apply search filter
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'budget':
          return parseFloat(b.total_budget) - parseFloat(a.total_budget);
        case 'progress':
          const progressA = (parseFloat(a.released_funds) / parseFloat(a.total_budget)) * 100;
          const progressB = (parseFloat(b.released_funds) / parseFloat(b.total_budget)) * 100;
          return progressB - progressA;
        case 'startDate':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        default:
          return 0;
      }
    });

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.active).length,
    totalBudget: projects.reduce(
      (sum, p) => sum + parseFloat(p.total_budget),
      0
    ),
    releasedFunds: projects.reduce(
      (sum, p) => sum + parseFloat(p.released_funds),
      0
    ),
  };

  return (
    <>
      <Head>
        <title>Provynce - Infrastructure Funding on Stellar</title>
        <meta
          name="description"
          content="Automated infrastructure funding through Stellar smart contracts with milestone-based payments"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stellar-navy-dark via-blue-900 to-stellar-navy">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Provynce</h1>
                <p className="text-gray-300 mt-1">
                  Smart Infrastructure Funding on Stellar
                </p>
              </div>
              <div className="flex gap-4 items-center">
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
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Global Impact Dashboard */}
        <section className="container mx-auto px-6 py-8">
          <GlobalImpact />
        </section>

        {/* Stats Dashboard */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm">Total Projects</p>
              <p className="text-4xl font-bold text-white mt-2">
                {stats.totalProjects}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm">Active Projects</p>
              <p className="text-4xl font-bold text-green-400 mt-2">
                {stats.activeProjects}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm">Total Budget</p>
              <p className="text-4xl font-bold text-stellar-blue mt-2">
                ${(stats.totalBudget / 1_000_000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm">Funds Released</p>
              <p className="text-4xl font-bold text-stellar-blue-light mt-2">
                ${(stats.releasedFunds / 1_000_000).toFixed(1)}M
              </p>
            </div>
          </div>

          {/* Public Timeline & Citizen Hub */}
          <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1.1fr]">
            <PublicTimeline />
            <div className="space-y-6">
              <CitizenEngagementPanel
                projects={projects.map((project) => ({
                  id: project.id,
                  name: project.name,
                  category: project.category,
                  location: project.location,
                }))}
              />
            </div>
          </div>
        </section>

        {/* Filter Navbar - Sticky */}
        <FilterNavbar
          categories={['all', 'active', 'completed', 'Bridge', 'Renewable Energy', 'Water', 'Green Infrastructure', 'Public Transit']}
          activeFilter={filter}
          onFilterChange={setFilter}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          sortBy={sortBy}
        />

        {/* Projects Section */}
        <section className="container mx-auto px-6 py-8">
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <EnhancedProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects found</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <StellarFooter />
      </main>
    </>
  );
}
