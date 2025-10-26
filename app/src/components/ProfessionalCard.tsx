import { useState } from 'react';

interface Professional {
  role: string;
  name: string;
  credentials: string;
  walletAddress: string;
  email: string;
  avatar: string;
}

interface ProfessionalCardProps {
  professional: Professional;
  onClick?: () => void;
}

export default function ProfessionalCard({
  professional,
  onClick,
}: ProfessionalCardProps) {
  const [showFullWallet, setShowFullWallet] = useState(false);

  const getRoleIcon = (role: string) => {
    if (role.includes('Manager')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    } else if (role.includes('Engineer')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    } else if (role.includes('Architect')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('Manager')) return 'from-blue-500 to-blue-600';
    if (role.includes('Engineer')) return 'from-cyan-500 to-cyan-600';
    if (role.includes('Architect')) return 'from-green-500 to-green-600';
    return 'from-orange-500 to-orange-600';
  };

  const formatWallet = (address: string) => {
    if (showFullWallet) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all duration-300 ${
        onClick ? 'hover:bg-white/20 cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      {/* Header with Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={professional.avatar}
            alt={professional.name}
            className="w-16 h-16 rounded-full border-4 border-white/20"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br ${getRoleColor(
              professional.role
            )} rounded-full flex items-center justify-center text-white`}
          >
            {getRoleIcon(professional.role)}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{professional.name}</h3>
          <p className="text-stellar-blue text-sm font-semibold">
            {professional.role}
          </p>
        </div>
      </div>

      {/* Credentials */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <p className="text-gray-300 text-sm">{professional.credentials}</p>
        </div>
      </div>

      {/* Contact & Wallet */}
      <div className="space-y-2">
        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <a
            href={`mailto:${professional.email}`}
            className="text-gray-300 hover:text-stellar-blue transition"
            onClick={(e) => e.stopPropagation()}
          >
            {professional.email}
          </a>
        </div>

        {/* Wallet Address */}
        <div className="flex items-center gap-2 text-sm bg-black/30 rounded-lg p-2">
          <svg
            className="w-4 h-4 text-stellar-blue flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <span className="text-gray-300 font-mono text-xs flex-1">
            {formatWallet(professional.walletAddress)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullWallet(!showFullWallet);
            }}
            className="text-stellar-blue hover:text-blue-300 transition"
            title={showFullWallet ? 'Hide' : 'Show full address'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(professional.walletAddress);
            }}
            className="text-stellar-blue hover:text-blue-300 transition"
            title="Copy wallet address"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
