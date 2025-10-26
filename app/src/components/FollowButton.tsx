import { useState } from 'react';
import { useFollow } from '@/context/FollowContext';
import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';

interface FollowButtonProps {
  projectId: number;
  projectName: string;
  variant?: 'default' | 'compact';
}

export default function FollowButton({ projectId, projectName, variant = 'default' }: FollowButtonProps) {
  const { isFollowing, followProject, unfollowProject } = useFollow();
  const { showSuccess, showInfo } = useToast();
  const { user } = useUser();
  const [showTooltip, setShowTooltip] = useState(false);
  const following = isFollowing(projectId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showInfo('Create an account to follow projects and receive updates.');
      return;
    }

    if (following) {
      unfollowProject(projectId);
      showInfo(`Unfollowed ${projectName}`);
    } else {
      followProject(projectId, projectName);
      showSuccess(`Following ${projectName} - You'll receive milestone updates!`);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-lg transition-all ${
          following
            ? 'bg-stellar-blue/20 text-stellar-blue border border-stellar-blue/50'
            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
        }`}
        title={following ? 'Unfollow project' : 'Follow for updates'}
      >
        <svg className="w-5 h-5" fill={following ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
          following
            ? 'bg-stellar-blue/20 text-stellar-blue border border-stellar-blue/50 hover:bg-stellar-blue/30'
            : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white'
        }`}
      >
        <svg className="w-5 h-5" fill={following ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {following ? 'Following' : 'Follow Project'}
      </button>

      {showTooltip && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg text-sm whitespace-nowrap z-10">
          You'll receive updates for this project
        </div>
      )}
    </div>
  );
}
