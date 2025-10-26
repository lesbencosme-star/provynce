import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';

export default function LandingPage() {
  const router = useRouter();
  const { createAccount, login } = useUser();
  const { showSuccess, showError } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }

    if (!isLogin && !name) {
      showError('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        showSuccess(`Welcome back!`);
      } else {
        await createAccount(name, email, password);
        showSuccess(`Welcome to Provynce, ${name}! 🎉`);
      }

      // Small delay for UX
      setTimeout(() => {
        router.reload();
      }, 500);
    } catch (error: any) {
      showError(error.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stellar-navy-dark via-blue-900 to-stellar-navy flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Provynce
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-stellar-blue to-purple-500 rounded-full mx-auto lg:mx-0"></div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
            Transparent Infrastructure Funding
          </h2>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Track public infrastructure projects with blockchain-verified milestones,
            real-time funding transparency, and community engagement—all powered by Stellar.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Blockchain Verified</h3>
                <p className="text-gray-400 text-sm">Every transaction recorded on Stellar's blockchain</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-stellar-blue/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-stellar-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Real-Time Tracking</h3>
                <p className="text-gray-400 text-sm">Live updates on project milestones and fund releases</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Community Driven</h3>
                <p className="text-gray-400 text-sm">Engage with projects, ask questions, and stay informed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h3>
            <p className="text-gray-400">
              {isLogin
                ? 'Sign in to access your dashboard'
                : 'Create your account to track infrastructure projects'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stellar-blue focus:border-transparent transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stellar-blue focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stellar-blue focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-white/10 cursor-not-allowed'
                  : 'bg-gradient-to-r from-stellar-blue to-blue-600 hover:from-stellar-blue-dark hover:to-blue-700 shadow-lg shadow-stellar-blue/30'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                  </svg>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="text-stellar-blue hover:text-stellar-blue-light transition-colors text-sm font-semibold"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Powered by Stellar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <span>Powered by</span>
              <svg className="w-5 h-5 text-stellar-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.283 1.851L6 5.116v13.768l6.283-3.265 6.283 3.265V5.116L12.283 1.851z"/>
              </svg>
              <span className="text-stellar-blue font-bold">Stellar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
