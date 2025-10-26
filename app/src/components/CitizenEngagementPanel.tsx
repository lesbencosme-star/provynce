import { FormEvent, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useFollow } from '@/context/FollowContext';
import { useToast } from '@/context/ToastContext';

interface ProjectSummary {
  id: number;
  name: string;
  category: string;
  location: string;
}

interface CitizenEngagementPanelProps {
  projects: ProjectSummary[];
}

export default function CitizenEngagementPanel({ projects }: CitizenEngagementPanelProps) {
  const { user, createAccount, login, logout } = useUser();
  const { isFollowing, followProject, unfollowProject, followedProjects } = useFollow();
  const { showSuccess, showError } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (processing) return;

    try {
      setProcessing(true);
      if (mode === 'register') {
        await createAccount(name, email);
        showSuccess('Account created! Select the projects you want to follow.');
        setName('');
        setEmail('');
      } else {
        await login(email);
        showSuccess('Welcome back! Update your followed projects below.');
        setEmail('');
      }
    } catch (err: any) {
      showError(err?.message || 'Unable to process request');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleFollow = (projectId: number, projectName: string) => {
    if (isFollowing(projectId)) {
      unfollowProject(projectId);
    } else {
      followProject(projectId, projectName);
    }
  };

  return (
    <section className="bg-gradient-to-br from-stellar-navy via-blue-950/70 to-stellar-navy border border-white/10 rounded-3xl shadow-xl overflow-hidden h-full flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Citizen Project Hub</h2>
            <p className="text-sm text-gray-400 mt-1">
              Follow Provynce projects to receive milestone and payment updates.
            </p>
          </div>
          {user && (
            <button
              onClick={logout}
              className="text-xs font-semibold text-red-300 hover:text-red-200 transition"
            >
              Log out
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-6 flex-1 overflow-y-auto space-y-6">
        {!user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <button
                onClick={() => setMode('register')}
                className={`uppercase tracking-wide font-semibold ${
                  mode === 'register' ? 'text-white' : 'text-gray-500 hover:text-white/80'
                }`}
              >
                Create Account
              </button>
              <span>•</span>
              <button
                onClick={() => setMode('login')}
                className={`uppercase tracking-wide font-semibold ${
                  mode === 'login' ? 'text-white' : 'text-gray-500 hover:text-white/80'
                }`}
              >
                Log In
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-400 block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Citizen"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-stellar-blue/50 focus:ring-1 focus:ring-stellar-blue/40"
                    required
                  />
                </div>
              )}
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-400 block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@provynce.gov"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-stellar-blue/50 focus:ring-1 focus:ring-stellar-blue/40"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 bg-stellar-blue text-white rounded-xl py-3 font-semibold hover:bg-stellar-blue-dark transition shadow-lg shadow-stellar-blue/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {mode === 'register' ? 'Create Account' : 'Log In'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-gray-300">Signed in as</p>
              <p className="text-lg font-semibold text-white">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                  Select Projects to Follow
                </h3>
                <span className="text-xs text-gray-400">
                  {followedProjects.length} selected
                </span>
              </div>

              <div className="space-y-3">
                {projects.map((project) => {
                  const following = isFollowing(project.id);
                  return (
                    <label
                      key={project.id}
                      className={`flex items-start gap-3 p-4 rounded-2xl border transition cursor-pointer ${
                        following
                          ? 'border-stellar-blue/60 bg-stellar-blue/10 text-white'
                          : 'border-white/10 bg-black/30 text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={following}
                        onChange={() => handleToggleFollow(project.id, project.name)}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-stellar-blue focus:ring-stellar-blue"
                      />
                      <div>
                        <p className="font-semibold">{project.name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {project.category} • {project.location}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                Notification Preferences
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                You’ll receive a dashboard alert whenever followed projects hit milestones,
                release escrow payments, or share new impact evidence. Email notifications are
                coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
