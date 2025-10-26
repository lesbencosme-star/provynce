import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useToast } from '@/context/ToastContext';
import demoData from '@/data/demo.json';

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
}

export default function Signup() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [allNotifications, setAllNotifications] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(demoData.projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      location: p.location,
    })));
  }, []);

  const toggleProject = (projectId: number) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  const toggleAllProjects = () => {
    if (allNotifications) {
      setSelectedProjects([]);
      setAllNotifications(false);
    } else {
      setSelectedProjects(projects.map((p) => p.id));
      setAllNotifications(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }

    if (selectedProjects.length === 0) {
      showError('Please select at least one project to follow');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Store in localStorage
      const subscription = {
        email,
        projects: selectedProjects,
        subscribedAt: new Date().toISOString(),
      };
      localStorage.setItem('communitySubscription', JSON.stringify(subscription));

      showSuccess(
        <div>
          <p className="font-bold mb-1">Welcome to Provynce!</p>
          <p className="text-sm">You'll receive updates for {selectedProjects.length} project{selectedProjects.length > 1 ? 's' : ''}</p>
        </div>,
        5000
      );

      setIsSubmitting(false);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bridge':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Renewable Energy':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Water':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case 'Green Infrastructure':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'Public Transit':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up for Updates - Provynce</title>
        <meta name="description" content="Stay informed about infrastructure projects in your community" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stellar-navy-dark via-blue-900 to-stellar-navy">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <div className="cursor-pointer">
                  <h1 className="text-3xl font-bold text-white">Provynce</h1>
                  <p className="text-gray-300 mt-1 text-sm">
                    Community Updates
                  </p>
                </div>
              </Link>
              <Link href="/">
                <button className="px-4 py-2 text-white hover:text-stellar-blue transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Stay Connected with Your Community
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Get real-time updates on infrastructure projects in your area. Receive notifications about milestones,
                service notices, and funding releases directly to your inbox.
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              {/* Email Input */}
              <div className="mb-8">
                <label htmlFor="email" className="block text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-stellar-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-blue focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Project Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-white font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-stellar-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Select Projects to Follow
                  </label>
                  <button
                    type="button"
                    onClick={toggleAllProjects}
                    className="text-stellar-blue hover:text-stellar-blue-light text-sm font-semibold transition-colors"
                  >
                    {allNotifications ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Choose the projects you want to receive updates about. You'll be notified when milestones are completed,
                  funds are released, or service notices are posted.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => toggleProject(project.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedProjects.includes(project.id)
                          ? 'bg-stellar-blue/20 border-stellar-blue shadow-lg shadow-stellar-blue/20'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          selectedProjects.includes(project.id)
                            ? 'bg-stellar-blue border-stellar-blue'
                            : 'border-white/30'
                        }`}>
                          {selectedProjects.includes(project.id) && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Project Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{project.name}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400 flex items-center gap-1">
                              {getCategoryIcon(project.category)}
                              {project.category}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {project.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProjects.length > 0 && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-300 text-sm flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {selectedProjects.length} project{selectedProjects.length > 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !email || selectedProjects.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || !email || selectedProjects.length === 0
                    ? 'bg-white/10 cursor-not-allowed'
                    : 'bg-gradient-to-r from-stellar-blue to-blue-600 hover:from-stellar-blue-dark hover:to-blue-700 shadow-lg shadow-stellar-blue/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                    </svg>
                    Signing You Up...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Subscribe to Updates
                  </>
                )}
              </button>
            </form>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-stellar-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-stellar-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Real-Time Alerts</h3>
                <p className="text-gray-400 text-sm">Get instant notifications when milestones are completed</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Blockchain Verified</h3>
                <p className="text-gray-400 text-sm">All updates are verified on Stellar's blockchain</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Privacy First</h3>
                <p className="text-gray-400 text-sm">Your email is never shared or sold to third parties</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
